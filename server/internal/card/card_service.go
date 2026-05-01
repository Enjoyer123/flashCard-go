package card

import (
	"context"
	"errors"
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
		return nil, errors.New("deck not found")
	}

	if ownerID != userID {
		return nil, errors.New("unauthorized")
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
		return nil, errors.New("card not found")
	}

	ownerID, err := s.Repository.GetDeckByID(ctx, card.DeckID)
	if err != nil {
		return nil, err
	}

	if ownerID != userID {
		return nil, errors.New("unauthorized")
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
		return errors.New("card not found")
	}

	ownerID, err := s.Repository.GetDeckByID(ctx, card.DeckID)
	if err != nil {
		return err
	}

	if ownerID != userID {
		return errors.New("unauthorized")
	}

	return s.Repository.DeleteCard(ctx, cardID)
}
