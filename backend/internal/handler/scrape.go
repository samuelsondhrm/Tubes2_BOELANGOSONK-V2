package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"tubes2/backend/internal/model"
	"tubes2/backend/internal/parser"
	"tubes2/backend/internal/scraper"
	"tubes2/backend/internal/store"
)

type ScrapeRequest struct {
	URL string `json:"url" binding:"required"`
}

type ScrapeResponse struct {
	RawHTML  string         `json:"rawHtml"`
	Tree     *model.DOMNode `json:"tree"`
	MaxDepth int            `json:"maxDepth"`
}

func Scrape(c *gin.Context) {
	var req ScrapeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	raw, err := scraper.FetchHTML(req.URL)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}

	tree, err := parser.Parse(raw)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	store.SetTree(tree)

	c.JSON(http.StatusOK, ScrapeResponse{
		RawHTML:  raw,
		Tree:     tree,
		MaxDepth: model.MaxDepth(tree),
	})
}
