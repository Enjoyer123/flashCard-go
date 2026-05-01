package deck

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service
}

func NewHandler(s Service) *Handler {
	return &Handler{
		Service: s,
	}
}

func (h *Handler) CreateDeck(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	var req CreateDeckReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := h.Service.CreateDeck(c.Request.Context(), userID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, res)
}

func (h *Handler) GetDeckByID(c *gin.Context) {
	deckID := c.Param("id")

	deck, err := h.Service.GetDeckWithCards(c.Request.Context(), deckID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "deck not found"})
		return
	}

	c.JSON(http.StatusOK, deck)
}

func (h *Handler) GetDecksByUserID(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	decks, err := h.Service.GetDecksByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, decks)
}

func (h *Handler) UpdateDeck(c *gin.Context) {
	deckID := c.Param("id")
	userID := c.MustGet("userID").(string)

	var req CreateDeckReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	deck, err := h.Service.UpdateDeck(c.Request.Context(), deckID, userID, &req)
	if err != nil {
		if err.Error() == "unauthorized" {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, deck)
}

func (h *Handler) DeleteDeck(c *gin.Context) {
	deckID := c.Param("id")
	userID := c.MustGet("userID").(string)

	err := h.Service.DeleteDeck(c.Request.Context(), deckID, userID)
	if err != nil {
		if err.Error() == "unauthorized" {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
