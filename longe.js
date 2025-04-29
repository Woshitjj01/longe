document.addEventListener("DOMContentLoaded", function() {
    const sliderImages = document.querySelectorAll('.slider img');
    let currentIndex = 0;
    

 function showImage(index) {
      sliderImages.forEach((img, i) => {
   if (i === index) {
    img.classList.add('active');
  } else {
     img.classList.remove('active');
 }
});
}
    
 
function showNextImage() {
currentIndex = (currentIndex + 1) % sliderImages.length;
showImage(currentIndex);
 }
    
   
function showPrevImage() {
 currentIndex = (currentIndex - 1 + sliderImages.length) % sliderImages.length;
 showImage(currentIndex);
}
    
 
 document.getElementById('next-btn').addEventListener('click', showNextImage);
 document.getElementById('prev-btn').addEventListener('click', showPrevImage);

 
 sliderImages.forEach(img => {
  img.addEventListener('click', showNextImage);
   });
    });