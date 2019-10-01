
// Object constructor for the products
function Product (id, name, desc, price, category, pic_1, pic_2, pic_3, pic_4){
  this.id = id;
  this.name = name;
  this.desc = desc;
  this.price = price;
  this.category = category;
  this.pic_1 = pic_1;
  this.pic_2 = pic_2;
  this.pic_3 = pic_3;
  this.pic_4 = pic_4;
}


// SLIDESHOW FUNCTIONALITY 

//Code for image slider in home banner
let imageIndex = 1;


// Next/previous controls
function plusImages(n) {
  showImages(imageIndex += n);
}

// Thumbnail image controls
function currentImage(n) {
  showImages(imageIndex = n);
}

// To change how the images are 
function showImages(n) {
  let images = document.getElementsByClassName("images");
  let selector = document.getElementsByClassName("img--selector");
  if (n > images.length) {
    imageIndex = 1
  } 
  else if (n < 1) {
    imageIndex = images.length
  }
  // To make sure all of the images are hidden.
  for (i = 0; i < images.length; i++) {
      images[i].style.display = "none"; 
  }

  for (i = 0; i < selector.length; i++) {
      selector[i].className = selector[i].className.replace(" active", "");
  }
  images[imageIndex-1].style.display = "block"; 
  selector[imageIndex-1].className += " active";
}


document.addEventListener("DOMContentLoaded", (event) => {
	showImages(imageIndex);
});

// END OF SLIDESHOW CODE FUNCTIONALITY

// API CALLS TO GET PRODUCT INFORMATION

// Set up our HTTP request
let xhr = new XMLHttpRequest();
// Creating regexp objects for determining which page it's on.
const prodDetailsMatch = new RegExp('product_details.html')
const allProdMatch = new RegExp('products/index.html')
//const featuredProdMatch = new RegExp('') -- This is just homepage for now...

// Create and send a GET request
// The first argument is the post type (GET, POST, PUT, DELETE, etc.)
// The second argument is the endpoint URL

let url = document.URL

// Calling to the appropriate endpoint based on the page
if (prodDetailsMatch.test(url)) {
  let prodId = url.split('?pid=')[1]
  let prodApiString = 'http://localhost:8000/api/products/' + prodId
  xhr.open('GET', prodApiString);
  xhr.send();
} else if (allProdMatch.test(url)) {
  xhr.open('GET', 'http://localhost:8000/api/products');
  xhr.send();
} else {
  xhr.open('GET', 'http://localhost:8000/api/products/featured');
  xhr.send();
}

// Setup our listener to process completed requests
xhr.onload = function () {

  // Process our return data
  // If the request is successful, move forward
	if (xhr.status >= 200 && xhr.status < 300) {
    // Parse product information and products = array of queried products
    let products = parseProducts()
    // Altering the html of the featured products
    if (prodDetailsMatch.test(url)) {
      showSingleProduct(products)
    } 
    else {
      showFeaturedProducts(products)
    }
 

    // This will actually change the values based on the returned object
  

// add error handling    
	} else {
		// What do when the request fails
		console.log('The request failed!');
	}
};


function parseProducts(){
  // parsing the returned string into a json object
  let prod = JSON.parse(xhr.response)
  // making an array of objects IF there is more than one object. Otherwise the array will be empty.
  let prodArrayTemp = Array.from(prod)
  // If the array is empty, push the one object into it
  if (prodArrayTemp.length < 1) {
    prodArrayTemp.push(prod)
  }
  // Creating an array of objects with the Product prototype
  let prodArray = []
  for (let i = 0; i < prodArrayTemp.length; i++) {
    let obj = new Product(prodArrayTemp[i].id, prodArrayTemp[i].name, prodArrayTemp[i].description, prodArrayTemp[i].price, prodArrayTemp[i].category,
      prodArrayTemp[i].pic_1,prodArrayTemp[i].pic_2, prodArrayTemp[i].pic_3, prodArrayTemp[i].pic_4); 
      prodArray.push(obj);
  }
  console.log(prodArray)
  return prodArray
}

function showFeaturedProducts(array) {
  let name = document.querySelectorAll('.featured__name')
  let price = document.querySelectorAll('.featured__price')
  let image = document.querySelectorAll('.featured__image')
  let link = document.querySelectorAll('.featured__link')

  for (let i = 0; i < array.length; i++){
    name[i].innerText = array[i].name;
    price[i].innerHTML = '$' + array[i].price;
    image[i].outerHTML = '<img class="featured__image" src="../images/featured/featured_' + array[i].id + '.png">';
    // If on the product page, don't need to navigate to the product folder
    if (allProdMatch.test(url)) {
      link[i].href= 'product_details.html?pid=' + array[i].id
    } else {
      link[i].href= 'products/product_details.html?pid=' + array[i].id
    }
    
  }
}

// specifically for updating photos of the PDP
function updateProductPhotos(array) {
  let fullImages = document.querySelectorAll('.img--main')
  let thumbnail = document.querySelectorAll('.img--thumbnail')
  let photoArray = [array[0].pic_1, array[0].pic_2, array[0].pic_3, array[0].pic_4]
  for (let i = 0; i < photoArray.length; i++){
    if (photoArray[i] == 'none') {
      thumbnail[i].style.display = 'none'
    } else {
      fullImages[i].src = '..'+photoArray[i]
      thumbnail[i].src = '..'+photoArray[i]
    }
    
  }

}

// 
function showSingleProduct(array) {
  // Changing what is shown
  document.querySelector('#pdp--name').innerHTML = array[0].name
  document.querySelector('#pdp--desc').innerHTML = array[0].desc
  document.querySelector('#pdp--price').innerHTML = '$' + array[0].price
  // Changing the form values
  let formInputs = document.querySelectorAll('.form__product input')
  for (let i = 0; i < formInputs.length; i++) {
    if (formInputs[i].name == 'product_name'){
      formInputs[i].value = array[0].name
    } 
    else if (formInputs[i].name == 'product_price') {
      formInputs[i].value = array[0].price
    } 
  }
  updateProductPhotos(array)

}


// END OF API CALLS FOR PRODUCT INFORMATION