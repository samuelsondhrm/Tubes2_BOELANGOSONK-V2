package store

import (
	"sync"

	"tubes2/backend/internal/lca"
	"tubes2/backend/internal/model"
)

var (
	mu       sync.RWMutex
	tree     *model.DOMNode
	lcaTable *lca.LCATable
)

func SetTree(t *model.DOMNode) {
	mu.Lock()
	defer mu.Unlock()
	tree = t
	lcaTable = lca.Build(t)
}

func GetTree() *model.DOMNode {
	mu.RLock()
	defer mu.RUnlock()
	return tree
}

func GetLCATable() *lca.LCATable {
	mu.RLock()
	defer mu.RUnlock()
	return lcaTable
}
