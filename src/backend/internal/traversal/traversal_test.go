package traversal

import (
	"testing"
	"tubes2/internal/models"
)

func buildMockTree() *models.DOMTree {
	tree := models.NewDOMTree("1")

	// <html>
	htmlNode := models.NewNode("html")
	htmlNode.ID = "1"
	tree.AddNode(htmlNode)

	// <body>
	bodyNode := models.NewNode("body")
	bodyNode.ID = "2"
	tree.AddChild("1", bodyNode)

	// <div class="container">
	divNode := models.NewNode("div")
	divNode.ID = "3"
	divNode.Classes = []string{"container"}
	tree.AddChild("2", divNode)

	// <p> inside div
	pNode := models.NewNode("p")
	pNode.ID = "4"
	tree.AddChild("3", pNode)

	return tree
}

func TestRunDFS(t *testing.T) {
	tree := buildMockTree()

	// Test finding a simple tag
	res := RunDFS(tree, "p", 0)
	if len(res.ID) != 1 || res.ID[0] != "4" {
		t.Errorf("Expected to find node '4', got %v", res.ID)
	}

	// Test a Parent > Child selector
	resChild := RunDFS(tree, "div > p", 0)
	if len(resChild.ID) != 1 || resChild.ID[0] != "4" {
		t.Errorf("Expected div > p to find node '4', got %v", resChild.ID)
	}

	// Test a Class selector
	resClass := RunDFS(tree, ".container", 0)
	if len(resClass.ID) != 1 || resClass.ID[0] != "3" {
		t.Errorf("Expected .container to find node '3', got %v", resClass.ID)
	}

	// Test a selector that shouldn't exist
	resNone := RunDFS(tree, "span", 0)
	if len(resNone.ID) != 0 {
		t.Errorf("Expected to find nothing, got %v", resNone.ID)
	}
}

func TestRunBFS(t *testing.T) {
	tree := buildMockTree()

	res := RunBFS(tree, "div > p", 0)

	if len(res.ID) != 1 || res.ID[0] != "4" {
		t.Errorf("BFS Expected to find node '4', got %v", res.ID)
	}
}
