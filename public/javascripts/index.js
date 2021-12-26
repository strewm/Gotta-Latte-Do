window.addEventListener("load", (event)=>{

})


const swiper = document.querySelector(".swiper")

swiper.addEventListener("click", e => {
    e.stopPropagation
    const heroImg = document.querySelector(".inner-image")
    const heroTitle = document.querySelector(".hero-header")
    const heroSub = document.querySelector(".hero-p")

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

        heroImg.src = `../images/maybe-logo-3.png`
        heroTitle.innerText = `Gotta Latte Do? We'll keep you grounded.`
        heroSub.innerText = `You'll never say 'affogato do that!' again`
    }

    if (counter === 2) {
        bulletTwo.classList.add('bullet-active')
        bulletOne.classList.remove('bullet-active')
        bulletThree.classList.remove('bullet-active')

        heroImg.src = `../images/2-coffee-break.png`
        heroTitle.innerText = `Bean busy? Make a to-brew list.`
        heroSub.innerText = `Never be bitter about missing a roast again`
    }

    if (counter === 3) {
        bulletThree.classList.add('bullet-active')
        bulletTwo.classList.remove('bullet-active')
        bulletOne.classList.remove('bullet-active')

        heroImg.src = `../images/3-coffee-network.png`
        heroTitle.innerText = `Tired of notepads? You'll love our brew-tiful design.`
        heroSub.innerText = `We're meant to bean together!`
    }

})
