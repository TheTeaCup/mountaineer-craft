package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func meRoute(rg *gin.RouterGroup) {
	me := rg.Group("/")

	me.GET("/", func(c *gin.Context) {
		// Read JWT from cookie
		tokenStr, err := c.Cookie("auth_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthenticated"})
			return
		}
	
		// Parse JWT
		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}
	
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
			return
		}
	
		c.JSON(http.StatusOK, gin.H{
			"id":       claims["id"],
			"username": claims["username"],
			"email":    claims["email"],
		})
	})
}