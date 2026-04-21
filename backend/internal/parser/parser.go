package parser

import (
	"strings"

	"tubes2/backend/internal/model"
	"golang.org/x/net/html"
	"golang.org/x/net/html/atom"
)

func Parse(rawHTML string) (*model.DOMNode, error) {
	contextNode := &html.Node{
		Type:     html.ElementNode,
		Data:     "body",
		DataAtom: atom.Body,
	}
	nodes, err := html.ParseFragment(strings.NewReader(rawHTML), contextNode)
	if err != nil {
		return nil, err
	}

	var firstEl *html.Node
	for _, n := range nodes {
		if n.Type == html.ElementNode {
			firstEl = n
			break
		}
	}

	root := model.NewRootNode()
	root.ID = "node-0"
	root.Attributes = make(map[string]string)

	if firstEl == nil {
		root.Tag = "div" // fallback
		return root, nil
	}

	root.Tag = firstEl.Data
	for _, attr := range firstEl.Attr {
		switch attr.Key {
		case "class":
			root.Classes = strings.Fields(attr.Val)
			root.Attributes["class"] = attr.Val
		case "id":
			root.IDAttr = attr.Val
			root.Attributes["id"] = attr.Val
		default:
			root.Attributes[attr.Key] = attr.Val
		}
	}

	for child := firstEl.FirstChild; child != nil; child = child.NextSibling {
		buildTree(child, root)
	}
	return root, nil
}

func buildTree(htmlNode *html.Node, parent *model.DOMNode) {
	if htmlNode.Type != html.ElementNode {
		return
	}

	domNode := parent.NewChild(htmlNode.Data)

	for _, attr := range htmlNode.Attr {
		switch attr.Key {
		case "class":
			parts := strings.Fields(attr.Val)
			domNode.Classes = parts
			domNode.Attributes["class"] = attr.Val
		case "id":
			domNode.IDAttr = attr.Val
			domNode.Attributes["id"] = attr.Val
		default:
			domNode.Attributes[attr.Key] = attr.Val
		}
	}

	for child := htmlNode.FirstChild; child != nil; child = child.NextSibling {
		buildTree(child, domNode)
	}
}
