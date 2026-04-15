package core

import (
	"tubes2/internal/models"
)

func RunBFS(tree *models.DOMTree, selector string, limit int) Res {
	parts := ParseSelector(selector)
 
	var result Res
	queue := []int{tree.RootID}
 
	for len(queue) > 0 {
		if limit > 0 && len(result.ID) >= limit {
			break
		}
 
		// Dequeue front
		nodeID := queue[0]
		queue = queue[1:]
 
		node := tree.Nodes[nodeID]
		if node == nil {
			continue
		}

		result.VisitLength++
		if len(parts) == 0 || MatchNode(node, parts[len(parts)-1].SelectorType) {
			result.ID = append(result.ID, nodeID)
		}
 
		queue = append(queue, node.Children...)
	}
 
	result.Algorithm = "BFS"
	return result
}
 