package model

import "github.com/golang-jwt/jwt/v4"

type MyJWTClaims struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}
