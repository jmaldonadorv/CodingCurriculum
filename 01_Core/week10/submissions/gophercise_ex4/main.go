package main

import (
	"fmt"
	"strings"
)

var examplehtml = `
	<a href="/dog-cat">dog cat <!-- commented text SHOULD NOT be included! --></a>
	<a href="/dog-cat2">dog cat <!-- commented text SHOULD NOT be included! --></a>
	<a href="/dog-dog">dog cat <!-- commented text SHOULD NOT be included! --></a>
`

func main() {
	r := strings.NewReader(examplehtml)
	links, err := Parse(r)
	if err != nil {
		panic(err)

	}
	fmt.Printf("%+v]n", links)

}

// What functions the end user wants. How do they want to use it, how can we make this as easy as possible for them?
