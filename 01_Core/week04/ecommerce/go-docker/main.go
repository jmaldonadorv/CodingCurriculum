package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

var port = "8000"
var db *sql.DB

// Product struct will contain product information
type Product struct {
	ID          int64   `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Category    string  `json:"category"`
	Pic1        string  `json:"pic_1"`
	Pic2        string  `json:"pic_2"`
	Pic3        string  `json:"pic_3"`
	Pic4        string  `json:"pic_4"`
}

func main() {
	// Connecting to the MySQL database
	// How do I deal with secrets?
	database, err := sql.Open("mysql", "jessica:password@tcp(db:3306)/ita")
	if err != nil {
		panic(err)
	}
	db = database
	defer db.Close()

	// Setting up a mux router
	router := mux.NewRouter()

	// Telling the server what to listen for and what to do
	router.HandleFunc("/api/products/featured", getFeaturedProducts)
	router.HandleFunc("/api/products/{id}", getSingleProduct)
	router.HandleFunc("/api/products", getAllProducts)

	// Creating the server
	fmt.Printf("listening on port %s\n", port)
	if err := http.ListenAndServe(":"+port, router); err != nil {
		fmt.Println(err)
	}

}

// getAllProducts sets the query for all products & runs getMultipleProducts to run the query
func getAllProducts(w http.ResponseWriter, r *http.Request) {
	query := "SELECT Id, Name, Description, Price, Category FROM products"
	getMultipleProducts(w, r, query)
	fmt.Println("all product api run")
}

// getFeaturedProducts sets the query for featured products & runs getMultipleProducts to run the query
func getFeaturedProducts(w http.ResponseWriter, r *http.Request) {
	query := "SELECT Id, Name, Description, Price, Category FROM products WHERE featured = 1"
	getMultipleProducts(w, r, query)
	fmt.Println("featured product api run")
}

// getSingleProduct queries and retrieves a single product from the database for the PDP
func getSingleProduct(w http.ResponseWriter, r *http.Request) {
	setHeaders(w, r)
	params := mux.Vars(r)
	query := "SELECT Id, Name, Description, Price, Category, pic_1, pic_2, pic_3, pic_4 FROM products"
	result, err := db.Query(query+" WHERE Id = ?", params["id"])
	if err != nil {
		fmt.Println(err)
		return
	}
	defer result.Close()
	// Taking all of the results & putting themt into a Product struct
	for result.Next() {
		var product Product
		err := result.Scan(&product.ID, &product.Name, &product.Description, &product.Price, &product.Category,
			&product.Pic1, &product.Pic2, &product.Pic3, &product.Pic4)
		if err != nil {
			fmt.Println(err)
			return
		}
		// Encoding the struct into JSON will allow us to access the JSON object using javascript
		json.NewEncoder(w).Encode(product)
		fmt.Println("single product api run")
	}
}

// getMultipleProducts queries & retrieves multiple products from the database
func getMultipleProducts(w http.ResponseWriter, r *http.Request, query string) {
	setHeaders(w, r)
	// If it's a get request, we want to query and return the products
	if r.Method == http.MethodGet {
		products := []Product{}
		rows, err := db.Query(query)
		if err != nil {
			// Print error and return to leave the function
			fmt.Println(err)
			return
		}
		// Taking all of the results & putting themt into a Product struct
		// As long as there is a next row, we are defining which fields the product struct will be assigned
		for rows.Next() {
			var product Product
			err := rows.Scan(&product.ID, &product.Name, &product.Description, &product.Price, &product.Category)
			if err != nil {
				fmt.Println(err)
				return
			}
			// Appending all product structs to the products slice
			products = append(products, product)
		}
		// Encoding the struct into JSON will allow us to access the JSON object using javascript
		json.NewEncoder(w).Encode(products)
	}
}

// setHeaders sets the headers for the response
func setHeaders(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:9090")
}
