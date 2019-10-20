import { random } from '../lib/math';

const dotsWrapper = document.querySelector('.dots'),
    dotsList = dotsWrapper.getElementsByClassName('dot');

const addAmount = 20;

const width = window.innerWidth,
    height = window.innerHeight,
    maxMove = height / 2,
    minMove = maxMove - 100;

const performedAnimationClass = 'performed-animation',
    breatheClass = 'breathe';

let distance, size, margin;

function toggleClass(className, cb) {
    Array.prototype.forEach.call(dotsList, el => {
        el.classList.toggle(className);
    });

    cb && cb();
}

function optimize() {
    distance = width / dotsList.length;
    size = 50;
    margin = distance - size;

    dotsWrapper.style.setProperty('--dots-count', dotsList.length);
    dotsWrapper.style.setProperty('--dots-margin', `${margin}px`);
    dotsWrapper.style.setProperty('--dots-size', `${size}px`);

}

function add(amount) {
    for (let index = 0; index < amount; index++) {
        const el = document.createElement('div');
        el.classList.add('dot');
        el.style.animationDelay = `${random(0, 1)}s`;
        el.classList.add('animated');
        el.style.setProperty('--move-distance', random(minMove, maxMove) + 'px')

        if (dotsList[0] && dotsList[0].classList.contains(performedAnimationClass)) {
            el.classList.add(performedAnimationClass);
        }

        if (dotsList[0] && dotsList[0].classList.contains(breatheClass)) {
            el.classList.add(breatheClass);
        }

        dotsWrapper.appendChild(el);
    }
}

document.querySelector('.add').addEventListener('click', () => {
    add(addAmount);
    optimize();

    if (dotsList.length > 0) {
        console.log(dotsList.length);
        document.querySelector('.remove').removeAttribute('disabled');
    }
})

document.querySelector('.add').addEventListener('click', () => {
    add(addAmount);
    optimize();
})

document.querySelector('.breathe').addEventListener('click', () => {
    toggleClass(breatheClass);
})

document.querySelector('.remove').addEventListener('click', (e) => {
    for (let i = 0; i < addAmount; i++) {
        dotsList[dotsList.length - 1].remove();
    }
    optimize();


    if (dotsList.length === 0) {
        e.target.setAttribute('disabled', true);
    }
})

document.querySelector('.optimize').addEventListener('click', (e) => {
    toggleClass(performedAnimationClass, () => {
        e.target.innerText = dotsList[0].classList.contains(performedAnimationClass) ? 'Unoptimize!' : 'Optimize!';
    })
})