//Code for image slider in home banner
var slideIndex = 0;

document.addEventListener("load", function showSlides() {
  var i;
  var slides = document.getElementsByClassName("image");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none"; 
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1} 
  slides[slideIndex-1].style.display = "block"; 
  setTimeout(showSlides, 2000); // Change image every 2 seconds
})