package main

import (
	"github.com/joho/godotenv"
	"log"
	"math/rand"
	"time"
)

func init() {
	err := godotenv.Load(".env")

	if err != nil {
		log.Println("Error loading .env file")
	}
}

func main() {
	rand.Seed(time.Now().UnixNano())
	log.Println("Starting Mountaineer Craft API")

	// start redis
	// err := utils.ConnectToRedis()
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// // call router
	// routes.Run()

}