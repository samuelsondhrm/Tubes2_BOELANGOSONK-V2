package model

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
    IDAttr     string            `json:"id_attr"`
    Attributes map[string]string `json:"attributes"`
    Children   []*DOMNode        `json:"children"`
    Depth      int               `json:"depth"`
    ParentID   string            `json:"parent_id"`

    Parent *DOMNode `json:"-"`
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
