package routes

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)


func meRoute(me *gin.RouterGroup) {

	me.GET("", func(c *gin.Context) { // no trailing slash
		// Read JWT from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthenticated"})
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

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

		// Return user info from token claims
		c.JSON(http.StatusOK, gin.H{
			"id":       claims["id"],
			"username": claims["username"],
			"email":    claims["email"],
		})
	})
}
