export const random = (min, max) => Math.random() * (max - min) + min;
export const randomRounded = (min, max) => Math.round(random(min, max));