package algorithm

import (
	"strings"
	"time"
	"tubes2/backend/internal/model"
)

func TraverseDFS(root *model.DOMNode, selector string, limit int) *model.TraverseResponse {
	start := time.Now()

	var matches []*model.DOMNode
	var logs []model.TraversalStep
	visitedCount := 0

	if root == nil {
		return &model.TraverseResponse{}
	}

	stack := []*model.DOMNode{root}
	tokens := tokenizeSelector(selector)

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

		if len(tokens) > 0 && matchCombinator(curr, tokens, len(tokens)-1) {
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

func tokenizeSelector(s string) []string {
	s = strings.ReplaceAll(s, ">", " > ")
	s = strings.ReplaceAll(s, "+", " + ")
	s = strings.ReplaceAll(s, "~", " ~ ")

	fields := strings.Fields(s)
	var tokens []string

	for i, f := range fields {
		if f == ">" || f == "+" || f == "~" {
			tokens = append(tokens, f)
		} else {
			if i > 0 && tokens[len(tokens)-1] != ">" && tokens[len(tokens)-1] != "+" && tokens[len(tokens)-1] != "~" {
				tokens = append(tokens, " ")
			}
			tokens = append(tokens, f)
		}
	}
	return tokens
}

func matchCombinator(node *model.DOMNode, parts []string, idx int) bool {
	if node == nil || idx < 0 {
		return false
	}

	if !matchSingle(node, parts[idx]) {
		return false
	}

	if idx == 0 {
		return true
	}

	combinator := parts[idx-1]
	prevIdx := idx - 2

	switch combinator {
	case ">":
		return matchCombinator(node.Parent, parts, prevIdx)
	case " ":
		curr := node.Parent
		for curr != nil {
			if matchCombinator(curr, parts, prevIdx) {
				return true
			}
			curr = curr.Parent
		}
	case "+":
		prev := getPrevSibling(node)
		return matchCombinator(prev, parts, prevIdx)
	case "~":
		curr := getPrevSibling(node)
		for curr != nil {
			if matchCombinator(curr, parts, prevIdx) {
				return true
			}
			curr = getPrevSibling(curr)
		}
	}
	return false
}

func matchSingle(node *model.DOMNode, sel string) bool {
	if node == nil {
		return false
	}

	if sel == "*" {
		return true
	}

	if strings.HasPrefix(sel, ".") {
		for _, c := range node.Classes {
			if "."+c == sel {
				return true
			}
		}
		return false
	}
	if strings.HasPrefix(sel, "#") {
		return "#"+node.IDAttr == sel
	}
	return node.Tag == sel
}

func getPrevSibling(node *model.DOMNode) *model.DOMNode {
	if node == nil || node.Parent == nil {
		return nil
	}
	for i, sibling := range node.Parent.Children {
		if sibling == node && i > 0 {
			return node.Parent.Children[i-1]
		}
	}
	return nil
}
