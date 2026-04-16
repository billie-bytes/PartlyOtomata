package core

import (
    "tubes2/internal/models"
)

func RunBFS(tree *models.DOMTree, selector string, limit int) Res {
    multi := ParseMultiSelector(selector)
    specific, hasSpecific := ParseSpecificSelector(selector)

    var result Res
    queue := []int{tree.RootID}
    matched := map[int]struct{}{}

    for len(queue) > 0 {
        if limit > 0 && len(result.ID) >= limit {
            break
        }

        nodeID := queue[0]
        queue = queue[1:]

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

        for _, childID := range node.Children {
            queue = append(queue, childID)
        }
    }

    result.Algorithm = "BFS"
    return result
}