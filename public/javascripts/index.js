window.addEventListener("load", (event)=>{

})

const slidesContainer = document.querySelector('.slides-container');
const slides = slidesContainer.children;
const slidesToo = Array.from(slidesContainer.children);

console.log(slides);
console.log(slidesToo);

const leftButt = document.querySelector('.left-button');
const rightButt = document.querySelector('.right-button');

const circleButts = document.querySelector('.circle-butts');
const circles = circleButts.children;
console.log(circles);

// Get the width of the current slide
const slidesWidth = slides[0].getBoundingClientRect().width;
