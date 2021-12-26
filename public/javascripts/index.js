// Setting up index of slides variable
var slideIdx = 1;
viewSlide(slideIdx);

// Left/right buttons
function changeSlide(shift) {
    viewSlide(slideIdx += shift)
};

// Slide shifting
function currSlide(index) {
    changeSlide(slideIdx = index);
};

function viewSlide(n) {
    var i;
    var slides = document.getElementsByClassName('slides');
    var circles = document.getElementsByClassName('circle');
    console.log(slides);
    console.log(circles);

    // If user clicks right on last slide, will bring the user
    //  back to first slide
    if (n > slides.length) {
        slideIdx = 1;
    }

    // If user clicks left on first slide, will bring the user
    //  to last slide
    if (n < 1) {
        slideIdx = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < circles.length; i++) {
        circles[i].className = circles[i].className.replace("active", "");

        // circles[i].className += "active";
    }

    slides[slideIdx-1].style.display = "block";
    circles[slideIdx-1].className += "active";
};

