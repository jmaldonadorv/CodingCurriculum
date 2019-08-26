package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// Article has the fields to represent an article on a website
type Article struct {
	ID      string `json:"Id"`
	Title   string `json:"Title"`
	Desc    string `json:"desc"`
	Content string `json:"content"`
}

// Articles will be a slice of article types
// This will be a global array that will simulate a database
var Articles []Article

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the Homepage!")
	fmt.Println("Endpoint Hit: homePage")
}

// handleRequests holds all of the handler functions for different endpoints and methods
func handleRequests() {
	myRouter := mux.NewRouter().StrictSlash(true)

	myRouter.HandleFunc("/", homePage)
	myRouter.HandleFunc("/all", returnAllArticles)
	myRouter.HandleFunc("/article", createNewArticle).Methods("POST")
	myRouter.HandleFunc("/article/{id}", updateArticle).Methods("PUT")
	myRouter.HandleFunc("/article/{id}", deleteArticle).Methods("DELETE")
	myRouter.HandleFunc("/article/{id}", returnSingleArticle)

	log.Fatal(http.ListenAndServe(":10000", myRouter))
}

// returnAllArticles will return a string of json from the structs to the writer
func returnAllArticles(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(Articles)
}

// returnSingleArticle will return a single json object based on the ID passed through in the url
func returnSingleArticle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["id"]
	for _, article := range Articles {
		if article.ID == key {
			json.NewEncoder(w).Encode(article)
		}
	}
}

// createNewArticle takes a new json object and appends a new Article to Articles
func createNewArticle(w http.ResponseWriter, r *http.Request) {
	// get the body of our POST request
	// return the string response containing the request body
	reqBody, _ := ioutil.ReadAll(r.Body)

	var article Article
	json.Unmarshal(reqBody, &article)
	// update our global Articles array to include new article
	Articles = append(Articles, article)

	json.NewEncoder(w).Encode(article)
}

// deleteArticle deletes the struct with that ID in Articles
func deleteArticle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	for index, article := range Articles {
		if article.ID == id {
			Articles = append(Articles[:index], Articles[index+1:]...)
		}
	}
}

// updateArticle will take a json object and update the struct with the new values based on the ID when a PUT request is sent
func updateArticle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	reqBody, _ := ioutil.ReadAll(r.Body)
	var newArticle Article
	json.Unmarshal(reqBody, &newArticle)

	for index, article := range Articles {
		if article.ID == id {
			// if the ID matches, getting the pointer value for this specific Article
			n := &Articles[index]
			n.updateStruct(newArticle)
		}
	}
	fmt.Println(Articles)
}

// updateStruct is a helper method that will update an Article using the pointer.
// In order to update the actual pointer value, you have to have a method that has a pointer receiver
func (p *Article) updateStruct(n Article) {
	p.Title = n.Title
	p.Desc = n.Desc
	p.Content = n.Content

}

func main() {
	fmt.Println("Rest API v2.0 - Mux Routers")
	Articles = []Article{
		Article{ID: "1", Title: "Hello", Desc: "Article Description", Content: "Article Content"},
		Article{ID: "2", Title: "Hello 2", Desc: "Article Description", Content: "Article Content"},
	}

	handleRequests()
}
