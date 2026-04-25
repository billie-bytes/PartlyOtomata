package traversal

type Res struct {
	ID           []string `json:"traversalOrder"`
	VisitedOrder []string `json:"visitedOrder"`
	VisitLength  int      `json:"traversalLength"`
	Algorithm    string   `json:"algorithm"`
}
