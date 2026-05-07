package card

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/open-spaced-repetition/go-fsrs"
)

var (
	ErrUnauthorized = errors.New("unauthorized")
	ErrCardNotFound = errors.New("card not found")
)

type service struct {
	Repository
}

func NewService(r Repository) Service {
	return &service{Repository: r}
}

func (s *service) CreateCard(ctx context.Context, deckID string, userID string, req *CreateCardReq) (*Card, error) {
	ownerID, err := s.Repository.GetDeckByID(ctx, deckID)
	if err != nil {
		return nil, ErrCardNotFound
	}
	if ownerID != userID {
		return nil, ErrUnauthorized
	}

	now := time.Now()

	card := &Card{
		DeckID:        deckID,
		Front:         req.Front,
		Back:          req.Back,
		Due:           &now,
		Stability:     0,
		Difficulty:    0,
		ElapsedDays:   0,
		ScheduledDays: 0,
		Reps:          0,
		Lapses:        0,
		State:         0,
		CreatedAt:     now,
	}

	return s.Repository.CreateCard(ctx, card)
}

func (s *service) UpdateCard(ctx context.Context, cardID string, userID string, req *UpdateCardReq) (*Card, error) {
	card, err := s.Repository.GetCardByID(ctx, cardID)
	if err != nil {
		return nil, ErrCardNotFound
	}

	ownerID, err := s.Repository.GetDeckByID(ctx, card.DeckID)
	if err != nil {
		return nil, err
	}

	if ownerID != userID {
		return nil, ErrUnauthorized
	}

	if req.Front != "" {
		card.Front = req.Front
	}
	if req.Back != "" {
		card.Back = req.Back
	}

	return s.Repository.UpdateCard(ctx, card)
}

func (s *service) DeleteCard(ctx context.Context, cardID string, userID string) error {
	card, err := s.Repository.GetCardByID(ctx, cardID)
	if err != nil {
		return ErrCardNotFound
	}

	ownerID, err := s.Repository.GetDeckByID(ctx, card.DeckID)
	if err != nil {
		return err
	}

	if ownerID != userID {
		return ErrUnauthorized
	}

	return s.Repository.DeleteCard(ctx, cardID)
}

func (s *service) ReviewCard(ctx context.Context, cardID string, userID string, req *ReviewCardReq) (*Card, error) {

	card, err := s.Repository.GetCardByID(ctx, cardID)
	if err != nil {
		return nil, ErrCardNotFound
	}

	ownerID, err := s.Repository.GetDeckByID(ctx, card.DeckID)
	if err != nil || ownerID != userID {
		return nil, ErrUnauthorized
	}

	// แปลง Card ให้เป็น Card ของ FSRS Library
	f := fsrs.DefaultParam()
	now := time.Now()

	var lastReview time.Time
	if card.LastReview != nil {
		lastReview = *card.LastReview
	} else {
		lastReview = card.CreatedAt
	}

	fsrsCard := fsrs.Card{
		Due:           *card.Due,
		Stability:     card.Stability,
		Difficulty:    card.Difficulty,
		ElapsedDays:   uint64(card.ElapsedDays),
		ScheduledDays: uint64(card.ScheduledDays),
		Reps:          uint64(card.Reps),
		Lapses:        uint64(card.Lapses),
		State:         fsrs.State(card.State),
		LastReview:    lastReview,
	}

	// คำนวณค่าใหม่ด้วย FSRS
	// req.Rating คือ 1(Again), 2(Hard), 3(Good), 4(Easy)
	recordLog := f.Repeat(fsrsCard, now)[fsrs.Rating(req.Rating)]

	card.Due = &recordLog.Card.Due
	card.Stability = recordLog.Card.Stability
	card.Difficulty = recordLog.Card.Difficulty
	card.ElapsedDays = int64(recordLog.Card.ElapsedDays)
	card.ScheduledDays = int64(recordLog.Card.ScheduledDays)
	card.Reps = int64(recordLog.Card.Reps)
	card.Lapses = int64(recordLog.Card.Lapses)
	card.State = int16(recordLog.Card.State)
	card.LastReview = &now

	updatedCard, err := s.Repository.UpdateCard(ctx, card)
	if err != nil {
		return nil, err
	}

	reviewLog := &CardReview{
		CardID:        card.ID,
		UserID:        userID,
		Rating:        req.Rating,
		ScheduledDays: int64(recordLog.Card.ScheduledDays),
		ElapsedDays:   int64(recordLog.Card.ElapsedDays),
		State:         int16(recordLog.Card.State),
		ReviewedAt:    now,
	}

	if err := s.Repository.CreateReviewLog(ctx, reviewLog); err != nil {
		return nil, err
	}
	return updatedCard, nil
}

func (s *service) GetDueCards(ctx context.Context, deckID string, userID string) ([]*Card, error) {
	ownerID, err := s.Repository.GetDeckByID(ctx, deckID)
	if err != nil {
		return nil, errors.New("deck not found")
	}

	if ownerID != userID {
		return nil, ErrUnauthorized
	}

	return s.Repository.GetDueCards(ctx, deckID)
}

func (s *service) AutoCard(ctx context.Context, userID string, req *AutoCardReq) (*Card, error) {
	ownerID, err := s.Repository.GetDeckByID(ctx, req.DeckID)
	if err != nil {
		return nil, errors.New("deck not found")
	}
	if ownerID != userID {
		return nil, ErrUnauthorized
	}

	// Dictionary API
	url := "https://api.dictionaryapi.dev/api/v2/entries/en/" + req.Word
	reqAPI, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(reqAPI)
	if err != nil {
		return nil, errors.New("dictionary api unreachable")
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return nil, errors.New("word not found in dictionary")
	}

	var result []DictionaryWord

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, errors.New("failed to parse dictionary response")
	}

	if len(result) == 0 || len(result[0].Meanings) == 0 || len(result[0].Meanings[0].Definitions) == 0 {
		return nil, errors.New("could not find definitions for this word")
	}

	meaning := result[0].Meanings[0]
	front := req.Word
	back := fmt.Sprintf("(%s) %s", meaning.PartOfSpeech, meaning.Definitions[0].Definition)

	return s.CreateCard(ctx, req.DeckID, userID, &CreateCardReq{
		Front: front,
		Back:  back,
	})
}
