package util

import (
	"errors"

	"github.com/gin-gonic/gin"
)

func GetUserIDFromContext(c *gin.Context) (string, error) {
	userIDContext, exists := c.Get("userID")
	if !exists {
		return "", errors.New("unauthorized: missing user id in context")
	}

	return userIDContext.(string), nil
}
