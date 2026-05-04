package card

import (
	"errors"
	"go-flashcard/server/util"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service
}

func NewHandler(s Service) *Handler {
	return &Handler{Service: s}
}

func (h *Handler) CreateCard(c *gin.Context) {
	deckID := c.Param("id")
	userID, err := util.GetUserIDFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var req CreateCardReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	card, err := h.Service.CreateCard(c.Request.Context(), deckID, userID, &req)
	if err != nil {
		if errors.Is(err, ErrUnauthorized) {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		if errors.Is(err, ErrCardNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "ceck not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, card)
}

func (h *Handler) UpdateCard(c *gin.Context) {
	cardID := c.Param("id")
	userID, err := util.GetUserIDFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var req UpdateCardReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	card, err := h.Service.UpdateCard(c.Request.Context(), cardID, userID, &req)
	if err != nil {
		if errors.Is(err, ErrUnauthorized) {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		if errors.Is(err, ErrCardNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "ceck not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, card)
}

func (h *Handler) DeleteCard(c *gin.Context) {
	cardID := c.Param("id")
	userID, err := util.GetUserIDFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	err = h.Service.DeleteCard(c.Request.Context(), cardID, userID)
	if err != nil {
		if errors.Is(err, ErrUnauthorized) {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		if errors.Is(err, ErrCardNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "ceck not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
