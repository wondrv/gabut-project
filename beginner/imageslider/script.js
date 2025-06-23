let currentIndex = 0;

function moveSlide(direction) {
  const images = document.querySelectorAll('.slider-image');
  const totalImages = images.length;

  currentIndex = (currentIndex + direction + totalImages) % totalImages;

  const slider = document.querySelector('.slider');
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}
