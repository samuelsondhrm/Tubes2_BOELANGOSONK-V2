package traversal

import (
	"time"

	"tubes2/backend/internal/model"
	"tubes2/backend/internal/selector"
)

type TraversalResult struct {
	Matches      []*model.DOMNode `json:"matches"`
	VisitedIDs   []string         `json:"visitedIds"`
	MatchedIDs   []string         `json:"matchedIds"`
	PathIDs      []string         `json:"pathIds"`
	NodesVisited int              `json:"nodesVisited"`
	ElapsedMs    float64          `json:"elapsedMs"`
	Log          []LogEntry       `json:"log"`
}

type LogEntry struct {
	Step    int    `json:"step"`
	NodeID  string `json:"nodeId"`
	Tag     string `json:"tag"`
	Matched bool   `json:"matched"`
	Depth   int    `json:"depth"`
}

func BFS(root *model.DOMNode, rawSelector string, topN int) TraversalResult {
	token := selector.Tokenize(rawSelector)
	start := time.Now()

	queue := []*model.DOMNode{root}
	visited := []string{}
	matched := []*model.DOMNode{}
	matchedIDs := []string{}
	log := []LogEntry{}
	step := 0

	for len(queue) > 0 && (topN <= 0 || len(matched) < topN) {
		node := queue[0]
		queue = queue[1:]

		step++
		isMatch := selector.Matches(node, token)
		visited = append(visited, node.ID)
		log = append(log, LogEntry{
			Step:    step,
			NodeID:  node.ID,
			Tag:     node.Tag,
			Matched: isMatch,
			Depth:   node.Depth,
		})

		if isMatch {
			matched = append(matched, node)
			matchedIDs = append(matchedIDs, node.ID)
		}

		queue = append(queue, node.Children...)
	}

	pathIDs := buildAncestorPaths(matched)

	return TraversalResult{
		Matches:      matched,
		VisitedIDs:   visited,
		MatchedIDs:   matchedIDs,
		PathIDs:      pathIDs,
		NodesVisited: len(visited),
		ElapsedMs:    float64(time.Since(start).Microseconds()) / 1000.0,
		Log:          log,
	}
}

func buildAncestorPaths(nodes []*model.DOMNode) []string {
	seen := map[string]bool{}
	result := []string{}
	for _, n := range nodes {
		cur := n
		for cur != nil {
			if seen[cur.ID] {
				break
			}
			seen[cur.ID] = true
			result = append(result, cur.ID)
			cur = cur.Parent
		}
	}
	return result
}
