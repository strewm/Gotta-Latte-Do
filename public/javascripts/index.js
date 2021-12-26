const swipeOne = document.querySelector(".swipe-one")
const swipeTwo = document.querySelector(".swipe-two")
const swipeThree = document.querySelector(".swipe-three")

window.addEventListener("load", (event)=>{
    swipeTwo.classList.add('swipe-hide')
    swipeThree.classList.add('swipe-hide')
})


const swiper = document.querySelector(".swiper")

swiper.addEventListener("click", e => {
    e.stopPropagation

    const bulletOne = document.querySelector(".bullet-1")
    const bulletTwo = document.querySelector(".bullet-2")
    const bulletThree = document.querySelector(".bullet-3")

    const clicked = e.target.className
    let counter = 1;

    if (clicked === "bullet-1") {
        counter = 1
    }

    else if(clicked === "bullet-2") {
        counter = 2
    }

    else if (clicked === "bullet-3") {
        counter = 3
    }

    else {
        return
    }

    if (counter === 1) {
        bulletOne.classList.add('bullet-active')
        bulletTwo.classList.remove('bullet-active')
        bulletThree.classList.remove('bullet-active')

        swipeOne.classList.remove('swipe-hide')
        swipeTwo.classList.add('swipe-hide')
        swipeThree.classList.add('swipe-hide')
    }

    if (counter === 2) {
        bulletTwo.classList.add('bullet-active')
        bulletOne.classList.remove('bullet-active')
        bulletThree.classList.remove('bullet-active')

        swipeOne.classList.add('swipe-hide')
        swipeTwo.classList.remove('swipe-hide')
        swipeThree.classList.add('swipe-hide')
    }

    if (counter === 3) {
        bulletThree.classList.add('bullet-active')
        bulletTwo.classList.remove('bullet-active')
        bulletOne.classList.remove('bullet-active')

        swipeOne.classList.add('swipe-hide')
        swipeTwo.classList.add('swipe-hide')
        swipeThree.classList.remove('swipe-hide')
    }

})
