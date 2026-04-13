package main

import (
    "os"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "tubes2/backend/internal/handler"
)

func main() {
    r := gin.Default()

    allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
    if allowedOrigin == "" {
        allowedOrigin = "http://localhost:3000"
    }

    r.Use(cors.New(cors.Config{
        AllowOrigins: []string{allowedOrigin},
        AllowMethods: []string{"GET", "POST", "OPTIONS"},
        AllowHeaders: []string{"Content-Type"},
    }))

    api := r.Group("/api")
    {
        api.POST("/scrape",           handler.Scrape)
        api.POST("/traverse",         handler.Traverse)
        api.GET("/traverse/stream",   handler.TraverseStream) // Server-Sent Events (SSE)
        api.POST("/lca",              handler.LCA)
    }

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    r.Run(":" + port)
}
