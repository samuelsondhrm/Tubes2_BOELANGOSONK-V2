package handler

import (
	"net/http"

	"tubes2/backend/internal/model"
	"tubes2/backend/internal/parser"
	"tubes2/backend/internal/scraper"
	"tubes2/backend/internal/store"
	"tubes2/backend/internal/traversal"

	"github.com/gin-gonic/gin"
)

type TraverseRequest struct {
	URL       string `json:"url"`
	RawHTML   string `json:"rawHtml"`
	Algorithm string `json:"algorithm" binding:"required"`
	Selector  string `json:"selector" binding:"required"`
	TopN      int    `json:"topN"`
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

	if req.URL != "" {
        store.SetTree(tree)
    }

	var result *model.TraverseResponse
	switch req.Algorithm {
	case "BFS", "bfs":
		result = traversal.ConcurrentBFS(tree, req.Selector, req.TopN)
	case "DFS", "dfs":
		result = traversal.ConcurrentDFS(tree, req.Selector, req.TopN)
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "algorithm must be BFS or DFS"})
		return
	}

	result.MaxDepth = model.MaxDepth(tree)

	go traversal.SaveTraversalLog(req.Algorithm, result.Log)
	c.JSON(http.StatusOK, result)
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
