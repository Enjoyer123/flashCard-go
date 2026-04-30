package main

import (
	"go-flashcard/server/db"
	"go-flashcard/server/internal/health"
	"go-flashcard/server/internal/user"
	"go-flashcard/server/router"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	dbConn, err := db.NewDatabase()
	if err != nil {
		log.Fatalf("could not initialize database connection %s", err)

	}

	userRep := user.NewRepository(dbConn.GetDB())

	healthSvc := health.NewService()
	userSvc := user.NewService(userRep)

	healthHandler := health.NewHandler(healthSvc)
	userHandler := user.NewHandler(userSvc)

	router.NewRouter(healthHandler, userHandler)
	router.Start("0.0.0.0:8080")
}
