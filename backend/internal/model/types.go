package model

import "fmt"

type Algorithm string

const (
    BFS Algorithm = "BFS"
    DFS Algorithm = "DFS"
)

type TraverseRequest struct {
    HTML      string    `json:"html"`
    Algorithm Algorithm `json:"algorithm"`
    Selector  string    `json:"selector"`
    Limit     int       `json:"limit"`
}

type DOMNode struct {
    ID         string            `json:"id"`
    Tag        string            `json:"tag"`
    Classes    []string          `json:"classes"`
    IDAttr     string            `json:"idAttr"`
    Attributes map[string]string `json:"attributes"`
    Children   []*DOMNode        `json:"children"`
    Depth      int               `json:"depth"`
    ParentID   string            `json:"parent_id"`

    Parent  *DOMNode `json:"-"`
    counter *int
}

type TraversalStep struct {
    Step   int    `json:"step"`
    NodeID string `json:"node_id"`
    Tag    string `json:"tag"`
    Status string `json:"status"` // "visiting" | "matched" | "skipped"
}

type TraverseResponse struct {
    Tree         *DOMNode       `json:"tree"`
    Matches      []*DOMNode     `json:"matches"`
    VisitedCount int            `json:"visited_count"`
    DurationMs   float64        `json:"duration_ms"`
    MaxDepth     int            `json:"max_depth"`
    Log          []TraversalStep `json:"log"`
}

type LCARequest struct {
    NodeIDA string `json:"node_id_a"`
    NodeIDB string `json:"node_id_b"`
}

type LCAResponse struct {
    LCANode *DOMNode `json:"lca_node"`
    DepthA  int      `json:"depth_a"`
    DepthB  int      `json:"depth_b"`
}

func NewRootNode() *DOMNode {
    c := 0
    return &DOMNode{counter: &c}
}

func (n *DOMNode) NewChild(tag string) *DOMNode {
    *n.counter++
    child := &DOMNode{
        ID:         fmt.Sprintf("node-%d", *n.counter),
        Tag:        tag,
        Classes:    []string{},
        Attributes: map[string]string{},
        Depth:      n.Depth + 1,
        Parent:     n,
        counter:    n.counter,
    }
    n.Children = append(n.Children, child)
    return child
}

func MaxDepth(node *DOMNode) int {
    if len(node.Children) == 0 {
        return node.Depth
    }
    max := node.Depth
    for _, child := range node.Children {
        if d := MaxDepth(child); d > max {
            max = d
        }
    }
    return max
}
