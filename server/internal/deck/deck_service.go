package deck

import (
	"context"
	"errors"
)

var (
	ErrUnauthorized = errors.New("unauthorized: you are not the owner of this deck")
	ErrDeckNotFound = errors.New("deck not found")
)

type service struct {
	Repository
}

func NewService(repository Repository) Service {
	return &service{
		Repository: repository,
	}
}

func (s *service) CreateDeck(c context.Context, userID string, req *CreateDeckReq) (*CreateDeckRes, error) {
	d := &Deck{
		UserID:      userID,
		Title:       req.Title,
		Description: req.Description,
		IsPublic:    false,
	}

	res, err := s.Repository.CreateDeck(c, d)
	if err != nil {
		return nil, err
	}

	return &CreateDeckRes{
		ID:          res.ID,
		UserID:      res.UserID,
		Title:       res.Title,
		Description: res.Description,
		IsPublic:    res.IsPublic,
		CreatedAt:   res.CreatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

func (s *service) GetDeckByID(c context.Context, deckID string) (*Deck, error) {
	deck, err := s.Repository.GetDeckByID(c, deckID)
	if err != nil {
		return nil, err
	}
	return deck, nil
}
func (s *service) GetDecksByUserID(c context.Context, userID string) ([]*Deck, error) {
	decks, err := s.Repository.GetDecksByUserID(c, userID)
	if err != nil {
		return nil, err
	}
	return decks, nil
}
func (s *service) UpdateDeck(c context.Context, deckID string, userID string, req *CreateDeckReq) (*Deck, error) {
	deck, err := s.Repository.GetDeckByID(c, deckID)
	if err != nil {
		return nil, err
	}

	if deck.UserID != userID {
		return nil, ErrUnauthorized
	}

	deck.Title = req.Title
	deck.Description = req.Description

	updated, err := s.Repository.UpdateDeck(c, deck)
	if err != nil {
		return nil, err
	}

	return updated, nil
}

func (s *service) DeleteDeck(c context.Context, deckID string, userID string) error {
	deck, err := s.Repository.GetDeckByID(c, deckID)
	if err != nil {
		return err
	}

	if deck.UserID != userID {
		return ErrUnauthorized
	}

	return s.Repository.DeleteDeck(c, deckID, userID)
}

func (s *service) GetDeckWithCards(c context.Context, deckID string) (*Deck, error) {
	deck, err := s.Repository.GetDeckWithCards(c, deckID)
	if err != nil {
		return nil, err
	}
	return deck, nil
}
