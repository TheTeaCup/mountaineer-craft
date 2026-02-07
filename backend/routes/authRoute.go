package routes

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

// POST /auth/discord
// Body: { "code": "DISCORD_CODE_HERE" }
func authRoute(c *gin.Context) {
	var body struct {
		Code string `json:"code"`
	}

	if err := c.BindJSON(&body); err != nil || body.Code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing code"})
		return
	}

	// Exchange code for access token
	data := url.Values{}
	data.Set("client_id", os.Getenv("DISCORD_CLIENT_ID"))
	data.Set("client_secret", os.Getenv("DISCORD_CLIENT_SECRET"))
	data.Set("grant_type", "authorization_code")
	data.Set("code", body.Code)
	data.Set("redirect_uri", os.Getenv("DISCORD_REDIRECT_URI"))

	req, err := http.NewRequest(
		"POST",
		"https://discord.com/api/oauth2/token",
		strings.NewReader(data.Encode()),
	)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to create token request"})
		return
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := http.DefaultClient.Do(req)
	if err != nil || resp.StatusCode != 200 {
		// log the error and response body for debugging

		c.JSON(500, gin.H{"error": "token exchange failed"})
		return
	}
	defer resp.Body.Close()

	var tokenResp struct {
		AccessToken string `json:"access_token"`
		TokenType   string `json:"token_type"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		c.JSON(500, gin.H{"error": "invalid token response"})
		return
	}

	// Fetch Discord user
	userReq, err := http.NewRequest(
		"GET",
		"https://discord.com/api/users/@me",
		nil,
	)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to create user request"})
		return
	}

	userReq.Header.Set("Authorization", "Bearer "+tokenResp.AccessToken)

	userResp, err := http.DefaultClient.Do(userReq)
	if err != nil || userResp.StatusCode != 200 {
		c.JSON(500, gin.H{"error": "failed to fetch discord user"})
		return
	}
	defer userResp.Body.Close()

	var discordUser struct {
		ID       string `json:"id"`
		Username string `json:"username"`
		Avatar   string `json:"avatar"`
		Email    string `json:"email"`
	}

	if err := json.NewDecoder(userResp.Body).Decode(&discordUser); err != nil {
		c.JSON(500, gin.H{"error": "invalid user response"})
		return
	}

	// TODO:
	// - Create / lookup user in DB
	// - Never return Discord access token

	// Create JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       discordUser.ID,
		"username": discordUser.Username,
		"email":    discordUser.Email,
		"exp":      time.Now().Add(24 * time.Hour).Unix(), // expires in 1 day
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to sign JWT"})
		return
	}

	// Set JWT as a cookie for the frontend
	c.SetCookie(
		"auth_token", // name
		tokenString,  // value
		86400,        // max age in seconds
		"/",          // path
		"",           // domain (empty = current)
		true,         // secure
		true,         // httpOnly
	)

	// Return user info for immediate frontend use
	c.JSON(200, gin.H{
		"message": "OK",
		"user": gin.H{
			"id":       discordUser.ID,
			"username": discordUser.Username,
			"avatar":   discordUser.Avatar,
			"email":    discordUser.Email,
		},
	})
}
