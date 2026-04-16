package parser

import (
	"io"
	"strings"
	"tubes2/internal/models"

	"golang.org/x/net/html"
)

func popLastMatchingTag(stack []*models.Node, token html.Token) []*models.Node {
	/*
		Kalo misal ada "<div> <p> </div>", <p> yang ditengah bakal dihapus juga
	*/
	for i := len(stack) - 1; i >= 0; i-- {
		if stack[i].Tag == token.Data {
			stack = stack[:i]
			return stack
		}
	}
	return stack
}

func parseHTML(htmldoc string) (*models.DOMTree, error) {
	reader := strings.NewReader(htmldoc)
	tokenizer := html.NewTokenizer(reader)
	var tree models.DOMTree
	var stack []*models.Node
	for {
		tokenType := tokenizer.Next()

		if tokenType == html.ErrorToken {
			err := tokenizer.Err()
			if err == io.EOF {
				break
			}
			return &tree, err
		}

		if tokenType == html.StartTagToken {
			token := tokenizer.Token()
			node := models.NewNode(token.Data)
			if tree.Nodes == nil {
				tree = *models.NewDOMTree(node.ID)
				stack = append(stack, node)
				tree.Nodes[node.ID] = node
			} else if len(stack) > 0 {
				tree.AddChild(stack[len(stack)-1].ID, node)
				stack = append(stack, node)
			} else {
				tree.AddChild(tree.RootID, node)
				stack = append(stack, node)
			}
		}

		if tokenType == html.SelfClosingTagToken {
			token := tokenizer.Token()

			node := models.NewNode(token.Data)
			if len(stack) > 0 {
				// Error handling for invalid html doc with opening tags yang ngawur
				tree.AddChild(stack[len(stack)-1].ID, node)
			}
		}

		if tokenType == html.EndTagToken {
			token := tokenizer.Token()

			if len(stack) > 0 {
				// This is pop
				stack = popLastMatchingTag(stack, token)
			}
		}

	}
	return &tree, nil
}
