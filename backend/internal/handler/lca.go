package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"tubes2/backend/internal/model"
	"tubes2/backend/internal/store"
)

func LCA(c *gin.Context) {
	table := store.GetLCATable()
	if table == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "tree not found, scrape a URL first"})
		return
	}

	var req model.LCARequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	lcaNode := table.Query(req.NodeIDA, req.NodeIDB)
	if lcaNode == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "one or both node IDs not found in tree"})
		return
	}

	depthA, okA := table.DepthOf(req.NodeIDA)
	depthB, okB := table.DepthOf(req.NodeIDB)
	if !okA || !okB {
		c.JSON(http.StatusNotFound, gin.H{"error": "one or both node IDs not found in tree"})
		return
	}

	c.JSON(http.StatusOK, model.LCAResponse{
		LCANode: lcaNode,
		DepthA:  depthA,
		DepthB:  depthB,
	})
}
