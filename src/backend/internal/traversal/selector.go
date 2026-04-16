package core

import (
	"strings"
	"tubes2/internal/models"
)

// this is to handle [attributes] selectors
type AttributeSelector struct {
	Name     string
	Operator string
	Value    string
}

type SelectorType struct {
	Tag        string
	Classes    []string
	ID         string
	Attributes []AttributeSelector
	All        bool // Specifically for *
}

type SelectorRelation string

const (
	NoRelation      SelectorRelation = ""
	Descendant      SelectorRelation = " "
	Child           SelectorRelation = ">"
	AdjacentSibling SelectorRelation = "+"
	GeneralSibling  SelectorRelation = "~"
)

// selector step
// this record type and then their relation symbol
// like div + p -> {}'div', '+'}, {'p', ""}
type SelectorPair struct {
	Sel      SelectorType
	Relation SelectorRelation
}

// stores a bunch of selector pair and chain them when processing in matchin
type SelectorChain struct {
	Steps []SelectorPair
}

// for ors (a,b,c)
type MultiSelector struct {
	Chains []SelectorChain
}

// SpecificSelector is for 2 target
// Example: "div p" => Target1=div, TargetRest=p, Relation=Descendant.
type SpecificSelector struct {
	Target1    SelectorType
	TargetRest SelectorType
	Relation   SelectorRelation
}

// Parsing selector input
//	"p"        -> [{Sel:p, Relation:""}]
//	"p > .box" -> [{Sel:p, Relation:">"}, {Sel:.box, Relation:""}]

func ParseSelector(selector string) []SelectorPair {
	tokens := Tokenize(selector)
	if len(tokens) == 0 {
		return nil
	}

	type partialStep struct {
		sel SelectorType
		rel SelectorRelation
	}

	steps := make([]partialStep, 0)
	pendingRel := Descendant

	for _, token := range tokens {
		if token == "" {
			continue
		}

		switch token {
		case " ":
			pendingRel = Descendant
			continue
		case ">":
			pendingRel = Child
			continue
		case "+":
			pendingRel = AdjacentSibling
			continue
		case "~":
			pendingRel = GeneralSibling
			continue
		}

		if len(steps) > 0 {
			steps[len(steps)-1].rel = pendingRel
		}

		steps = append(steps, partialStep{
			sel: DetectSelectorType(token),
			rel: NoRelation,
		})

		pendingRel = Descendant
	}

	result := make([]SelectorPair, len(steps))
	for i, step := range steps {
		result[i] = SelectorPair{Sel: step.sel, Relation: step.rel}
	}

	return result
}

func ParseMultiSelector(selector string) MultiSelector {
	tokens := TokenizeByComma(selector)
	result := MultiSelector{Chains: make([]SelectorChain, 0, len(tokens))}
	for _, token := range tokens {
		token = strings.TrimSpace(token)
		if token == "" {
			continue
		}
		steps := ParseSelector(token)
		if len(steps) == 0 {
			continue
		}
		result.Chains = append(result.Chains, SelectorChain{Steps: steps})
	}
	return result
}

// ParseSpecificSelector extracts the two-step selector path that the BFS/DFS
// "find" flow knows how to resolve.
func ParseSpecificSelector(selector string) (SpecificSelector, bool) {
	steps := ParseSelector(selector)
	if len(steps) != 2 {
		return SpecificSelector{}, false
	}

	rel := steps[0].Relation
	if rel == NoRelation {
		rel = Descendant
	}

	return SpecificSelector{
		Target1:    steps[0].Sel,
		TargetRest: steps[1].Sel,
		Relation:   rel,
	}, true
}

