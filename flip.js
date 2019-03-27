function run() {
    // Get the first position.
    var first = el.getBoundingClientRect();

    // Now set the element to the last position.
    el.classList.add('totes-at-the-end');

    // Read again. This forces a sync
    // layout, so be careful.
    var last = el.getBoundingClientRect();

    // You can do this for other computed
    // styles as well, if needed. Just be
    // sure to stick to compositor-only
    // props like transform and opacity
    // where possible.
    var invert = first.top - last.top;

    // Invert.
    el.style.transform =
        `translateY(${invert}px)`;

    // Wait for the next frame so we
    // know all the style changes have
    // taken hold.
    requestAnimationFrame(function () {

        // Switch on animations.
        el.classList.add('animate-on-transforms');

        // GO GO GOOOOOO!
        el.style.transform = '';
    });

    // Capture the end with transitionend
    el.addEventListener('transitionend',
        tidyUpAnimations);
}

btn.addEventListener('click', run);

function tidyUpAnimations() {

}