package parser

import (
	"testing"
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
			expectedNodes: 3,     // div, p, span
			expectError:   false, // Remember, the HTML tokenizer rarely throws real errors!
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

			// Call your function
			tree, err := parseHTML(tc.htmlInput)

			// Check Error Expectation
			if (err != nil) != tc.expectError {
				t.Fatalf("Expected error: %v, got: %v", tc.expectError, err)
			}

			// If the tree is completely empty, skip the structural checks
			if tree == nil || len(tree.Nodes) == 0 {
				if tc.expectedNodes != 0 {
					t.Errorf("Expected %d nodes, but tree was empty", tc.expectedNodes)
				}
				return
			}

			// Check Total Node Count
			if len(tree.Nodes) != tc.expectedNodes {
				t.Errorf("Expected %d nodes, got %d", tc.expectedNodes, len(tree.Nodes))
			}

			// Check Root Node Tag
			rootNode, exists := tree.Nodes[tree.RootID]
			if !exists {
				t.Fatalf("RootID %d does not exist in the Nodes map", tree.RootID)
			}

			if rootNode.Tag != tc.rootTag {
				t.Errorf("Expected root tag '%s', got '%s'", tc.rootTag, rootNode.Tag)
			}
		})
	}
}
