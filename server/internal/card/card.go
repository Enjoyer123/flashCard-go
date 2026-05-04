package card

import (
	"context"
	"time"
)

type Card struct {
	ID     string `json:"id"`
	DeckID string `json:"deck_id"`
	Front  string `json:"front"`
	Back   string `json:"back"`

	// FSRS Fields
	Due           *time.Time `json:"due"`
	Stability     float64    `json:"stability"`
	Difficulty    float64    `json:"difficulty"`
	ElapsedDays   int64      `json:"elapsed_days"`
	ScheduledDays int64      `json:"scheduled_days"`
	Reps          int64      `json:"reps"`
	Lapses        int64      `json:"lapses"`
	State         int16      `json:"state"` // 0: New, 1: Learning, 2: Review, 3: Relearning
	LastReview    *time.Time `json:"last_review"`

	CreatedAt time.Time `json:"created_at"`
}

type CardReview struct {
	ID            string    `json:"id"`
	CardID        string    `json:"card_id"`
	UserID        string    `json:"user_id"`
	Rating        int16     `json:"rating"`
	ScheduledDays int64     `json:"scheduled_days"`
	ElapsedDays   int64     `json:"elapsed_days"`
	State         int16     `json:"state"`
	ReviewedAt    time.Time `json:"reviewed_at"`
}

type AutoCardReq struct {
	Word   string `json:"word" binding:"required"`
	DeckID string `json:"deck_id" binding:"required"`
}

type CreateCardReq struct {
	Front string `json:"front" binding:"required"`
	Back  string `json:"back"  binding:"required"`
}

type UpdateCardReq struct {
	Front string `json:"front"`
	Back  string `json:"back"`
}

type ReviewCardReq struct {
	Rating int16 `json:"rating" binding:"required"` // 1: Again, 2: Hard, 3: Good, 4: Easy
}

type Service interface {
	CreateCard(ctx context.Context, deckID string, userID string, req *CreateCardReq) (*Card, error)
	UpdateCard(ctx context.Context, cardID string, userID string, req *UpdateCardReq) (*Card, error)
	DeleteCard(ctx context.Context, cardID string, userID string) error
	GetDueCards(ctx context.Context, deckID string, userID string) ([]*Card, error)
	ReviewCard(ctx context.Context, cardID string, userID string, req *ReviewCardReq) (*Card, error)
	AutoCard(ctx context.Context, userID string, req *AutoCardReq) (*Card, error)
}

type Repository interface {
	CreateCard(ctx context.Context, card *Card) (*Card, error)
	GetCardByID(ctx context.Context, cardID string) (*Card, error)
	UpdateCard(ctx context.Context, card *Card) (*Card, error)
	DeleteCard(ctx context.Context, cardID string) error
	GetDeckByID(ctx context.Context, deckID string) (string, error) // return userID
	GetDueCards(ctx context.Context, deckID string) ([]*Card, error)
	CreateReviewLog(ctx context.Context, review *CardReview) error
}