func TokenizeByComma(s string) []string {
	if len(s) == 0 {
		return nil
	}

	tokens := []string{}
	d := 0 // depth when in [a, b, c [a, b]] parses differently
	j := 0
	for i := 0; i < len(s); i++ {
		c := s[i]
		if c == '[' {
			d++
		} else if c == ']' {
			d--
		} else if c == ',' {
			if d == 0 {
				tokens = append(tokens, s[j:i])
				j = i + 1
			}
		}
	}
	// append everything else from last
	tokens = append(tokens, s[j:])
	return tokens
}
func Tokenize(s string) []string {
	s = strings.TrimSpace(s)
	if len(s) == 0 {
		return nil
	}

	tokens := []string{}
	descendant := false // detect wwether white space is for child operator div p (and not skipped)

	for i := 0; i < len(s); {
		c := s[i]
		if c == ' ' || c == '\t' {
			descendant = true
			i++
			continue
		}

		if c == '>' || c == '+' || c == '~' {
			tokens = append(tokens, string(c))
			descendant = false
			i++
			continue
		}

		if len(tokens) == 0 {
			tokens = append(tokens, "")
		} else if descendant {
			last := tokens[len(tokens)-1]
			if last != "" && last != " " && last != ">" && last != "+" && last != "~" {
				tokens = append(tokens, " ")
			}
		}
		descendant = false

		j := i
		depth := 0
		for j < len(s) {
			if s[j] == '[' {
				depth++
			} else if s[j] == ']' && depth > 0 {
				depth--
			}

			if depth == 0 && (s[j] == ' ' || s[j] == '\t' || s[j] == '>' || s[j] == '+' || s[j] == '~') {
				break
			}
			j++
		}
		token := strings.TrimSpace(s[i:j])
		if token != "" {
			tokens = append(tokens, token)
		}
		i = j
	}

	return tokens
}

func DetectSelectorType(s string) SelectorType {
	selectType := SelectorType{}

	if len(s) == 0 {
		return selectType
	}
	if s[0] == '*' {
		selectType.All = true
		s = s[1:]
	}

	// read tag
	if len(s) > 0 && s[0] != '.' && s[0] != '#' && s[0] != '[' {
		j := 0
		for j < len(s) && s[j] != '.' && s[j] != '#' && s[j] != '[' {
			j++
		}
		selectType.Tag = s[:j]
		s = s[j:]
	}

	// read class, ID, and attributes
	for i := 0; i < len(s); i++ {
		if s[i] == '.' {
			j := i + 1
			for j < len(s) && s[j] != '.' && s[j] != '#' && s[j] != '[' {
				j++
			}
			if i+1 < j {
				selectType.Classes = append(selectType.Classes, s[i+1:j])
			}
			i = j - 1
			continue
		}
		if s[i] == '#' {
			j := i + 1
			for j < len(s) && s[j] != '.' && s[j] != '#' && s[j] != '[' {
				j++
			}
			if i+1 < j {
				selectType.ID = s[i+1 : j]
			}
			i = j - 1
			continue
		}
		// detect attribute when met with []
		if s[i] == '[' {
			j := i + 1
			for j < len(s) && s[j] != ']' {
				j++
			}
			if j >= len(s) {
				break
			}
			attrRaw := strings.TrimSpace(s[i+1 : j])
			if attrRaw != "" {
				selectType.Attributes = append(selectType.Attributes, DetectAttributes(attrRaw))
			}
			i = j
		}
	}

	return selectType
}

// parses attributs
//
//	"my $= kisan" -> {Name: "My", Operator: "$=", Value: "kisah"}
func DetectAttributes(s string) AttributeSelector {
	ops := []string{"^=", "$=", "*=", "~=", "|="}
	att := AttributeSelector{}

	for _, op := range ops {
		idx := strings.Index(s, op)
		if idx != -1 {
			att.Name = strings.TrimSpace(s[:idx])
			att.Operator = op
			att.Value = strings.Trim(strings.TrimSpace(s[idx+len(op):]), "\"'")
			return att
		}
	}

	if idx := strings.Index(s, "="); idx != -1 {
		att.Name = strings.TrimSpace(s[:idx])
		att.Operator = "="
		att.Value = strings.Trim(strings.TrimSpace(s[idx+1:]), "\"'")
		return att
	}

	att.Name = strings.TrimSpace(s)
	return att
}

