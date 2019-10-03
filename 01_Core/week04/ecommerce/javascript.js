
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

// VARIABLE DECLARATION

// Set up our HTTP request
let xhr = new XMLHttpRequest();
// Creating regexp objects for determining which page it's on.
// prodDetailsMatch will match product details url
const prodDetailsMatch = new RegExp('product_details.html')
// allProdMatch will match the all products page 
const allProdMatch = new RegExp('products/index.html')
//Code for image slider in home banner
let imageIndex = 1;
// Getting URL of current page to use for determining endpoint
let url = document.URL


// SLIDESHOW FUNCTIONALITY 

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

// END OF SLIDESHOW CODE FUNCTIONALITY

// START OF API CALLS & DOM MANIPULATION FOR PRODUCTS

// parseProducts takes the http response & parses it into an array of objects
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
// showFeaturedProducts manipulates the DOM of featured classes to show the appropriate products
function showFeaturedProducts(array) {
  // Selecting all of the nodes that we want to change
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
      // Changing the link based on the product ID so that the correct product will be retrieved from the endpoint
      // If on an "all products" view, it's already in the product directory
      link[i].href= 'product_details.html?pid=' + array[i].id
    } else {
      link[i].href= 'products/product_details.html?pid=' + array[i].id
    }
    
  }
}

// showSingleProduct manipulates the DOM on the product details pages for the product information
function showSingleProduct(array) {
  // Changing what is shown
  document.querySelector('#pdp--name').innerHTML = array[0].name
  document.querySelector('#pdp--desc').innerHTML = array[0].desc
  document.querySelector('#pdp--price').innerHTML = '$' + array[0].price
  // Changing the form values so a cart add would have the correct values
  let formInputs = document.querySelectorAll('.form__product input')
  // I wasn't able to select the nodes by product name (i'm sure you can, but i didn't figure it out)
  // So this looks at all of the inputs (there are more than these 2), and changes the right ones
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

// updateProductPhotos manipulates the DOM on the product details pages for the main & thumbnail images
function updateProductPhotos(array) {
  let fullImages = document.querySelectorAll('.img--main')
  let thumbnail = document.querySelectorAll('.img--thumbnail')
  // These are all relative links to the images
  let photoArray = [array[0].pic_1, array[0].pic_2, array[0].pic_3, array[0].pic_4]
  for (let i = 0; i < photoArray.length; i++){
    // I couldn't query & put a null value into a struct in the api, so I replaced all of the nulls with 'none'
    // and if there is no link for the image, the node will be hidden
    if (photoArray[i] == 'none') {
      thumbnail[i].style.display = 'none'
    } else {
      // Currently in the product directory, so have to go up to get to the images directory
      fullImages[i].src = '..'+photoArray[i]
      thumbnail[i].src = '..'+photoArray[i]
    }  
  }
}

// END OF API CALLS & DOM MANIPULATION FOR PRODUCTS

function init() {
// Adding event listener to access & change slideshow images on homepage
  document.addEventListener("DOMContentLoaded", (event) => {
    showImages(imageIndex);
  });
  // logic to determine which endpoint it should hit based on the URL
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
  // Listener function to get the product data and edit the page based on what was returned
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
  // add error handling    
    } else {
      // What do when the request fails
      console.log('The request failed!');
    }
    // Adding event listener for slideshow images
   
  };


} // end of init function

init();