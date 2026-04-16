package selector

import (
	"strings"

	"tubes2/backend/internal/model"
)

type TokenType int

const (
	TokenUniversal TokenType = iota
	TokenTag
	TokenClass
	TokenID
	TokenUnknown
)

type Token struct {
	Type  TokenType
	Value string
}

func Tokenize(raw string) Token {
	s := strings.TrimSpace(raw)
	switch {
	case s == "*":
		return Token{Type: TokenUniversal}
	case strings.HasPrefix(s, "#"):
		return Token{Type: TokenID, Value: s[1:]}
	case strings.HasPrefix(s, "."):
		return Token{Type: TokenClass, Value: s[1:]}
	case s != "" && !strings.ContainsAny(s, " >+~"):
		return Token{Type: TokenTag, Value: strings.ToLower(s)}
	default:
		return Token{Type: TokenUnknown, Value: s}
	}
}

func Matches(node *model.DOMNode, token Token) bool {
	switch token.Type {
	case TokenUniversal:
		return true
	case TokenTag:
		return strings.ToLower(node.Tag) == token.Value
	case TokenClass:
		for _, c := range node.Classes {
			if c == token.Value {
				return true
			}
		}
		return false
	case TokenID:
		return node.IDAttr == token.Value
	}
	return false
}
