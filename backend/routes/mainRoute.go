package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func mainRoute(rg *gin.RouterGroup) {
	ping := rg.Group("/")

	ping.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"error":   false,
			"message": "quizlas api is up and running",
		})
	})
}