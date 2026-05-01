package card

import (
	"context"
	"time"
)

type Card struct {
	ID            string    `json:"id"`
	DeckID        string    `json:"deck_id"`
	Front         string    `json:"front"`
	Back          string    `json:"back"`
	Due           time.Time `json:"due"`
	Stability     float64   `json:"stability"`
	Difficulty    float64   `json:"difficulty"`
	ElapsedDays   int64     `json:"elapsed_days"`
	ScheduledDays int64     `json:"scheduled_days"`
	Reps          int64     `json:"reps"`
	Lapses        int64     `json:"lapses"`
	State         int16     `json:"state"`
	LastReview    time.Time `json:"last_review"`
	CreatedAt     time.Time `json:"created_at"`
}

type CreateCardReq struct {
	Front string `json:"front" binding:"required"`
	Back  string `json:"back"  binding:"required"`
}

type UpdateCardReq struct {
	Front string `json:"front"`
	Back  string `json:"back"`
}

type Service interface {
	CreateCard(ctx context.Context, deckID string, userID string, req *CreateCardReq) (*Card, error)
	UpdateCard(ctx context.Context, cardID string, userID string, req *UpdateCardReq) (*Card, error)
	DeleteCard(ctx context.Context, cardID string, userID string) error
}

type Repository interface {
	CreateCard(ctx context.Context, card *Card) (*Card, error)
	GetCardByID(ctx context.Context, cardID string) (*Card, error)
	UpdateCard(ctx context.Context, card *Card) (*Card, error)
	DeleteCard(ctx context.Context, cardID string) error
	GetDeckByID(ctx context.Context, deckID string) (string, error) // return userID
}
