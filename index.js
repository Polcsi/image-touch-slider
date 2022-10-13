const slider = document.querySelector(".slider-container"),
  slides = Array.from(document.querySelectorAll(".slide"));

let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  previousTranslate = 0,
  animationID = 0,
  currentIndex = 0;

slides.forEach((slide, index) => {
  const slideImage = slide.querySelector("img");
  slideImage.addEventListener("dragstart", (e) => e.preventDefault());

  // Touch events
  slide.addEventListener("touchstart", touchStart(index));
  slide.addEventListener("touchend", touchEnd);
  slide.addEventListener("touchmove", touchMove);

  // Mobile events
  slide.addEventListener("mousedown", touchStart(index));
  slide.addEventListener("mouseup", touchEnd);
  slide.addEventListener("mouseleave", touchEnd);
  slide.addEventListener("mousemove", touchMove);
});

// Disable context menu
window.oncontextmenu = function (e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

function touchStart(index) {
  return function (event) {
    startPos = getPositionX(event);
    currentIndex = index;
    isDragging = true;

    animationID = requestAnimationFrame(animation);
    slider.classList.add("grabbing");
  };
}

function touchEnd() {
  isDragging = false;
  cancelAnimationFrame(animationID);

  const movedBy = currentTranslate - previousTranslate;
  if (movedBy < -100 && currentIndex < slides.length - 1) {
    currentIndex += 1;
  }
  if (movedBy > 100 && currentIndex > 0) {
    currentIndex -= 1;
  }
  setPositionByIndex();

  slider.classList.remove("grabbing");
}

function touchMove(event) {
  if (isDragging) {
    const currentPostition = getPositionX(event);
    currentTranslate = previousTranslate + currentPostition - startPos;
  }
}

function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function animation() {
  setSliderPostition();
  if (isDragging) {
    requestAnimationFrame(animation);
  }
}

function setSliderPostition() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -window.innerWidth; // multiply window.innerWidth to the slide width
  previousTranslate = currentTranslate;
  setSliderPostition();
}
