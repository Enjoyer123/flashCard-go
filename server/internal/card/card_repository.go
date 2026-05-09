package card

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type DBTX interface {
	ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
	PrepareContext(context.Context, string) (*sql.Stmt, error)
	QueryContext(context.Context, string, ...interface{}) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...interface{}) *sql.Row
}

type repository struct {
	db DBTX
}

func NewRepository(db DBTX) Repository {
	return &repository{db: db}
}

func (r *repository) GetDeckByID(ctx context.Context, deckID string) (string, error) {
	var userID string
	err := r.db.QueryRowContext(ctx, "SELECT user_id FROM decks WHERE id = $1", deckID).Scan(&userID)
	if err != nil {
		return "", err
	}
	return userID, nil
}

func (r *repository) CreateCard(ctx context.Context, card *Card) (*Card, error) {

	now := time.Now()

	if card.ID == "" {
		card.ID = uuid.New().String()
	}
	card.Due = &now
	card.CreatedAt = now

	query := `
        INSERT INTO cards 
            (id, deck_id, front, back, due, stability, difficulty, elapsed_days, scheduled_days, reps, lapses, state, last_review, created_at)
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id, deck_id, front, back, due, stability, difficulty, elapsed_days, scheduled_days, reps, lapses, state, last_review, created_at`

	err := r.db.QueryRowContext(ctx, query,
		card.ID,
		card.DeckID,
		card.Front,
		card.Back,
		card.Due,
		card.Stability,
		card.Difficulty,
		card.ElapsedDays,
		card.ScheduledDays,
		card.Reps,
		card.Lapses,
		card.State,
		card.LastReview,
		card.CreatedAt,
	).Scan(
		&card.ID,
		&card.DeckID,
		&card.Front,
		&card.Back,
		&card.Due,
		&card.Stability,
		&card.Difficulty,
		&card.ElapsedDays,
		&card.ScheduledDays,
		&card.Reps,
		&card.Lapses,
		&card.State,
		&card.LastReview,
		&card.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return card, nil
}

func (r *repository) GetCardByID(ctx context.Context, cardID string) (*Card, error) {
	c := &Card{}
	query := `
		SELECT id, deck_id, front, back, due, stability, difficulty, 
		       elapsed_days, scheduled_days, reps, lapses, state, last_review, created_at 
		FROM cards WHERE id = $1`

	err := r.db.QueryRowContext(ctx, query, cardID).Scan(
		&c.ID, &c.DeckID, &c.Front, &c.Back, &c.Due, &c.Stability, &c.Difficulty,
		&c.ElapsedDays, &c.ScheduledDays, &c.Reps, &c.Lapses, &c.State, &c.LastReview, &c.CreatedAt,
	)

	if err != nil {
		return nil, err
	}
	return c, nil
}

func (r *repository) UpdateCard(ctx context.Context, card *Card) (*Card, error) {
	query := `
		UPDATE cards 
		SET front = $1, back = $2, due = $3, stability = $4, difficulty = $5, 
		    elapsed_days = $6, scheduled_days = $7, reps = $8, lapses = $9, 
		    state = $10, last_review = $11
		WHERE id = $12 
		RETURNING id, deck_id, front, back, due, stability, difficulty, 
		          elapsed_days, scheduled_days, reps, lapses, state, last_review, created_at`

	err := r.db.QueryRowContext(ctx, query,
		card.Front, card.Back, card.Due, card.Stability, card.Difficulty,
		card.ElapsedDays, card.ScheduledDays, card.Reps, card.Lapses,
		card.State, card.LastReview, card.ID,
	).Scan(
		&card.ID, &card.DeckID, &card.Front, &card.Back, &card.Due,
		&card.Stability, &card.Difficulty, &card.ElapsedDays, &card.ScheduledDays,
		&card.Reps, &card.Lapses, &card.State, &card.LastReview, &card.CreatedAt,
	)

	if err != nil {
		return nil, err
	}
	return card, nil
}

func (r *repository) DeleteCard(ctx context.Context, cardID string) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM cards WHERE id = $1", cardID)
	return err
}

func (r *repository) GetDueCards(ctx context.Context, deckID string) ([]*Card, error) {
	query := `
		SELECT id, deck_id, front, back, due, stability, difficulty, 
		       elapsed_days, scheduled_days, reps, lapses, state, last_review, created_at
		FROM cards 
		WHERE deck_id = $1 AND due <= NOW()
		ORDER BY due ASC`

	rows, err := r.db.QueryContext(ctx, query, deckID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	cards := []*Card{}
	for rows.Next() {
		c := &Card{}
		if err := rows.Scan(
			&c.ID, &c.DeckID, &c.Front, &c.Back, &c.Due,
			&c.Stability, &c.Difficulty, &c.ElapsedDays, &c.ScheduledDays,
			&c.Reps, &c.Lapses, &c.State, &c.LastReview, &c.CreatedAt,
		); err != nil {
			return nil, err
		}
		cards = append(cards, c)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return cards, nil
}

func (r *repository) CreateReviewLog(ctx context.Context, review *CardReview) error {
	review.ID = uuid.New().String()
	review.ReviewedAt = time.Now()

	query := `
		INSERT INTO card_reviews (id, card_id, user_id, rating, scheduled_days, elapsed_days, state, reviewed_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

	_, err := r.db.ExecContext(ctx, query,
		review.ID, review.CardID, review.UserID,
		review.Rating, review.ScheduledDays, review.ElapsedDays,
		review.State, review.ReviewedAt,
	)
	return err
}

func (r *repository) GetUserStudyActivity(ctx context.Context, userID string) ([]StudyActivity, error) {
	query := `
		SELECT TO_CHAR(reviewed_at, 'YYYY-MM-DD') as date, COUNT(*) as review_count
		FROM card_reviews
		WHERE user_id = $1 AND reviewed_at >= CURRENT_DATE - INTERVAL '1 year'
		GROUP BY TO_CHAR(reviewed_at, 'YYYY-MM-DD')
		ORDER BY date ASC
	`
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var activities []StudyActivity
	for rows.Next() {
		var a StudyActivity
		if err := rows.Scan(&a.Date, &a.ReviewCount); err != nil {
			return nil, err
		}
		activities = append(activities, a)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return activities, nil
}
