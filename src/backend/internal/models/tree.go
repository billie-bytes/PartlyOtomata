package models

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
