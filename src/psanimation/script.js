import { randomRounded, random } from '../lib/math';
import { animation, transform } from '../lib/animations';
import { TweenMax } from 'gsap';
// import 'web-animations-js';
import Velocity from 'velocity-animate';
import anime from 'animejs';

const wrapper = document.getElementById('fly-icons'),
    items = wrapper.getElementsByClassName('item');
const classesIndexes = ['SQUARE', 'CIRCLE', 'CROSSES', 'TRIANGLE'];

let width = 1024,
    height = 768;

const classes = {
    [classesIndexes[0]]: 'square',
    [classesIndexes[1]]: 'circle',
    [classesIndexes[2]]: 'crosses',
    [classesIndexes[3]]: 'triangle',
}

const addAmount = 20;

const logElements = () => console.log('Elements count!', items.length);

const add = amount => {
    const indexesAmount = classesIndexes.length - 1;
    for (let i = 0; i < amount; i++) {
        const elementClass = classes[classesIndexes[randomRounded(0, indexesAmount)]],
            element = document.createElement('div');
        element.classList.add(elementClass);
        element.classList.add('item');
        wrapper.appendChild(element);
        element.style.transform = transform(
            random(0, width),
            random(0, height),
            0, 1
        );
    }
    logElements();
}

const remove = amount => {
    Array(amount).fill(1).forEach((n, i) => {
        items[items.length - 1 - i].remove();
    })
    logElements();
}

const animateElements = () => {
    const width = 1024,
        height = 768;
    animation.animate({
        timing: 'easeInOut',
        duration: 1000,
        loop: true,
        update: progress => {
            for (let index = 0; index < items.length; index++) {
                const element = items[index];
                const { scaleTo, rotateTo, x, y } = element.dataset;
                element.style.transform = transform(x, (y), progress * rotateTo, 1 + (progress * scaleTo));
                element.style.opacity = 1 - 1 * progress;
            }
        },
        start: () => [...items].forEach(element => {
            element.dataset.rotateTo = random(0, 45);
            element.dataset.scaleTo = random(0, 1);
            element.dataset.x = random(0, width);
            element.dataset.y = random(0, height);
            element.style.transform = transform(element.dataset.x, element.dataset.y, random(0, 45), random(0.2, 1))
        })
    });

    return {
        start: () => animation.resume(),
        stop: () => animation.stop(),
        kill: () => animation.stop(),
        stopFew: amount => animation.stopFew(amount)
    }
}

const animateElementsNative = () => {
    const animations = [];
    [...items].forEach((element, index) => {
        const { innerWidth, innerHeight } = window;

        const go = () => animations[index] = animate(random(0, innerWidth), random(0, innerHeight), random(0, 45), random(1, 3));

        function animate(x, y, rotateTo, scaleTo) {
            const player = element.animate([
                {
                    transform: transform(x, y, random(0, 45), random(0.2, 1)),
                    opacity: 1
                },
                {
                    transform: transform(x, y, rotateTo, scaleTo),
                    opacity: 0
                }
            ], {
                duration: 1000,
                delay: random(500, 1000)
            })

            player.onfinish = go;

            return player;
        };

        go();
    });
    return {
        start: () => animations.forEach(a => a.play()),
        stop: () => animations.forEach(a => a.pause()),
        kill: () => animations.forEach(a => a.cancel()),
        stopFew: amount => Array(amount).fill(1).forEach(() => {
            const animation = animations.pop();
            animation && animation.cancel();
        })
    }
}

const animateElementsWithTweenMax = () => {
    const animations = [];
    [...items].forEach((element, index) => {
        const go = () => animations[index] = animate(random(0, innerWidth), random(0, innerHeight), random(0, 45), random(1, 3));
        function animate(x, y, rotateTo, scaleTo) {
            element.style.transform = transform(x, y, 0, 1);
            element.style.opacity = 1;
            const ev = TweenMax.to(element, 1, {
                rotate: rotateTo,
                scale: scaleTo,
                opacity: 0
            })
            ev.eventCallback('onComplete', go);
            return ev;
        };

        go();
    });


    return {
        start: () => animations.forEach(a => a.resume()),
        stop: () => animations.forEach(a => a.pause()),
        kill: () => animations.forEach(a => a.kill()),
        stopFew: amount => Array(amount).fill(1).forEach(() => animations.pop().kill())
    }
}

const animateElementsWithVelocity = elements => elements.forEach((element, index) => {
    const animations = [];
    const go = () => animate(random(0, innerWidth), random(0, innerHeight), random(0, 45), random(1, 3));
    function animate(x, y, rotateTo, scaleTo) {
        element.style.transform = transform(x, y, 0, 1);
        animations[index] = Velocity(element, {
            translateX: x,
            translateY: y,
            scale: scaleTo,
            rotate: rotateTo,
            opacity: 0
        }, {
            // complete: go,
        });
    };

    go();
})

const animateElementsWithAnime = () => {
    const animations = [];
    const width = 1024,
        height = 768;
    [...items].forEach((element, index) => {
        animations[index] = anime.timeline({
            targets: element,
            delay: () => random(0, 1000),
            duration: 1000,
            easing: 'easeOutExpo', // Can be inherited
            loop: true // Is not inherited,
        }).add({
            translateX: () => { const r = random(0, width); return r; },
            translateY: () => { const r = random(0, height); return r; },
            scale: () => [random(0.2, 1), random(1, 3)],
            rotate: () => random(0, 45),
            opacity: [1, 0],
            // begin: () => console.log('Begin'),
            // complete: () => console.log('Complete'),
        })
    });

    return {
        start: () => animations.forEach(a => a.play()),
        stop: () => animations.forEach(a => a.pause()),
        kill: () => animations.forEach(a => anime.remove(a.target)),
        stopFew: amount => Array(amount).fill(1).forEach(() => animations.pop().pause())
    }

}

const animationTypes = {
    own: animateElements,
    webAnimations: animateElementsNative,
    gsap: animateElementsWithTweenMax,
    anime: animateElementsWithAnime,
    velocity: animateElementsWithVelocity
}

window.ps4 = {
    started: false,
    type: '',
    animation: {
        stop: () => { },
        stopFew: () => { },
        kill: () => { },
    },
    add: function () {
        this.animation.stop();
        add(addAmount);
        if (this.started) this.start(this.type);
        if (items.length > 0) {
            document.querySelector('.add').removeAttribute('disabled');
        }
    },
    resume: function () {
        this.started = true;
        this.animation.resume && this.animation.resume();
    },
    start: function (type) {
        this.animation.stop();
        if (!type || type === this.type) {
            this.animation.start();
        } else {
            this.animation.kill();
            this.type = type;
            this.started = true;
            this.animation = animationTypes[type]();
            document.querySelector('.start').removeAttribute('disabled');
        }
    },
    stop: function () {
        this.started = false;
        this.animation.stop();
    },
    remove: function () {
        this.animation.stopFew(addAmount);
        remove(addAmount);
        if (this.started) this.start(this.type);
        if (items.length === 0) {
            document.querySelector('.add').setAttribute('disabled', true);
        }
    }
}

export default window.ps4;