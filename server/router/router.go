package router

import (
	"go-flashcard/server/internal/card"
	"go-flashcard/server/internal/deck"
	"go-flashcard/server/internal/health"
	"go-flashcard/server/internal/user"

	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func NewRouter(h *health.Handler, u *user.Handler, d *deck.Handler, c *card.Handler) {
	r = gin.Default()

	r.GET("/ping", h.Ping)
	r.POST("/auth/login", u.Login)
	r.POST("/auth/logout", u.Logout)
	r.POST("/auth/signup", u.CreateUser)

	r.POST("/decks", d.CreateDeck)
	r.GET("/decks/:id", d.GetDeckByID)
	r.GET("/decks", d.GetDecksByUserID)
	r.PUT("/decks/:id", d.UpdateDeck)
	r.DELETE("/decks/:id", d.DeleteDeck)

	r.POST("/decks/:id/cards", c.CreateCard)
	r.PATCH("/cards/:id", c.UpdateCard)
	r.DELETE("/cards/:id", c.DeleteCard)

}

func Start(addr string) error {
	return r.Run(addr)
}
