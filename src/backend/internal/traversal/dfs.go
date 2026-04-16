package core

import (
    "tubes2/internal/models"
)

func RunDFS(tree *models.DOMTree, selector string, limit int) Res {
    multi := ParseMultiSelector(selector)
    specific, hasSpecific := ParseSpecificSelector(selector)

    var result Res
    stack := []int{tree.RootID}
    matched := map[int]struct{}{}

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

        if hasSpecific {
            remain := 0
            if limit > 0 {
                remain = limit - len(result.ID)
            }

            ids := FindSpecificTargetsFromNode(tree, nodeID, specific, remain)
            for _, id := range ids {
                if _, exists := matched[id]; exists {
                    continue
                }
                matched[id] = struct{}{}
                result.ID = append(result.ID, id)

                if limit > 0 && len(result.ID) >= limit {
                    break
                }
            }
        } else if MatchesAnySelector(tree, nodeID, multi) {
            result.ID = append(result.ID, nodeID)
        }

        if limit > 0 && len(result.ID) >= limit {
            break
        }

        for i := len(node.Children) - 1; i >= 0; i-- {
            stack = append(stack, node.Children[i])
        }
    }

    result.Algorithm = "DFS"
    return result
}