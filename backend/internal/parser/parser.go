package parser

import (
	"strings"

	"tubes2/backend/internal/model"
	"golang.org/x/net/html"
)

func Parse(rawHTML string) (*model.DOMNode, error) {
	doc, err := html.Parse(strings.NewReader(rawHTML))
	if err != nil {
		return nil, err
	}

	el := findFirstElement(doc)

	root := model.NewRootNode()
	root.ID = "node-0"
	root.Attributes = make(map[string]string)

	if el == nil {
		root.Tag = "div" // fallback
		return root, nil
	}

	root.Tag = el.Data
	for _, attr := range el.Attr {
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

	for child := el.FirstChild; child != nil; child = child.NextSibling {
		buildTree(child, root)
	}
	return root, nil
}

func findFirstElement(n *html.Node) *html.Node {
	for child := n.FirstChild; child != nil; child = child.NextSibling {
		if child.Type == html.ElementNode {
			return child
		}
	}
	return nil
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
