package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"tubes2/backend/internal/model"
	"tubes2/backend/internal/parser"
	"tubes2/backend/internal/scraper"
	"tubes2/backend/internal/traversal"
)

type TraverseRequest struct {
	URL       string `json:"url"`
	RawHTML   string `json:"rawHtml"`
	Algorithm string `json:"algorithm" binding:"required"`
	Selector  string `json:"selector" binding:"required"`
	TopN      int    `json:"topN"`
}

type TraverseResponse struct {
	Tree     *model.DOMNode          `json:"tree"`
	MaxDepth int                     `json:"maxDepth"`
	Result   traversal.TraversalResult `json:"result"`
}

func Traverse(c *gin.Context) {
	var req TraverseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rawHTML := req.RawHTML
	if rawHTML == "" && req.URL != "" {
		fetched, err := scraper.FetchHTML(req.URL)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
			return
		}
		rawHTML = fetched
	}
	if rawHTML == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "url or rawHtml required"})
		return
	}

	tree, err := parser.Parse(rawHTML)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var result traversal.TraversalResult
	switch req.Algorithm {
	case "BFS", "bfs":
		result = traversal.BFS(tree, req.Selector, req.TopN)
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "algorithm must be BFS or DFS"})
		return
	}

	c.JSON(http.StatusOK, TraverseResponse{
		Tree:     tree,
		MaxDepth: model.MaxDepth(tree),
		Result:   result,
	})
}

func GetTree(c *gin.Context) {
	var req struct {
		URL     string `json:"url"`
		RawHTML string `json:"rawHtml"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rawHTML := req.RawHTML
	if rawHTML == "" {
		fetched, err := scraper.FetchHTML(req.URL)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
			return
		}
		rawHTML = fetched
	}

	tree, err := parser.Parse(rawHTML)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"tree":     tree,
		"maxDepth": model.MaxDepth(tree),
	})
}
