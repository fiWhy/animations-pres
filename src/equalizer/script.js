const equalizer = document.querySelector('.equalizer'),
    dotsWrapper = document.querySelector('.dots'),
    button = document.querySelector('button'),
    dotsList = dotsWrapper.getElementsByClassName('dot');

const width = window.innerWidth,
    height = window.innerHeight;


const dotsCount = 100,
    distance = width / dotsCount,
    size = distance / 3,
    margin = distance - size;



dotsWrapper.style.setProperty('--dots-count', dotsCount);
dotsWrapper.style.setProperty('--dots-margin', `${margin}px`);
dotsWrapper.style.setProperty('--dots-size', `${size}px`);



for (let index = 0; index < dotsCount; index++) {
    const el = document.createElement('div');
    el.classList.add('dot');
    el.style.animationDelay = `${index % 4 * .5}s`;
    el.classList.add('animated');
    el.style.setProperty('--move-distance', Math.round(Math.random() * (400 - 100) + 100) + 'px')

    if (index === 0) {
        el.style.marginLeft = (margin / 2) + 'px';
    }

    dotsWrapper.appendChild(el);
}

button.addEventListener('click', () => {
    Array.prototype.forEach.call(dotsList, el => {
        el.classList.toggle('performed-animation');

        button.innerText = el.classList.contains('performed-animation') ? 'Unoptimize!' : 'Optimize!';
    })
})