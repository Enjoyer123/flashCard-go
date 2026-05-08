package deck

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
	BeginTx(ctx context.Context, opts *sql.TxOptions) (*sql.Tx, error)
}

type repository struct {
	db DBTX
}

func NewRepository(db DBTX) Repository {
	return &repository{db: db}
}

func (r *repository) CreateDeck(ctx context.Context, deck *Deck) (*Deck, error) {
	query := "INSERT INTO decks(user_id, title, description, is_public) VALUES ($1, $2, $3, $4) RETURNING id, created_at"

	err := r.db.QueryRowContext(ctx, query, deck.UserID, deck.Title, deck.Description, deck.IsPublic).Scan(&deck.ID, &deck.CreatedAt)
	if err != nil {
		return nil, err
	}

	return deck, nil
}

func (r *repository) GetDeckByID(ctx context.Context, deckID string) (*Deck, error) {
	d := Deck{}

	query := "SELECT id, user_id, title, description, is_public, created_at FROM decks WHERE id = $1"
	err := r.db.QueryRowContext(ctx, query, deckID).Scan(&d.ID, &d.UserID, &d.Title, &d.Description, &d.IsPublic, &d.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &d, nil
}

func (r *repository) GetDecksByUserID(ctx context.Context, userID string) ([]*Deck, error) {
	decks := []*Deck{}
	query := "SELECT id, user_id, title, description, is_public, created_at FROM decks WHERE user_id = $1"
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var d Deck

		err := rows.Scan(&d.ID, &d.UserID, &d.Title, &d.Description, &d.IsPublic, &d.CreatedAt)
		if err != nil {
			return nil, err
		}

		decks = append(decks, &d)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return decks, nil
}

func (r *repository) UpdateDeck(ctx context.Context, deck *Deck) (*Deck, error) {
	query := "UPDATE decks SET title = $1, description = $2, is_public = $3 WHERE id = $4 AND user_id = $5 RETURNING id, user_id, title, description, is_public, created_at"
	err := r.db.QueryRowContext(ctx, query, deck.Title, deck.Description, deck.IsPublic, deck.ID, deck.UserID).Scan(&deck.ID, &deck.UserID, &deck.Title, &deck.Description, &deck.IsPublic, &deck.CreatedAt)
	if err != nil {
		return nil, err
	}
	return deck, nil
}

func (r *repository) DeleteDeck(ctx context.Context, deckID string, userID string) error {
	query := "DELETE FROM decks WHERE id = $1 AND user_id = $2"
	_, err := r.db.ExecContext(ctx, query, deckID, userID)
	return err
}

func (r *repository) GetDeckWithCards(ctx context.Context, deckID string) (*Deck, error) {
	deck, err := r.GetDeckByID(ctx, deckID)
	if err != nil {
		return nil, err
	}

	query := `SELECT id, front, back, due, state FROM cards WHERE deck_id = $1 ORDER BY created_at`
	rows, err := r.db.QueryContext(ctx, query, deckID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		c := CardSummary{}
		if err := rows.Scan(&c.ID, &c.Front, &c.Back, &c.Due, &c.State); err != nil {
			return nil, err
		}
		deck.Cards = append(deck.Cards, c)
	}

	return deck, nil
}

func (r *repository) ForkDeck(ctx context.Context, deck *Deck, cards []CardSummary, userID string) (*Deck, error) {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	newDeck := &Deck{}
	err = tx.QueryRowContext(ctx,
		`INSERT INTO decks (user_id, title, description, is_public)
		 VALUES ($1, $2, $3, false)
		 RETURNING id, user_id, title, description, is_public, created_at`,
		userID, deck.Title, deck.Description,
	).Scan(&newDeck.ID, &newDeck.UserID, &newDeck.Title, &newDeck.Description, &newDeck.IsPublic, &newDeck.CreatedAt)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	for _, c := range cards {
		_, err := tx.ExecContext(ctx,
			`INSERT INTO cards (id, deck_id, front, back, due, stability, difficulty, elapsed_days, scheduled_days, reps, lapses, state, created_at)
			 VALUES ($1, $2, $3, $4, $5, 0, 0, 0, 0, 0, 0, 0, $6)`,
			uuid.New().String(), newDeck.ID, c.Front, c.Back, now, now,
		)
		if err != nil {
			return nil, err
		}
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return newDeck, nil
}

func (r *repository) GetPublicDecks(ctx context.Context, search string, offset int, limit int) ([]*Deck, error) {
	query := `
		SELECT id, user_id, title, description, is_public, created_at
		FROM decks
		WHERE is_public = true AND (title ILIKE $1 OR description ILIKE $1)
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`

	rows, err := r.db.QueryContext(ctx, query, "%"+search+"%", limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	decks := []*Deck{}
	for rows.Next() {
		d := &Deck{}
		if err := rows.Scan(&d.ID, &d.UserID, &d.Title, &d.Description, &d.IsPublic, &d.CreatedAt); err != nil {
			return nil, err
		}
		decks = append(decks, d)
	}
	return decks, nil
}

func (r *repository) CountPublicDecks(ctx context.Context, search string) (int, error) {
	var total int
	err := r.db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM decks WHERE is_public = true AND (title ILIKE $1 OR description ILIKE $1)`,
		"%"+search+"%",
	).Scan(&total)
	return total, err
}

func (r *repository) GetDeckStats(ctx context.Context, deckID string) (*DeckStats, error) {
	stats := &DeckStats{}

	query := `
		SELECT
			COUNT(*)                                            AS total_cards,
			COUNT(*) FILTER (WHERE due <= NOW())               AS due_today,
			COUNT(*) FILTER (WHERE state = 0)                  AS new_cards,
			COUNT(*) FILTER (WHERE state = 1)                  AS learning_cards,
			COUNT(*) FILTER (WHERE state = 2)                  AS review_cards
		FROM cards
		WHERE deck_id = $1`

	err := r.db.QueryRowContext(ctx, query, deckID).Scan(
		&stats.TotalCards,
		&stats.DueToday,
		&stats.NewCards,
		&stats.LearningCards,
		&stats.ReviewCards,
	)
	if err != nil {
		return nil, err
	}

	return stats, nil
}
