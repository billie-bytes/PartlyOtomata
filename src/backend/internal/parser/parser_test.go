package parser

import (
	"testing"
	"tubes2/internal/models"
)

func TestParseHTML(t *testing.T) {
	tests := []struct {
		name          string
		htmlInput     string
		expectedNodes int
		expectError   bool
		rootTag       string
	}{
		{
			name:          "Perfectly formatted HTML",
			htmlInput:     `<html><head><title>Test</title></head><body><p>Hello</p></body></html>`,
			expectedNodes: 5, // html, head, title, body, p
			expectError:   false,
			rootTag:       "html",
		},
		{
			name:          "Self-closing tags included",
			htmlInput:     `<html><body><img src="test.jpg" /><br/></body></html>`,
			expectedNodes: 4, // html, body, img, br
			expectError:   false,
			rootTag:       "html",
		},
		{
			name:          "Broken HTML (Missing end tag)",
			htmlInput:     `<div><p>Unclosed paragraph</div><span>Next</span>`,
			expectedNodes: 3, // div, p, span
			expectError:   false,
			rootTag:       "div",
		},
		{
			name:          "Empty String",
			htmlInput:     ``,
			expectedNodes: 0,
			expectError:   false,
			rootTag:       "",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			tree, err := ParseHTML(tc.htmlInput)
			if (err != nil) != tc.expectError {
				t.Fatalf("Expected error: %v, got: %v", tc.expectError, err)
			}
			if tree == nil || len(tree.Nodes) == 0 {
				if tc.expectedNodes != 0 {
					t.Errorf("Expected %d nodes, but tree was empty", tc.expectedNodes)
				}
				return
			}
			if tree.HTML != tc.htmlInput {
				t.Errorf("Expected tree.HTML to store the raw string, got '%s'", tree.HTML)
			}

			if len(tree.Nodes) != tc.expectedNodes {
				t.Errorf("Expected %d nodes, got %d", tc.expectedNodes, len(tree.Nodes))
			}
			var rootNode *models.Node
			for _, node := range tree.Nodes {
				if node.ID == tree.RootID {
					rootNode = node
					break
				}
			}

			if rootNode == nil {
				t.Fatalf("RootID %s does not exist in the Nodes slice", tree.RootID)
			}

			if rootNode.Tag != tc.rootTag {
				t.Errorf("Expected root tag '%s', got '%s'", tc.rootTag, rootNode.Tag)
			}
		})
	}
}
