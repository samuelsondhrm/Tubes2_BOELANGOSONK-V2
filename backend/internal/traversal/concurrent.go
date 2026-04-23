package traversal

import (
	"sync"
	"time"

	"tubes2/backend/internal/model"
	"tubes2/backend/internal/selector"
)

type matchResult struct {
	SeqIdx  int
	Node    *model.DOMNode
	IsMatch bool
}

func ConcurrentDFS(root *model.DOMNode, rawSel string, limit int) *model.TraverseResponse {
	return runConcurrent(root, rawSel, limit, true)
}

func ConcurrentBFS(root *model.DOMNode, rawSel string, limit int) *model.TraverseResponse {
	return runConcurrent(root, rawSel, limit, false)
}

func runConcurrent(root *model.DOMNode, rawSel string, limit int, isDFS bool) *model.TraverseResponse {
	start := time.Now()
	if root == nil {
		return &model.TraverseResponse{Matches: make([]*model.DOMNode, 0)}
	}

	workerCount := 4
	matches := make([]*model.DOMNode, 0)
	logs := make([]model.TraversalStep, 0)
	visitedCount := 0

	frontier := []*model.DOMNode{root}

	for len(frontier) > 0 && (limit <= 0 || len(matches) < limit) {
		batchSize := workerCount
		if batchSize > len(frontier) {
			batchSize = len(frontier)
		}

		var batch []*model.DOMNode
		if isDFS {
			startIdx := len(frontier) - batchSize
			batch = make([]*model.DOMNode, batchSize)
			copy(batch, frontier[startIdx:])
			for i, j := 0, len(batch)-1; i < j; i, j = i+1, j-1 {
				batch[i], batch[j] = batch[j], batch[i]
			}
			frontier = frontier[:startIdx]
		} else {
			batch = frontier[:batchSize]
			frontier = frontier[batchSize:]
		}

		results := make([]bool, batchSize)
		var wg sync.WaitGroup

		for i, node := range batch {
			wg.Add(1)
			go func(idx int, n *model.DOMNode) {
				defer wg.Done()
				results[idx] = selector.Matches(n, rawSel)
			}(i, node)
		}

		wg.Wait()

		for i, node := range batch {
			visitedCount++
			isMatch := results[i]

			status := "visiting"
			if isMatch {
				status = "matched"
			}

			logs = append(logs, model.TraversalStep{
				Step:   visitedCount,
				NodeID: node.ID,
				Tag:    node.Tag,
				Status: status,
			})

			if isMatch {
				matches = append(matches, node)
				if limit > 0 && len(matches) >= limit {
					goto Done
				}
			}

			if isDFS {
				for j := len(node.Children) - 1; j >= 0; j-- {
					frontier = append(frontier, node.Children[j])
				}
			} else {
				frontier = append(frontier, node.Children...)
			}
		}
	}

Done:
	return &model.TraverseResponse{
		Tree:         root,
		Matches:      matches,
		VisitedCount: visitedCount,
		DurationMs:   float64(time.Since(start).Microseconds()) / 1000.0,
		Log:          logs,
	}
}
