package handler

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func LCA(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "not implemented"})
}
