package models

import (
	"fmt"
)

// each node represents a single HTML element
type Node struct {
	ID         int               `json:"id"`
	Tag        string            `json:"tag"`
	Classes    []string          `json:"classes,omitempty"`
	Attributes map[string]string `json:"attributes,omitempty"`
	Text       string            `json:"text,omitempty"`
	Children   []int             `json:"children"`
}

type DOMTree struct {
	RootID int           `json:"root_id"`
	Nodes  map[int]*Node `json:"nodes"`
}

var nodeCount int

func NewNode(tag string) *Node {
	nodeCount++
	return &Node{
		ID:         nodeCount,
		Tag:        tag,
		Classes:    make([]string, 0),
		Attributes: make(map[string]string),
		Children:   make([]int, 0),
	}
}

func NewDOMTree(rootID int) *DOMTree {
	return &DOMTree{
		RootID: rootID,
		Nodes:  make(map[int]*Node),
	}
}

func (t *DOMTree) AddChild(parentID int, child *Node) error {
	parent, exists := t.Nodes[parentID]
	if !exists {
		return fmt.Errorf("parent node with id: %d not found", parentID)
	}

	t.Nodes[child.ID] = child
	parent.Children = append(parent.Children, child.ID)

	return nil
}
