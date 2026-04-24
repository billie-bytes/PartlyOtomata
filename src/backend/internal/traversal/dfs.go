package core

import (
	"tubes2/internal/models"
)

func RunDFS(tree *models.DOMTree, selector string, limit int) Res {
	result := Res{Algorithm: "DFS"}
	if tree == nil {
		return result
	}

	multi := ParseMultiSelector(selector)
	stack := []int{tree.RootID}

	for len(stack) > 0 {
		if limit > 0 && len(result.ID) >= limit {
			break
		}

		n := len(stack) - 1
		nodeID := stack[n]
		stack = stack[:n]

		node := tree.Nodes[nodeID]
		if node == nil {
			continue
		}

		result.VisitLength++

		if MatchesAnySelector(tree, nodeID, multi) {
			result.ID = append(result.ID, nodeID)
		}

		if limit > 0 && len(result.ID) >= limit {
			break
		}

		for i := len(node.Children) - 1; i >= 0; i-- {
			stack = append(stack, node.Children[i])
		}
	}

	return result
}
