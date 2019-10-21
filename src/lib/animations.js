import { isUndefined } from 'util';

export const posX = r => a => r * Math.sin(a * Math.PI / 180) + r;
export const posY = r => a => r * -Math.cos(a * Math.PI / 180) + r;
export const timeAngle = T => t => 2 * Math.PI * t / T;

export const ease = t => 1 - Math.sin(Math.acos(t));
export const easeTimeFraction = t => 1 + Math.cos(Math.asin(t));
export const easeInOut = t => .5 * (Math.sin((t - .5) * Math.PI) + 1);
export const easeInOutTimeFraction = p => (Math.asin(p / .5 - 1) + .5 * Math.PI) / Math.PI;

export const transform = (x, y, rotation, scale) => `translateX(${x}px) translateY(${y}px) rotate(${rotation}deg) scale(${scale})`;

export const timingFunctions = {
    ease,
    easeInOut,
    easeTimeFraction,
    easeInOutTimeFraction
}

const animate = (options = {}) => {
    const {
        timing = 'easeInOut',
        startingProgress = 0,
        duration = 500,
        delay = 0,
        start = () => { },
        update = () => { },
        resume = () => { },
        finish = () => { },
        frameUpdate = () => { },
        loop = false
    } = options;

    let frame;
    const startTime = performance.now();
    const additionalTimeFraction = timingFunctions[`${timing}TimeFraction`](startingProgress);
    const timingFunction = timingFunctions[timing];
    startingProgress === 0 ? start(startTime) : resume();
    const fnc = () => frameUpdate(requestAnimationFrame(function _fnc(t) {
        let timeFraction = (t - (startTime)) / duration + additionalTimeFraction;
        if (timeFraction > 1) timeFraction = 1;

        const progress = timingFunction(timeFraction);

        update(progress, frame);

        const loopRun = () => {
            frameUpdate(animate(Object.assign(
                options,
                {
                    startingProgress: 0,
                    withStart: false
                }
            )));
        }

        if (timeFraction < 1) {
            frameUpdate(requestAnimationFrame(_fnc), progress);
        } else if (loop) {
            loopRun();
        } else {
            finish(t);
        }
    }));

    return autoplay ? fnc() : ;
}

export const animation = {
    frames: [],
    animate: function (opts) {
        this.stop();
        const animationIndex = !isUndefined(opts.index) ? opts.index : this.frames.length;
        animate({
            ...opts,
            start: startTime => {
                animation.frames[animationIndex] = { progress: 0, opts };
                opts.start && opts.start(startTime);
            },
            frameUpdate: (frame, progress) => {
                animation.frames[animationIndex].progress = progress;
                animation.frames[animationIndex].frame = frame;
                opts.frameUpdate && opts.frameUpdate(frame);
                return frame;
            },
            update: (progress, frame) => {
                opts.update && opts.update(progress, frame);
            }
        });
        return animationIndex;
    },
    stop: function (index) {
        if (index) {
            const frame = this.frames[index];
            frame && cancelAnimationFrame(this.frames[index].frame);
        } else {
            Array(this.frames.length).fill(1).forEach((f, i) => {
                cancelAnimationFrame(this.frames[i].frame);
            })
        }
    },
    kill: function () {
        Array(this.frames.length).fill(1).forEach(() => {
            cancelAnimationFrame(this.frames.pop().frame);
        })
    },
    resume: function (index) {
        if (index) {
            const { frame, opts, progress: startingProgress } = this.frames[index];
            frame && animation.animate(Object.assign(opts, {
                startingProgress,
            }));
        } else {
            Array(this.frames.length).fill(1).forEach((f, i) => {
                const { opts, progress: startingProgress } = animation.frames[i];
                animation.animate(Object.assign(opts, {
                    startingProgress,
                    index: i
                }));
            })
        }
    },
    stopFew: function (count) {
        Array(count).fill(1).forEach((f, i) => {
            cancelAnimationFrame(this.frames.pop());
        })
    }
}