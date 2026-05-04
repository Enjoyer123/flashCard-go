package card

import (
	"context"
	"errors"
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

	card := &Card{
		DeckID: deckID,
		Front:  req.Front,
		Back:   req.Back,
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
		return ErrCardNotFound
	}

	return s.Repository.DeleteCard(ctx, cardID)
}
