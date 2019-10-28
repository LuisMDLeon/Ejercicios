const limit = 10000;
const angle = 0.14;
const length = 10;

const c_point = new Point(270, 850);

let i = 2;
let max = 0;

function setup() {
    createCanvas(800, 900);
    colorMode(HSB, 1, 1, 1, 1);
    background(0);
}

function draw() {
    for (let j = 0; j < 3 && i < limit; j++) {
        renderList(collatzList(++i));
        if (i == limit) noLoop();
    }
}

function collatzNumber(number) {
    if (number % 2 == 0) {
        return number / 2;
    } else {
        return (number * 3 + 1) / 2;
    }
}

function collatzList(number) {
    let list = [number];
    let index = 1;

    do {
        number = collatzNumber(number);
        list[index] = number;
        index += 1;
    } while (number != 1);

    return list;
}

function renderList(list) {
    let r_angle = -PI;
    let last_p = new Point(c_point.x, c_point.y);
    let l = length;

    let dis = 0.055;
    let j = 1;

    if (list.length > max) max = list.length;

    for (let i = list.length - 1; i >= 0; i--) {
        const n = list[i];
        r_angle += (n % 2 == 0) ? 0.27 - (0.0002 * j) : -0.19 + (0.00025 * j);
        l -= dis;

        const x = l * Math.cos(r_angle) + last_p.x;
        const y = l * Math.sin(r_angle) + last_p.y;

        const s = j / list.length;
        stroke(s, 1, 1, 0.1);
        strokeWeight((i / list.length) * 10);
        line(last_p.x, last_p.y, x, y);

        last_p.x = x;
        last_p.y = y;
        j += 1;
    }
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}