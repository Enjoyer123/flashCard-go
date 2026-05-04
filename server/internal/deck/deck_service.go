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

func (s *service) GetDeckWithCards(c context.Context, deckID string, userID string) (*Deck, error) {
	deck, err := s.Repository.GetDeckWithCards(c, deckID)
	if err != nil {
		return nil, err
	}

	if deck.UserID != userID && !deck.IsPublic {
		return nil, ErrUnauthorized
	}

	return deck, nil
}

func (s *service) ForkDeck(c context.Context, deckID string, userID string) (*ForkDeckRes, error) {
	deck, err := s.Repository.GetDeckWithCards(c, deckID)
	if err != nil {
		return nil, errors.New("deck not found")
	}

	if !deck.IsPublic && deck.UserID != userID {
		return nil, errors.New("unauthorized")
	}

	newDeck, err := s.Repository.ForkDeck(c, deck, deck.Cards, userID)
	if err != nil {
		return nil, err
	}

	return &ForkDeckRes{
		ID:          newDeck.ID,
		UserID:      newDeck.UserID,
		Title:       newDeck.Title,
		Description: newDeck.Description,
		IsPublic:    newDeck.IsPublic,
		CreatedAt:   newDeck.CreatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

func (s *service) GetPublicDecks(c context.Context, search string, page int, limit int) (*PublicDeckRes, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit

	decks, err := s.Repository.GetPublicDecks(c, search, offset, limit)
	if err != nil {
		return nil, err
	}

	total, err := s.Repository.CountPublicDecks(c, search)
	if err != nil {
		return nil, err
	}

	return &PublicDeckRes{
		Data:  decks,
		Page:  page,
		Limit: limit,
		Total: total,
	}, nil
}

func (s *service) GetDeckStats(c context.Context, deckID string, userID string) (*DeckStats, error) {
	deck, err := s.Repository.GetDeckByID(c, deckID)
	if err != nil {
		return nil, errors.New("deck not found")
	}

	if deck.UserID != userID {
		return nil, errors.New("unauthorized")
	}

	return s.Repository.GetDeckStats(c, deckID)
}
