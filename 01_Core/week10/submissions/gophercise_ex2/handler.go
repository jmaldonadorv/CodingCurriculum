package main

import (
	"fmt"
	"net/http"

	"gopkg.in/yaml.v2"
)

// MapHandler will return an http.HandlerFunc (which also
// implements http.Handler) that will attempt to map any
// paths (keys in the map) to their corresponding URL (values
// that each key in the map points to, in string format).
// If the path is not provided in the map, then the fallback
// http.Handler will be called instead.
func mapHandler(pathsToUrls map[string]string, fallback http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		if dest, ok := pathsToUrls[path]; ok {
			http.Redirect(w, r, dest, http.StatusFound)
			return
		}
		fallback.ServeHTTP(w, r)
	}
	// if we can match a path, redirect to it
}

// YAMLHandler will parse the provided YAML and then return
// an http.HandlerFunc (which also implements http.Handler)
// that will attempt to map any paths to their corresponding
// URL. If the path is not provided in the YAML, then the
// fallback http.Handler will be called instead.
//
// YAML is expected to be in the format:
//
//     - path: /some-path
//       url: https://www.some-url.com/demo
//
// The only errors that can be returned all related to having
// invalid YAML data.
//
// See MapHandler to create a similar http.HandlerFunc via
// a mapping of paths to urls.
func yamlHandler(yamlBytes []byte, fallback http.Handler) (http.HandlerFunc, error) {
	// 1. Parse YAML
	var pathUrls []PathURL
	err := yaml.Unmarshal(yamlBytes, &pathUrls)
	fmt.Println(&pathUrls)
	if err != nil {
		return nil, err
	}
	// 2. Convert YAMl array into map
	pathsToUrls := make(map[string]string)
	for _, pu := range pathUrls {
		pathsToUrls[pu.Path] = pu.URL
		fmt.Println(pathsToUrls)

	}
	// 3. REturn a map handler using the map

	return mapHandler(pathsToUrls, fallback), nil
}

// PathURL : struct for yaml paths
type PathURL struct {
	Path string `yaml:"path"`
	URL  string `yaml:"url"`
}
