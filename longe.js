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
   // 翻页功能
   document.getElementById('next-btn').addEventListener('click', showNextImage);
   document.getElementById('prev-btn').addEventListener('click', showPrevImage);

   sliderImages.forEach(img => {
       img.addEventListener('click', showNextImage);
   });

   // 交换功能
   const swapButton = document.querySelector('.swap-btn');
   const departureInput = document.getElementById('departure');
   const arrivalInput = document.getElementById('arrival');

   swapButton.addEventListener('click', function() {
       const temp = departureInput.value;
       departureInput.value = arrivalInput.value;
       arrivalInput.value = temp;
   });

      // 乘客人数计数器
      const counters = document.querySelectorAll('.counter');
      counters.forEach(counter => {
          const decrementButton = counter.querySelector('.decrement');
          const incrementButton = counter.querySelector('.increment');
          const countDisplay = counter.querySelector('span');
  
          decrementButton.addEventListener('click', () => {
              let count = parseInt(countDisplay.textContent, 10);
              if (count > 0) {
                  count--;
                  countDisplay.textContent = count;
              }
          });
  
          incrementButton.addEventListener('click', () => {
              let count = parseInt(countDisplay.textContent, 10);
              count++;
              countDisplay.textContent = count;
          });
      });
});