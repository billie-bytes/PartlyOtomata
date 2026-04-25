package core
type Res struct {
	ID          []int `json:"traversalOrder"`
	VisitedOrder []int  `json:"visitedOrder"`
	VisitLength int   `json:"traversalLength"`
	Algorithm 	string `json:"algorithm"`
}