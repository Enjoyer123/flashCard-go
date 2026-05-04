package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"go-flashcard/server/util"
)

func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Missing or invalid token"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := util.VerifyToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Invalid or expired token"})
			c.Abort()
			return
		}

		c.Set("userID", claims.ID)

		c.Next()
	}
}
