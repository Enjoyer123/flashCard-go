package deck

import (
	"context"
	"time"
)

type Deck struct {
	ID          string        `json:"id"`
	UserID      string        `json:"user_id"`
	Title       string        `json:"title"`
	Description string        `json:"description"`
	IsPublic    bool          `json:"is_public"`
	CreatedAt   time.Time     `json:"created_at"`
	Cards       []CardSummary `json:"cards"`
}

type CardSummary struct {
	ID    string     `json:"id"`
	Front string     `json:"front"`
	Back  string     `json:"back"`
	Due   *time.Time `json:"due"`
	State int16      `json:"state"`
}

type ForkDeckRes struct {
	ID          string `json:"id"`
	UserID      string `json:"user_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	IsPublic    bool   `json:"is_public"`
	CreatedAt   string `json:"created_at"`
}

type PublicDeckRes struct {
	Data  []*Deck `json:"data"`
	Page  int     `json:"page"`
	Limit int     `json:"limit"`
	Total int     `json:"total"`
}

type DeckStats struct {
	TotalCards    int `json:"total_cards"`
	DueToday      int `json:"due_today"`
	NewCards      int `json:"new_cards"`      // state = 0
	LearningCards int `json:"learning_cards"` // state = 1
	ReviewCards   int `json:"review_cards"`   // state = 2
}

type CreateDeckReq struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type UpdateDeckReq struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	IsPublic    bool   `json:"is_public"`
}

type CreateDeckRes struct {
	ID          string `json:"id"`
	UserID      string `json:"user_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	IsPublic    bool   `json:"is_public"`
	CreatedAt   string `json:"created_at"`
}

type Service interface {
	CreateDeck(c context.Context, userID string, req *CreateDeckReq) (*CreateDeckRes, error)
	GetDeckByID(c context.Context, deckID string) (*Deck, error)
	GetDecksByUserID(c context.Context, userID string) ([]*Deck, error)
	UpdateDeck(c context.Context, deckID string, userID string, req *UpdateDeckReq) (*Deck, error)
	DeleteDeck(c context.Context, deckID string, userID string) error
	GetDeckWithCards(c context.Context, deckID string, userID string) (*Deck, error)
	ForkDeck(c context.Context, deckID string, userID string) (*ForkDeckRes, error)
	GetPublicDecks(c context.Context, search string, page int, limit int) (*PublicDeckRes, error)
	GetDeckStats(c context.Context, deckID string, userID string) (*DeckStats, error)
}

type Repository interface {
	CreateDeck(ctx context.Context, deck *Deck) (*Deck, error)
	GetDeckByID(ctx context.Context, deckID string) (*Deck, error)
	GetDecksByUserID(ctx context.Context, userID string) ([]*Deck, error)
	UpdateDeck(ctx context.Context, deck *Deck) (*Deck, error)
	DeleteDeck(ctx context.Context, deckID string, userID string) error
	GetDeckWithCards(ctx context.Context, deckID string) (*Deck, error)
	ForkDeck(ctx context.Context, deck *Deck, cards []CardSummary, userID string) (*Deck, error)
	GetPublicDecks(ctx context.Context, search string, offset int, limit int) ([]*Deck, error)
	CountPublicDecks(ctx context.Context, search string) (int, error)
	GetDeckStats(ctx context.Context, deckID string) (*DeckStats, error)
}
