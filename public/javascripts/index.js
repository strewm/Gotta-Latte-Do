window.addEventListener("load", (event)=>{

})

const slidesContainer = document.querySelector('.slides-container');
const slides = slidesContainer.children;
console.log(slides);




// Get the width of the current slide
const slidesWidth = slides[0].getBoundingClientRect().width;
console.log(slidesWidth);

// Get slides next to each other
slides[0].style.left = (slidesWidth * 0) + 'px';
slides[1].style.left = (slidesWidth * 1) + 'px';
slides[2].style.left = (slidesWidth * 2) + 'px';

// Move to left on click of left arrow
const leftButt = document.querySelector('.left-button');
leftButt.addEventListener('click', (e) => {
    const currSlide = slidesContainer.querySelector('.currSlide');
    const prevSlide = currSlide.previousElementSibling;

    // Get the value of the left property, in order to apply how much to move image
    const move = prevSlide.style.left;

    slidesContainer.style.transform = `translateX(-${move})`;

    // Moving the currSlide class to the slide's next sibling!
    currSlide.classList.remove('currSlide');
    prevSlide.classList.add('currSlide');
})

// Move to right on click of right arrow
const rightButt = document.querySelector('.right-button');
rightButt.addEventListener('click', (e) => {
    const currSlide = slidesContainer.querySelector('.currSlide');
    const nextSlide = currSlide.nextElementSibling;

    // Get the value of the left property, in order to apply how much to move image
    const move = nextSlide.style.left;

    slidesContainer.style.transform = `translateX(-${move})`;

    // Moving the currSlide class to the slide's next sibling!
    currSlide.classList.remove('currSlide');
    nextSlide.classList.add('currSlide');
})

// ////////////// Change above slidesContainer.querySelector to document. !

// Move to slide associated with circle click
const circleButts = document.querySelector('.circle-butts');
const circles = document.getElementsByClassName('circle');
const circlesToo = Array.from(circleButts.children);
console.log(circles);
console.log(circlesToo)
// const circlesToo = circleButts.children;

circleButts.addEventListener('click', (e) => {
    // Which circle was clicked? Set clickedCircle to null if click is not on circle
    const clickedCircle = e.target.closest('button');

    // If not clicking on circle, return to exit
    if (!clickedCircle) return;

    const currSlide = slidesContainer.querySelector('.currSlide');
    const currCircle = circleButts.querySelector('.currSlide');

    // Find the index of the clicked circle by checking each of the circle positions
    // in the array against the value of the clickedCircle
    const circleIndex = (ele) => ele === clickedCircle;
    const clickedIndex = circles.findIndex(circleIndex);
    const clickedSlide = slides[clickedIndex];

    console.log(clickedIndex);


    const move = nextSlide.style.left;
    slidesContainer.style.transform = `translateX(-${move})`;
    currSlide.classList.remove('currSlide');
    clickedSlide.classList.add('currSlide');

    // const move = nextSlide.style.left;
    slidesContainer.style.transform = `translateX(-${move})`;
    currCircle.classList.remove('currSlide');
    clickedCircle.classList.add('currSlide');
})
