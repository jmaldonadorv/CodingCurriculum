package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"text/template"
)

var templates = template.Must(template.ParseFiles("edit.html", "view.html")) // Parses out the provided files so that the data can be injected and the HTML file rendered successfully. Doing this once in the variable instead of calling it multiple times is more efficient.
var validPath = regexp.MustCompile("^/(edit|save|view)/([a-zA-Z0-9]+)$")     // Initializing a regexp - the MustCompile function ensures that the regexp passed through is valid and can be used to match against text.
// Returns a regexp to be used to match against the file names later. Makes sure that the request URL is in the form of /view(etc)/alphanumeric

// Page : Representing each page in the wiki
type Page struct {
	Title string
	Body  []byte
}

func (p *Page) save() error { // function save() can be called using type *Page and returns an error
	filename := p.Title + ".txt"                    // using the Page.Title field and appending ".txt" for the file name
	return ioutil.WriteFile(filename, p.Body, 0600) // Writing the file with the p.Title (filename) as the name, the Page.Body as the file contents, and RW permissions for current user.
}

// loadPage takes in the title of a page and returns a pointer to a Page after reading the file
func loadPage(title string) (*Page, error) {
	filename := title + ".txt"             // The file names are actually title.txt so just defining the actual file name
	body, err := ioutil.ReadFile(filename) // Returning a byte slice with the contents of the file
	if err != nil {                        // If there is an error, return nil for the body and then also the error
		return nil, err
	}
	return &Page{Title: title, Body: body}, nil // This is returning a pointer to a Page with the title passed to the function and the body created from reading the file
}

// viewHandler returns an http response if the page requested exists, and if not it redirects to the /edit/ page so one can be created.
func viewHandler(w http.ResponseWriter, r *http.Request, title string) {
	p, err := loadPage(title) // p will be the pointer to the Page struct with the title specified
	if err != nil {           // if there's an error, this page doesn't exist. It will redirect then to /edit/title, which will then be handled by the editHandler function
		http.Redirect(w, r, "/edit/"+title, http.StatusFound)
		return
	}
	renderTemplate(w, "view", p) // if there isn't an error, renderTemplate will generate the http response to the browser so it can render the page
}

// editHandler returns an http response that will render the edit.html template
func editHandler(w http.ResponseWriter, r *http.Request, title string) {
	p, err := loadPage(title) // if the page exists, p will be the body of the page and will be populated in the template
	if err != nil {
		p = &Page{Title: title} // if there is an error, the page doesn't exist so this creates a new Page pointer with the title passed as the Title field. The Body field will be empty, so the rendered page will show an empty box.
	}
	renderTemplate(w, "edit", p) // Render the edit.html template with p and create an http response to the browser
}

// The form action for the edit page is "/save/{{.Title}}", so this function runs when someone saves their edited(or new) page.
func saveHandler(w http.ResponseWriter, r *http.Request, title string) {
	body := r.FormValue("body")                  // Takes the text put in the form and returns as the body.
	p := &Page{Title: title, Body: []byte(body)} // Creating (or over-writing) a Page struct with the title passed and a byte slice of the body text
	err := p.save()                              // Saving the file as title.txt
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError) // if there's an error, return a 500 error
		return
	}
	http.Redirect(w, r, "/view/"+title, http.StatusFound) // Once file is saved without error, redirect to the View page to see new page.
}

// renderTemplate will create an HTTP response
func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
	err := templates.ExecuteTemplate(w, tmpl+".html", p) // Executes the template as passed (edit or view) and returns an HTML file with headers and a status message to the ResponseWriter so it will be served to the user.
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError) // If there is an execution error, send a 500 error
		return
	}
}

func makeHandler(fn func(http.ResponseWriter, *http.Request, string)) http.HandlerFunc { // this function will wrap the View/Edit/Save handler functions and do the path validation rather than having the same code
	return func(w http.ResponseWriter, r *http.Request) {
		m := validPath.FindStringSubmatch(r.URL.Path) // FindStringSubmatch is a function used with receiver *Regexp (which validPath returns). It takes the URL path and returns a substring of the expected URL based on regexp defined.
		// m variable should look something like "/view/test"
		if m == nil { // If the string provided in the request doesn't match the regexp...
			http.NotFound(w, r) // Respond to the request with a 404 and return
			return
		}
		fn(w, r, m[2]) // m[2] will be the second subexpression that's returned in the slice of strings. will return something like [save/file save file] with file being m[2]. It's a submatch of the regex(?)
	}
}

func main() {
	http.HandleFunc("/view/", makeHandler(viewHandler)) // If a request has the path /view/, makeHandler deals with validating the actual path, and assuming that executes without error, will run the viewHandler function to render (or redirect to edit) the requested page.
	http.HandleFunc("/edit/", makeHandler(editHandler)) // Same as above except will only render edit page
	http.HandleFunc("/save/", makeHandler(saveHandler)) // Same as above, will save file and then redirect to /view/ of the same file.
	log.Fatal(http.ListenAndServe(":8080", nil))        // This is listening for http requests to 8080 server. If error, will quit program.
}
