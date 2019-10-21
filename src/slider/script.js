import anime from 'animejs';


const range = document.querySelector('.range'),
    box = document.querySelector('.box'),
    boxWrapper = box.parentElement;

const animation = anime({
    targets: box,
    easing: 'easeInOutSine',
    translateX: boxWrapper.clientWidth - box.clientWidth,
    autoplay: false,
    duration: 1000,
    direction: 'alternate',
    loop: true,
    update: anim => {
        range.value = anim.progress;
    }
})

document.querySelector('.play').addEventListener('click', e => {
    animation.play();
});
document.querySelector('.pause').addEventListener('click', e => animation.pause());

range.addEventListener('input', e => {
    animation.seek(animation.duration * e.target.value / 100);
})

