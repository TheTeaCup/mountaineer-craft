package routes

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"os"
)

var router = gin.Default()

// Run will start the server
func Run() {
	gin.SetMode(gin.ReleaseMode)
	router.Use(cors.Default())
	router.SetTrustedProxies(nil)
	router.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{
			"error": true, "message": "Route not found",
		})
	})
	getRoutes()
	port := os.Getenv("PORT")

	if err := router.Run(port); err != nil {
		fmt.Fprintf(os.Stderr, "Error running server: %v", err)
	}
}

// getRoutes will create our routes of our entire application
// this way every group of routes can be defined in their own file
// so this one won't be so messy
func getRoutes() {
	main := router.Group("/")
	mainRoute(main)
}