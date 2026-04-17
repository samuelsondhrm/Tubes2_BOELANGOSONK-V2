package lca

import "tubes2/backend/internal/model"

// LOG = 18, bisa menampung 2^18 = 262,144 nodes
const LOG = 18

type LCATable struct {
	depth map[string]int
	nodes map[string]*model.DOMNode
	up [LOG]map[string]string
}

func Build(root *model.DOMNode) *LCATable {
	t := &LCATable{
		depth: make(map[string]int),
		nodes: make(map[string]*model.DOMNode),
	}
	for k := 0; k < LOG; k++ {
		t.up[k] = make(map[string]string)
	}

	type frame struct {
		node   *model.DOMNode
		parent string
		depth  int
	}
	stack := []frame{{node: root, parent: "", depth: 0}}
	for len(stack) > 0 {
		top := stack[len(stack)-1]
		stack = stack[:len(stack)-1]

		n := top.node
		t.depth[n.ID] = top.depth
		t.nodes[n.ID] = n
		t.up[0][n.ID] = top.parent

		for _, child := range n.Children {
			stack = append(stack, frame{node: child, parent: n.ID, depth: top.depth + 1})
		}
	}

	// Binary lifting
	for k := 1; k < LOG; k++ {
		for id := range t.nodes {
			mid := t.up[k-1][id]
			if mid == "" {
				t.up[k][id] = ""
			} else {
				t.up[k][id] = t.up[k-1][mid]
			}
		}
	}

	return t
}

func (t *LCATable) Query(a, b string) *model.DOMNode {
	if _, ok := t.nodes[a]; !ok {
		return nil
	}
	if _, ok := t.nodes[b]; !ok {
		return nil
	}

	da, db := t.depth[a], t.depth[b]

	if da < db {
		a, b = b, a
		da, db = db, da
	}
	diff := da - db
	for k := 0; k < LOG; k++ {
		if (diff>>k)&1 == 1 {
			a = t.up[k][a]
		}
	}

	if a == b {
		return t.nodes[a]
	}

	// Binary lift both until they meet.
	for k := LOG - 1; k >= 0; k-- {
		if t.up[k][a] != t.up[k][b] {
			a = t.up[k][a]
			b = t.up[k][b]
		}
	}

	lca := t.up[0][a]
	if lca == "" {
		return nil
	}
	return t.nodes[lca]
}

func (t *LCATable) DepthOf(id string) (int, bool) {
	d, ok := t.depth[id]
	return d, ok
}
