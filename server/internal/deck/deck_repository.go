package deck

import (
	"context"
	"database/sql"
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

	query := `SELECT id, front, back FROM cards WHERE deck_id = $1 ORDER BY created_at`
	rows, err := r.db.QueryContext(ctx, query, deckID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		c := CardSummary{}
		if err := rows.Scan(&c.ID, &c.Front, &c.Back); err != nil {
			return nil, err
		}
		deck.Cards = append(deck.Cards, c)
	}

	return deck, nil
}
