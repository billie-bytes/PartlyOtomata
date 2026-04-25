package traversal

import (
	"tubes2/internal/models"
)

func RunBFS(tree *models.DOMTree, selector string, limit int) Res {
	result := Res{Algorithm: "BFS"}
	if tree == nil {
		return result
	}

	multi := ParseMultiSelector(selector)
	queue := []string{tree.RootID}

	for len(queue) > 0 {
		if limit > 0 && len(result.ID) >= limit {
			break
		}

		nodeID := queue[0]
		queue = queue[1:]

		node := tree.NodeMap[nodeID]
		if node == nil {
			continue
		}

		result.VisitedOrder = append(result.VisitedOrder, nodeID)
		result.VisitLength++

		if MatchesAnySelector(tree, nodeID, multi) {
			result.ID = append(result.ID, nodeID)
		}

		if limit > 0 && len(result.ID) >= limit {
			break
		}

		for _, childID := range node.Children {
			queue = append(queue, childID)
		}
	}

	return result
}
