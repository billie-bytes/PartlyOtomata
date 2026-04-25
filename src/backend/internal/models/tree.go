package models

import (
	"fmt"
	"strconv"
)

type Node struct {
	ID         string            `json:"id"`
	ParentID   *string           `json:"parent_id,omitempty"`
	Tag        string            `json:"tag"`
	Classes    []string          `json:"classes"`
	Attributes map[string]string `json:"attributes"`
	Text       string            `json:"text,omitempty"`
	Children   []string          `json:"children"`
}

type DOMTree struct {
	RootID string  `json:"root_id"`
	Nodes  []*Node `json:"nodes"`
	HTML   string  `json:"html,omitempty"`

	NodeMap map[string]*Node `json:"-"`
}

var nodeCount int

func NewNode(tag string) *Node {
	nodeCount++
	idStr := strconv.Itoa(nodeCount)
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
		NodeMap: make(map[string]*Node),
	}
}

func (t *DOMTree) AddNode(node *Node) {
	t.Nodes = append(t.Nodes, node)
	t.NodeMap[node.ID] = node
}

func (t *DOMTree) AddChild(parentID string, child *Node) error {
	parent, exists := t.NodeMap[parentID]
	if !exists {
		return fmt.Errorf("parent node with id: %s not found", parentID)
	}

	parentIDCopy := parentID
	child.ParentID = &parentIDCopy

	t.AddNode(child)
	parent.Children = append(parent.Children, child.ID)

	return nil
}

func ResetNodeCount() {
	nodeCount = 0
}
