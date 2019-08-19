package main

import (
	"fmt"
	"io"
	"strings"

	"golang.org/x/net/html"
)

// Link represents a link in an HTML document (<a href="...">)
type Link struct {
	href string
	text string
}

// Parse will take in an HTML document and will return a slice of links parsed from it
func Parse(r io.Reader) ([]Link, error) {
	doc, err := html.Parse(r)
	if err != nil {
		return nil, err
	}
	nodes := linkNodes(doc)
	var links []Link
	for _, node := range nodes {
		links = append(links, buildLink(node))
	}
	//buildLink(nodes)
	// 1. find <a> nodes in doc
	// 2. For each <a> node
	// 2.a build a Link
	// 3. return the Links
	return links, nil
}

// Parsing out the text from each of the nodes returned from linkNodes
func text(n *html.Node) string {
	if n.Type == html.TextNode {
		return n.Data
	}
	if n.Type != html.ElementNode {
		return ""
	}
	var ret string
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		ret += text(c)
	}
	return strings.Join(strings.Fields(ret), " ")
}

// Parsing the link value and building the Links from each of the nodes returned from linkNodes
func buildLink(n *html.Node) Link {
	var ret Link
	for _, attr := range n.Attr {
		if attr.Key == "href" {
			ret.href = attr.Val
			break
		}
	}
	ret.text = text(n)
	return ret
}

// Returns a slice of nodes that are links
func linkNodes(n *html.Node) []*html.Node {
	if n.Type == html.ElementNode && n.Data == "a" {
		return []*html.Node{n}
	}
	var ret []*html.Node
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		ret = append(ret, linkNodes(c)...)
	}
	return ret
}
