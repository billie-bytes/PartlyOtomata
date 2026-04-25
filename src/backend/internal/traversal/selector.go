package traversal

import (
	"strings"
	"sync"
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
		selectType.Tag = strings.ToLower(s[:j])
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
			att.Name = strings.ToLower(strings.TrimSpace(s[:idx]))
			att.Operator = op
			att.Value = strings.Trim(strings.TrimSpace(s[idx+len(op):]), "\"'")
			return att
		}
	}

	if idx := strings.Index(s, "="); idx != -1 {
		att.Name = strings.ToLower(strings.TrimSpace(s[:idx]))
		att.Operator = "="
		att.Value = strings.Trim(strings.TrimSpace(s[idx+1:]), "\"'")
		return att
	}

	att.Name = strings.ToLower(strings.TrimSpace(s))
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
func MatchesAnySelector(tree *models.DOMTree, nodeID string, multi MultiSelector) bool {
	for _, chain := range multi.Chains {
		if MatchMultiSelector(tree, nodeID, chain) {
			return true
		}
	}
	return false
}

// match multiselector
func MatchMultiSelector(tree *models.DOMTree, nodeID string, chain SelectorChain) bool {
	if len(chain.Steps) == 0 {
		return false
	}
	return MatchSelectorAt(tree, nodeID, chain.Steps, len(chain.Steps)-1)
}

func MatchSelectorAt(tree *models.DOMTree, nodeID string, steps []SelectorPair, idx int) bool {
	if idx < 0 {
		return false
	}

	node := tree.NodeMap[nodeID]
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
		return parentID != "" && MatchSelectorAt(tree, parentID, steps, idx-1)
	case AdjacentSibling:
		parentID := findParentID(tree, nodeID)
		if parentID == "" {
			return false
		}

		parent := tree.NodeMap[parentID]
		selfIdx := findChildIndex(parent, nodeID)
		if selfIdx <= 0 {
			return false
		}
		return MatchSelectorAt(tree, parent.Children[selfIdx-1], steps, idx-1)
	case GeneralSibling:
		parentID := findParentID(tree, nodeID)
		if parentID == "" {
			return false
		}

		parent := tree.NodeMap[parentID]
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

func matchAncestorSelector(tree *models.DOMTree, nodeID string, steps []SelectorPair, idx int) bool {
	for parentID := findParentID(tree, nodeID); parentID != ""; parentID = findParentID(tree, parentID) {
		if MatchSelectorAt(tree, parentID, steps, idx) {
			return true
		}
	}
	return false
}

func findParentID(tree *models.DOMTree, nodeID string) string {
	node := tree.NodeMap[nodeID]
	if node == nil || node.ParentID == nil {
		return ""
	}

	// Dereference the pointer to return the actual string value
	return *node.ParentID
}

func findChildIndex(parent *models.Node, childID string) int {
	if parent == nil {
		return -1
	}

	// parent.Children is now []string
	for i, currentID := range parent.Children {
		if currentID == childID {
			return i
		}
	}
	return -1
}

func RunMultipleQueries(tree *models.DOMTree, selectors []string, algo string, limit int) map[string]Res {
	results := make(map[string]Res)
	if tree == nil || len(selectors) == 0 {
		return results
	}

	var wg sync.WaitGroup
	var mu sync.Mutex

	for _, selector := range selectors {
		wg.Add(1)

		go func(sel string) {
			defer wg.Done()

			var res Res
			if algo == "DFS" {
				res = RunDFS(tree, sel, limit)
			} else {
				res = RunBFS(tree, sel, limit)
			}

			mu.Lock()
			results[sel] = res
			mu.Unlock()
		}(selector)
	}

	wg.Wait()
	return results
}
