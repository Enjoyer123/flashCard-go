package main

import (
	"go-flashcard/server/db"
	"go-flashcard/server/internal/card"
	"go-flashcard/server/internal/deck"
	"go-flashcard/server/internal/health"
	"go-flashcard/server/internal/user"
	"go-flashcard/server/router"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("could not load .env %s", err)
	}
	dbConn, err := db.NewDatabase()
	if err != nil {
		log.Fatalf("could not initialize database connection %s", err)

	}

	userRep := user.NewRepository(dbConn.GetDB())
	deckRep := deck.NewRepository(dbConn.GetDB())
	cardRep := card.NewRepository(dbConn.GetDB())

	healthSvc := health.NewService()
	userSvc := user.NewService(userRep)
	deckSvc := deck.NewService(deckRep)
	cardSvc := card.NewService(cardRep)

	healthHandler := health.NewHandler(healthSvc)
	userHandler := user.NewHandler(userSvc)
	deckHandler := deck.NewHandler(deckSvc)
	cardHandler := card.NewHandler(cardSvc)

	router.NewRouter(healthHandler, userHandler, deckHandler, cardHandler)
	router.Start("0.0.0.0:8080")
}
