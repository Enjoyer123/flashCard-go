package router

import (
	"go-flashcard/server/internal/card"
	"go-flashcard/server/internal/deck"
	"go-flashcard/server/internal/health"
	"go-flashcard/server/internal/user"
	"go-flashcard/server/middleware"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func NewRouter(h *health.Handler, u *user.Handler, d *deck.Handler, c *card.Handler) {
	r = gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/ping", h.Ping)
	r.POST("/auth/login", u.Login)
	r.POST("/auth/logout", u.Logout)
	r.POST("/auth/register", u.CreateUser)

	r.GET("/decks/public", d.GetPublicDecks)

	protected := r.Group("/")
	protected.Use(middleware.RequireAuth())
	{
		protected.POST("/decks", d.CreateDeck)
		protected.GET("/decks/:id", d.GetDeckByID)
		protected.GET("/decks", d.GetDecksByUserID)
		protected.PATCH("/decks/:id", d.UpdateDeck)
		protected.DELETE("/decks/:id", d.DeleteDeck)
		protected.POST("/decks/:id/cards", c.CreateCard)
		protected.POST("/decks/:id/fork", d.ForkDeck)
		protected.GET("/decks/:id/review", c.GetDueCards)
		protected.GET("/decks/:id/stats", d.GetDeckStats)

		protected.PATCH("/cards/:id", c.UpdateCard)
		protected.DELETE("/cards/:id", c.DeleteCard)
		protected.POST("/cards/:id/review", c.ReviewCard)
		protected.POST("/cards/auto", c.AutoCard)

		protected.GET("/users/me/study-activity", c.GetUserStudyActivity)
	}

}

func Start(addr string) error {
	return r.Run(addr)
}
