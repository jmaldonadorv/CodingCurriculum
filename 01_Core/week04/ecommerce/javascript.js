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


