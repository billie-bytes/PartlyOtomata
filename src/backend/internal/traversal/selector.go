package core
 
import (
	"tubes2/internal/models"
)

type SelectorType struct {
	Tag 		string
	Classes		[]string
	ID 			string
	All 		bool 	// Specifically for *
}

// stores tokens in Prefix + type
type SelectorPair struct {
	Prefix 				string
	SelectorType 		SelectorType
}


// Parsing selector input
//	"p"        -> [{""  , p}]
//	"p > .box" -> [{"",  p}, {">", .box}]

func ParseSelector(selector string) []SelectorPair {
	tokens := Tokenize(selector)
	if len(tokens) == 0 {
		return nil
	}

	pairs := make([]SelectorPair, 0)
	Prefix := ""

	for _, token := range tokens {
		if token == "" {
			continue
		}
		if token == " " || token == ">" || token == "+" || token == "~" {
			Prefix = token
			continue
		}

		pairs = append(pairs, SelectorPair{
			Prefix:       Prefix,
			SelectorType: DetectSelectorType(token),
		})
		Prefix = ""
	}

	return pairs
}

func Tokenize(s string) []string {
	if len(s) == 0 {
		return nil
	}

	tokens := []string{}

	// first "" of token
	for i := 0; i < len(s); i++ {
		c := s[i]
		if c == ' ' || c == '\t' {
			continue
		}
		if c != '>' && c != '+' && c != '~' {
			tokens = append(tokens, "")
			break
		}
	}

	// everything after that saved as {type,Prefix,type,...}
	for i := 0; i < len(s); i++ {
		c := s[i]
		if c == ' ' || c == '\t' {
			continue
		}
		if c == '>' || c == '+' || c == '~' {
			tokens = append(tokens, string(c))
			continue
		}

		j := i
		for j < len(s) && s[j] != ' ' && s[j] != '\t' && s[j] != '>' && s[j] != '+' && s[j] != '~' {
			j++
		}
		tokens = append(tokens, s[i:j])
		i = j - 1
	}

	return tokens
} 


func DetectSelectorType(s string) SelectorType {
	selectType := SelectorType{}

	if s == "*" {
		selectType.All = true
		return selectType
	}

	if len(s) == 0 {
		return selectType
	}

	// read tag
	if s[0] != '.' && s[0] != '#' {
		j := 0
		for j < len(s) && s[j] != '.' && s[j] != '#' {
			j++
		}
		selectType.Tag = s[:j]
		s = s[j:]
	}

	// read class or ID
	for i := 0; i < len(s); i++ {
		if s[i] == '.' {
			j := i + 1
			for j < len(s) && s[j] != '.' && s[j] != '#' {
				j++
			}
			selectType.Classes = append(selectType.Classes, s[i+1:j])
			i = j - 1
			continue
		}
		if s[i] == '#' {
			j := i + 1
			for j < len(s) && s[j] != '.' && s[j] != '#' {
				j++
			}
			selectType.ID = s[i+1:j]
			i = j - 1
		}
	}

	return selectType
}

func MatchNode(node *models.Node, selector SelectorType) bool {
	if selector.All {
		return true
	}
	if selector.Tag != "" && selector.Tag != node.Tag {
		return false
	}
	if selector.ID != "" && node.Attributes["id"] != selector.ID {
		return false
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