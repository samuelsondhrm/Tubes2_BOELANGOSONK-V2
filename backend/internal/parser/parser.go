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

	root := model.NewRootNode()
	root.ID = "node-0"
	root.Tag = "#document"

	for child := doc.FirstChild; child != nil; child = child.NextSibling {
		if child.Type == html.ElementNode {
			buildTree(child, root)
		}
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
