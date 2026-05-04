package util

import (
	"fmt"
	"go-flashcard/server/internal/model"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}

	return string(hashedPassword), nil
}

func CheckPassword(password string, hashedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

func VerifyToken(tokenString string) (*model.MyJWTClaims, error) {

	token, err := jwt.ParseWithClaims(tokenString, &model.MyJWTClaims{}, func(token *jwt.Token) (interface{}, error) {

		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("secretKey")), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*model.MyJWTClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token claims")
}

func GenerateToken(userID string, username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, model.MyJWTClaims{
		ID:       userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    userID,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	})

	return token.SignedString([]byte(os.Getenv("secretKey")))
}
