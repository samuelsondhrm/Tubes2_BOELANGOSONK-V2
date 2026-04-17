package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"tubes2/backend/internal/algorithm"
	"tubes2/backend/internal/model"
	"tubes2/backend/internal/parser"
	"tubes2/backend/internal/scraper"
	"tubes2/backend/internal/traversal"
)

// GET /api/traverse/stream
func TraverseStream(c *gin.Context) {
	rawHTML := c.Query("html")
	if rawHTML == "" {
		url := c.Query("url")
		if url == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "html or url query param required"})
			return
		}
		fetched, err := scraper.FetchHTML(url)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
			return
		}
		rawHTML = fetched
	}

	algo := c.DefaultQuery("algorithm", "BFS")
	sel := c.Query("selector")
	if sel == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "selector query param required"})
		return
	}

	limit := -1
	if l := c.Query("limit"); l != "" {
		if n, err := strconv.Atoi(l); err == nil {
			limit = n
		}
	}

	tree, err := parser.Parse(rawHTML)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var steps []model.TraversalStep
	switch algo {
	case "DFS", "dfs":
		resp := algorithm.TraverseDFS(tree, sel, limit)
		steps = resp.Log
	default:
		result := traversal.BFS(tree, sel, limit)
		for _, entry := range result.Log {
			status := "visiting"
			if entry.Matched {
				status = "matched"
			}
			steps = append(steps, model.TraversalStep{
				Step:   entry.Step,
				NodeID: entry.NodeID,
				Tag:    entry.Tag,
				Status: status,
			})
		}
	}

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("X-Accel-Buffering", "no")

	w := c.Writer
	flusher, ok := w.(http.Flusher)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "streaming not supported"})
		return
	}

	for _, step := range steps {
		b, err := json.Marshal(step)
		if err != nil {
			continue
		}
		fmt.Fprintf(w, "data: %s\n\n", b)
		flusher.Flush()
	}

	fmt.Fprintf(w, "data: {\"done\":true}\n\n")
	flusher.Flush()
}