// MatchNode checks whether one DOM node satisfies a single selector step.
func MatchNode(node *models.Node, selector SelectorType) bool {
	if node == nil {
		return false
	}
	if selector.All && selector.Tag == "" && selector.ID == "" && len(selector.Classes) == 0 && len(selector.Attributes) == 0 {
		return true
	}

	if selector.Tag != "" && selector.Tag != node.Tag {
		return false
	}
	if selector.ID != "" {
		if node.Attributes == nil || node.Attributes["id"] != selector.ID {
			return false
		}
	}

	for _, attr := range selector.Attributes {
		if !MatchAttribute(node, attr) {
			return false
		}
	}

	for _, want := range selector.Classes {
		found := false
		for _, have := range node.Classes {
			if have == want {
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}

	return true
}

// MatchAttribute checks one attribute selector against one node
func MatchAttribute(node *models.Node, attr AttributeSelector) bool {
	if node == nil || node.Attributes == nil {
		return false
	}

	val, exists := node.Attributes[attr.Name]
	if !exists {
		return false
	}

	switch attr.Operator {
	case "":
		return true
	case "=":
		return val == attr.Value
	case "^=":
		return strings.HasPrefix(val, attr.Value)
	case "$=":
		return strings.HasSuffix(val, attr.Value)
	case "*=":
		return strings.Contains(val, attr.Value)
	case "~=":
		for _, word := range strings.Fields(val) {
			if word == attr.Value {
				return true
			}
		}
		return false
	case "|=":
		return val == attr.Value || strings.HasPrefix(val, attr.Value+"-")
	default:
		return false
	}
}

// returns true if nodeID satisfies at least one selector
func MatchesAnySelector(tree *models.DOMTree, nodeID int, multi MultiSelector) bool {
	for _, chain := range multi.Chains {
		if MatchMultiSelector(tree, nodeID, chain) {
			return true
		}
	}
	return false
}

// match multiselector
func MatchMultiSelector(tree *models.DOMTree, nodeID int, chain SelectorChain) bool {
	if len(chain.Steps) == 0 {
		return false
	}
	return MatchSelectorAt(tree, nodeID, chain.Steps, len(chain.Steps)-1)
}

func MatchSelectorAt(tree *models.DOMTree, nodeID int, steps []SelectorPair, idx int) bool {
	if idx < 0 {
		return false
	}

	node := tree.Nodes[nodeID]
	if node == nil || !MatchNode(node, steps[idx].Sel) {
		return false
	}

	if idx == 0 {
		return true
	}

	// steps[idx-1] -> describes N to step N+1
	// so when div + is in steps[0] we will need to use steps[N-1] on matching to the next step
	rel := steps[idx-1].Relation
	if rel == NoRelation {
		rel = Descendant
	}

	switch rel {
	case Descendant:
		return matchAncestorSelector(tree, nodeID, steps, idx-1)
	case Child:
		parentID := findParentID(tree, nodeID)
		return parentID != -1 && MatchSelectorAt(tree, parentID, steps, idx-1)
	case AdjacentSibling:
		parentID := findParentID(tree, nodeID)
		if parentID == -1 {
			return false
		}

		parent := tree.Nodes[parentID]
		selfIdx := findChildIndex(parent, nodeID)
		if selfIdx <= 0 {
			return false
		}
		return MatchSelectorAt(tree, parent.Children[selfIdx-1], steps, idx-1)
	case GeneralSibling:
		parentID := findParentID(tree, nodeID)
		if parentID == -1 {
			return false
		}

		parent := tree.Nodes[parentID]
		selfIdx := findChildIndex(parent, nodeID)
		if selfIdx == -1 {
			return false
		}
		for i := 0; i < selfIdx; i++ {
			if MatchSelectorAt(tree, parent.Children[i], steps, idx-1) {
				return true
			}
		}
		return false
	default:
		return false
	}
}

func matchAncestorSelector(tree *models.DOMTree, nodeID int, steps []SelectorPair, idx int) bool {
	for parentID := findParentID(tree, nodeID); parentID != -1; parentID = findParentID(tree, parentID) {
		if MatchSelectorAt(tree, parentID, steps, idx) {
			return true
		}
	}
	return false
}

func findParentID(tree *models.DOMTree, nodeID int) int {
	for parentID, parent := range tree.Nodes {
		if parent == nil {
			continue
		}
		for _, childID := range parent.Children {
			if childID == nodeID {
				return parentID
			}
		}
	}
	return -1
}

func findChildIndex(parent *models.Node, childID int) int {
	if parent == nil {
		return -1
	}

	for i, currentID := range parent.Children {
		if currentID == childID {
			return i
		}
	}
	return -1
}

// FindSpecificTargetsFromNode resolves the two-step selector path used by the
// BFS/DFS "find" mode.
func FindSpecificTargetsFromNode(tree *models.DOMTree, nodeID int, specific SpecificSelector, limit int) []int {
	node := tree.Nodes[nodeID]
	if node == nil || !MatchNode(node, specific.Target1) {
		return nil
	}

	rel := specific.Relation
	if rel == NoRelation {
		rel = Descendant
	}

	switch rel {
	case Descendant:
		return findDescendantTargets(tree, node, specific.TargetRest, limit)
	case Child:
		return findChildTargets(tree, node, specific.TargetRest, limit)
	case AdjacentSibling:
		return findAdjacentSiblingTargets(tree, nodeID, specific.TargetRest, limit)
	case GeneralSibling:
		return findGeneralSiblingTargets(tree, nodeID, specific.TargetRest, limit)
	default:
		return nil
	}
}

func findDescendantTargets(tree *models.DOMTree, node *models.Node, selector SelectorType, limit int) []int {
	matches := make([]int, 0)
	stack := make([]int, len(node.Children))
	copy(stack, node.Children)

	for len(stack) > 0 {
		if limit > 0 && len(matches) >= limit {
			break
		}

		n := len(stack) - 1
		curID := stack[n]
		stack = stack[:n]

		cur := tree.Nodes[curID]
		if cur == nil {
			continue
		}

		if MatchNode(cur, selector) {
			matches = append(matches, curID)
		}

		for i := len(cur.Children) - 1; i >= 0; i-- {
			stack = append(stack, cur.Children[i])
		}
	}

	return matches
}

func findChildTargets(tree *models.DOMTree, node *models.Node, selector SelectorType, limit int) []int {
	matches := make([]int, 0)
	for _, childID := range node.Children {
		if limit > 0 && len(matches) >= limit {
			break
		}

		if MatchNode(tree.Nodes[childID], selector) {
			matches = append(matches, childID)
		}
	}
	return matches
}

func findAdjacentSiblingTargets(tree *models.DOMTree, nodeID int, selector SelectorType, limit int) []int {
	parentID := findParentID(tree, nodeID)
	if parentID == -1 {
		return nil
	}

	parent := tree.Nodes[parentID]
	selfIdx := findChildIndex(parent, nodeID)
	if selfIdx == -1 || selfIdx+1 >= len(parent.Children) {
		return nil
	}

	nextID := parent.Children[selfIdx+1]
	if MatchNode(tree.Nodes[nextID], selector) {
		return []int{nextID}
	}
	return nil
}

func findGeneralSiblingTargets(tree *models.DOMTree, nodeID int, selector SelectorType, limit int) []int {
	parentID := findParentID(tree, nodeID)
	if parentID == -1 {
		return nil
	}

	parent := tree.Nodes[parentID]
	selfIdx := findChildIndex(parent, nodeID)
	if selfIdx == -1 {
		return nil
	}

	matches := make([]int, 0)
	for i := selfIdx + 1; i < len(parent.Children); i++ {
		if limit > 0 && len(matches) >= limit {
			break
		}

		siblingID := parent.Children[i]
		if MatchNode(tree.Nodes[siblingID], selector) {
			matches = append(matches, siblingID)
		}
	}
	return matches
}
