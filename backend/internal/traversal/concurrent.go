package traversal

import (
	"context"
	"sync"
	"time"

	"tubes2/backend/internal/model"
	"tubes2/backend/internal/selector"
)

type matchResult struct {
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
		return &model.TraverseResponse{}
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	jobs := make(chan *model.DOMNode)
	results := make(chan matchResult)
	var wg sync.WaitGroup
	workerCount := 4

	for i := 0; i < workerCount; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					return
				case node, ok := <-jobs:
					if !ok {
						return
					}
					isMatch := selector.Matches(node, rawSel)
					select {
					case results <- matchResult{Node: node, IsMatch: isMatch}:
					case <-ctx.Done():
						return
					}
				}
			}
		}()
	}

	var matches []*model.DOMNode
	var logs []model.TraversalStep
	visitedCount := 0

	frontier := []*model.DOMNode{root}
	pendingJobs := 0

SearchLoop:
	for pendingJobs > 0 || len(frontier) > 0 {
		var jobChan chan<- *model.DOMNode
		var nextNode *model.DOMNode

		if len(frontier) > 0 {
			jobChan = jobs
			if isDFS {
				nextNode = frontier[len(frontier)-1]
			} else {
				nextNode = frontier[0]
			}
		}

		select {
		case jobChan <- nextNode:
			if isDFS {
				frontier = frontier[:len(frontier)-1]
			} else {
				frontier = frontier[1:]
			}
			pendingJobs++

		case res := <-results:
			pendingJobs--
			visitedCount++

			logs = append(logs, model.TraversalStep{
				Step:   visitedCount,
				NodeID: res.Node.ID,
				Tag:    res.Node.Tag,
				Status: "visiting",
			})

			if res.IsMatch {
				matches = append(matches, res.Node)
				logs[len(logs)-1].Status = "matched"
				if limit > 0 && len(matches) >= limit {
					break SearchLoop
				}
			}

			if isDFS {
				for i := len(res.Node.Children) - 1; i >= 0; i-- {
					frontier = append(frontier, res.Node.Children[i])
				}
			} else {
				frontier = append(frontier, res.Node.Children...)
			}
		}
	}

	cancel()
	wg.Wait()

	return &model.TraverseResponse{
		Tree:         root,
		Matches:      matches,
		VisitedCount: visitedCount,
		DurationMs:   float64(time.Since(start).Microseconds()) / 1000.0,
		Log:          logs,
	}
}
