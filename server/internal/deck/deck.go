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

type CardSummary struct { // ← ไม่ใช่ card.Card
	ID    string `json:"id"`
	Front string `json:"front"`
	Back  string `json:"back"`
}

type CreateDeckReq struct {
	Title       string `json:"title"`
	Description string `json:"description"`
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
	UpdateDeck(c context.Context, deckID string, userID string, req *CreateDeckReq) (*Deck, error)
	DeleteDeck(c context.Context, deckID string, userID string) error
	GetDeckWithCards(c context.Context, deckID string, userID string) (*Deck, error)
}

type Repository interface {
	CreateDeck(ctx context.Context, deck *Deck) (*Deck, error)
	GetDeckByID(ctx context.Context, deckID string) (*Deck, error)
	GetDecksByUserID(ctx context.Context, userID string) ([]*Deck, error)
	UpdateDeck(ctx context.Context, deck *Deck) (*Deck, error)
	DeleteDeck(ctx context.Context, deckID string, userID string) error
	GetDeckWithCards(ctx context.Context, deckID string) (*Deck, error)
}
