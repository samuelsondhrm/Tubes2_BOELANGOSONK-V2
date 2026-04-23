package selector

import (
	"strings"
	"tubes2/backend/internal/model"
)

func Matches(node *model.DOMNode, rawSelector string) bool {
	tokens := tokenize(rawSelector)
	if len(tokens) == 0 {
		return false
	}
	return matchCombinator(node, tokens, len(tokens)-1)
}

func tokenize(s string) []string {
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

	if strings.HasPrefix(sel, "[") && strings.HasSuffix(sel, "]") {
        inner := sel[1 : len(sel)-1]
        if strings.Contains(inner, "=") {
            parts := strings.SplitN(inner, "=", 2)
            key := strings.TrimSpace(parts[0])
            val := strings.Trim(strings.TrimSpace(parts[1]), "\"'")
            return node.Attributes[key] == val
        }
        _, ok := node.Attributes[inner]
        return ok
    }

    if idx := strings.Index(sel, "#"); idx != -1 {
        tag := sel[:idx]
        id := sel[idx+1:]
        if tag != "" && node.Tag != tag {
            return false
        }
        return node.IDAttr == id
    }

    if idx := strings.Index(sel, "."); idx != -1 {
        tag := sel[:idx]
        className := sel[idx+1:]
        if tag != "" && node.Tag != tag {
            return false
        }
        for _, c := range node.Classes {
            if c == className {
                return true
            }
        }
        return false
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
