// const slidesContainer = document.querySelector('.slides-second-container');
const slidesContainer = document.querySelector('.slides-container');
const slides = [...slidesContainer.children];

const circleButts = document.querySelector('.circle-butts');
const circles = document.getElementsByClassName('circle');
const circlesArr = [...circles];

// Get the width of the current slide
const slidesWidth = slides[0].getBoundingClientRect().width;

// Get slides next to each other
slides[0].style.left = (slidesWidth * 0) + 'px';
slides[1].style.left = (slidesWidth * 1) + 'px';
slides[2].style.left = (slidesWidth * 2) + 'px';

// Function for slides to move to left/right side when clicking respective arrows
const changeSlide = (slidesContainer, currSlide, clickedSlide) => {
    // Get the value of the left property, in order to apply how much to move image
    slidesContainer.style.transform = `translateX(-${clickedSlide.style.left})`;

    // Moving the currSlide class to the slide's clicked sibling!
    currSlide.classList.remove('currSlide');
    clickedSlide.classList.add('currSlide');
}

// Move to left on click of left arrow
const leftButt = document.querySelector('.left-button');
leftButt.addEventListener('click', (e) => {
    const currSlide = document.querySelector('.currSlide');
    const leftSlide = currSlide.previousElementSibling;

    changeSlide(slidesContainer, currSlide, leftSlide);

    // Will change the highlighted circle to the clicked circle
    const currCircle = circleButts.querySelector('.currSlide');
    const leftCircle = currCircle.previousElementSibling;
    currCircle.classList.remove('currSlide');
    leftCircle.classList.add('currSlide');
})

// Move to right on click of right arrow
const rightButt = document.querySelector('.right-button');
rightButt.addEventListener('click', (e) => {
    const currSlide = document.querySelector('.currSlide'); // Could be slidesContainer.querySelector
    const rightSlide = currSlide.nextElementSibling;

    changeSlide(slidesContainer, currSlide, rightSlide);

    // Will change the highlighted circle to the clicked circle
    const currCircle = circleButts.querySelector('.currSlide');
    const rightCircle = currCircle.nextElementSibling;
    currCircle.classList.remove('currSlide');
    rightCircle.classList.add('currSlide');
});

// Move to slide associated with circle click
circleButts.addEventListener('click', (e) => {
    // Which circle was clicked? Set clickedCircle to null if click is not on circle
    const clickedCircle = e.target.closest('button');
    console.log(clickedCircle);

    // If not clicking on circle, return (to exit)
    if (!clickedCircle) return;

    const currSlide = slidesContainer.querySelector('.currSlide');
    const currCircle = circleButts.querySelector('.currSlide');

    // Find the index of the clicked circle by checking each of the circle positions
    // in the array against the value of the clickedCircle
    const clickedIndex = circlesArr.findIndex((ele) => ele == clickedCircle);
    const clickedSlide = slides[clickedIndex];

    changeSlide(slidesContainer, currSlide, clickedSlide);

    // Will change the highlighted circle to the clicked circle
    currCircle.classList.remove('currSlide');
    clickedCircle.classList.add('currSlide');


    // if (clickedIndex === 0) {

    // }
})
