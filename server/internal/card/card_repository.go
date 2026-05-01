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
	card.ID = uuid.New().String()
	card.Due = time.Now()
	card.CreatedAt = time.Now()

	query := `
		INSERT INTO cards 
			(id, deck_id, front, back, due, stability, difficulty, elapsed_days, scheduled_days, reps, lapses, state, last_review, created_at)
		VALUES 
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		RETURNING id, deck_id, front, back, due, created_at`

	err := r.db.QueryRowContext(ctx, query,
		card.ID, card.DeckID, card.Front, card.Back,
		card.Due, card.Stability, card.Difficulty,
		card.ElapsedDays, card.ScheduledDays,
		card.Reps, card.Lapses, card.State,
		card.LastReview, card.CreatedAt,
	).Scan(&card.ID, &card.DeckID, &card.Front, &card.Back, &card.Due, &card.CreatedAt)
	if err != nil {
		return nil, err
	}

	return card, nil
}

func (r *repository) GetCardByID(ctx context.Context, cardID string) (*Card, error) {
	c := &Card{}
	query := `SELECT id, deck_id, front, back, due, state, created_at FROM cards WHERE id = $1`
	err := r.db.QueryRowContext(ctx, query, cardID).Scan(
		&c.ID, &c.DeckID, &c.Front, &c.Back, &c.Due, &c.State, &c.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return c, nil
}

func (r *repository) UpdateCard(ctx context.Context, card *Card) (*Card, error) {
	query := `UPDATE cards SET front = $1, back = $2 WHERE id = $3 RETURNING id, deck_id, front, back, created_at`
	err := r.db.QueryRowContext(ctx, query, card.Front, card.Back, card.ID).
		Scan(&card.ID, &card.DeckID, &card.Front, &card.Back, &card.CreatedAt)
	if err != nil {
		return nil, err
	}
	return card, nil
}

func (r *repository) DeleteCard(ctx context.Context, cardID string) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM cards WHERE id = $1", cardID)
	return err
}
