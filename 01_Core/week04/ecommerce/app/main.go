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
}

func main() {
	// Connecting to the MySQL database
	// How do I deal with secrets?
	database, err := sql.Open("mysql", "jessica:password@tcp(127.0.0.1:3306)/ita")
	if err != nil {
		panic(err)
	}

	db = database
	defer db.Close()

	// Setting up a mux router
	router := mux.NewRouter()

	// Telling the server what to listen for and what to do
	router.HandleFunc("/products/{id}", getProduct)
	router.HandleFunc("/", getAllProducts)

	// Creating the server
	fmt.Printf("listening on port %s\n", port)
	if err := http.ListenAndServe(":"+port, router); err != nil {
		panic(err)
	}
}

// Handler function for getting all products
func getAllProducts(w http.ResponseWriter, r *http.Request) {
	// If it's a get request, we want to query and return the products
	if r.Method == http.MethodGet {
		products := []Product{}
		query := "SELECT Id, Name, Description, Price, Category FROM products"
		rows, err := db.Query(query)
		if err != nil {
			// Print error and return to leave the function
			fmt.Println(err)
			return
		}
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
		// Encoding the struct into JSON that will show on the page with no html
		json.NewEncoder(w).Encode(products)

	}
	// Passing back a status header
	w.WriteHeader(http.StatusCreated)
	fmt.Println("all product api run")

}

// Handler function for getting a single product
func getProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	query := "SELECT Id, Name, Description, Price, Category FROM products"
	result, err := db.Query(query+" WHERE Id = ?", params["id"])
	if err != nil {
		fmt.Println(err)
		return
	}
	defer result.Close()

	for result.Next() {
		var product Product
		err := result.Scan(&product.ID, &product.Name, &product.Description, &product.Price, &product.Category)
		if err != nil {
			fmt.Println(err)
			return
		}
		json.NewEncoder(w).Encode(product)
		fmt.Println("single product api run")
	}
}
