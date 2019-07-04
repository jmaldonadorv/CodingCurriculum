// SLIDESHOW FUNCTIONALITY 

//Code for image slider in home banner
var imageIndex = 1;


// Next/previous controls
function plusImages(n) {
  showImages(imageIndex += n);
}

// Thumbnail image controls
function currentImage(n) {
  showImages(imageIndex = n);
}

function showImages(n) {
  var i;
  var images = document.getElementsByClassName("images");
  var selector = document.getElementsByClassName("img--selector");
  if (n > images.length) {imageIndex = 1} 
  if (n < 1) {imageIndex = images.length}
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
  console.log('done');
});

// END OF SLIDESHOW CODE FUNCTIONALITY


