package traversal

import (
	"time"
	"tubes2/backend/internal/model"
	"tubes2/backend/internal/selector"
)

func TraverseDFS(root *model.DOMNode, rawSelector string, limit int) *model.TraverseResponse {
	start := time.Now()

	var matches []*model.DOMNode
	var logs []model.TraversalStep
	visitedCount := 0

	if root == nil {
		return &model.TraverseResponse{}
	}

	stack := []*model.DOMNode{root}

	for len(stack) > 0 {
		n := len(stack)
		curr := stack[n-1]
		stack = stack[:n-1]

		visitedCount++
		logs = append(logs, model.TraversalStep{
			Step:   visitedCount,
			NodeID: curr.ID,
			Tag:    curr.Tag,
			Status: "visiting",
		})

		if selector.Matches(curr, rawSelector) {
			matches = append(matches, curr)
			logs[len(logs)-1].Status = "matched"

			if limit > 0 && len(matches) >= limit {
				break
			}
		}

		for i := len(curr.Children) - 1; i >= 0; i-- {
			stack = append(stack, curr.Children[i])
		}
	}

	return &model.TraverseResponse{
		Tree:         root,
		Matches:      matches,
		VisitedCount: visitedCount,
		DurationMs:   float64(time.Since(start).Microseconds()) / 1000.0,
		Log:          logs,
	}
}
