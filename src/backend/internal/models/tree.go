package models

import (
	"fmt"
	"strconv"
)

// each node represents a single HTML element
type Node struct {
	ID         string            `json:"id"`
	ParentID   *string           `json:"parent_id,omitempty"` // Pointer allows it to serialize to null if missing
	Tag        string            `json:"tag"`
	Classes    []string          `json:"classes"` // Removed omitempty to guarantee [] instead of null
	Attributes map[string]string `json:"attributes"`
	Text       string            `json:"text,omitempty"`
	Children   []string          `json:"children"`
}

type DOMTree struct {
	RootID string  `json:"root_id"`
	Nodes  []*Node `json:"nodes"`          // Serializes as an array for the frontend
	HTML   string  `json:"html,omitempty"` // Added to match DOMParseResponse

	// Internal map for fast O(1) lookups during tree building. Ignored by JSON serializer.
	nodeMap map[string]*Node `json:"-"`
}

var nodeCount int

func NewNode(tag string) *Node {
	nodeCount++
	idStr := strconv.Itoa(nodeCount) // Convert int counter to string ID
	return &Node{
		ID:         idStr,
		Tag:        tag,
		Classes:    make([]string, 0),
		Attributes: make(map[string]string),
		Children:   make([]string, 0),
	}
}

func NewDOMTree(rootID string) *DOMTree {
	return &DOMTree{
		RootID:  rootID,
		Nodes:   make([]*Node, 0),
		nodeMap: make(map[string]*Node),
	}
}

// Helper method to add a node to both the public slice and the internal map
func (t *DOMTree) AddNode(node *Node) {
	t.Nodes = append(t.Nodes, node)
	t.nodeMap[node.ID] = node
}

func (t *DOMTree) AddChild(parentID string, child *Node) error {
	parent, exists := t.nodeMap[parentID]
	if !exists {
		return fmt.Errorf("parent node with id: %s not found", parentID)
	}

	// Set ParentID (requires a pointer to the string copy)
	parentIDCopy := parentID
	child.ParentID = &parentIDCopy

	// Add to both the slice and map
	t.AddNode(child)
	parent.Children = append(parent.Children, child.ID)

	return nil
}
