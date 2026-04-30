package router

import (
	"go-flashcard/server/internal/health"
	"go-flashcard/server/internal/user"

	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func NewRouter(h *health.Handler, u *user.Handler) {
	r = gin.Default()

	r.GET("/ping", h.Ping)
	r.POST("/login", u.Login)
	r.POST("/logout", u.Logout)
	r.POST("/signup", u.CreateUser)

}

func Start(addr string) error {
	return r.Run(addr)
}
