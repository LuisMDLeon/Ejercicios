const W = 700;
const H = 600;
const N = 4;

const asteroidsCreator = new AsteroidsCreator();
let asteroids = [];

function setup() {
    const canvas = createCanvas(W, H);
    canvas.parent('sketch');
    //frameRate(30);
    asteroids = asteroidsCreator.generateList(N, TINY_ASTEROID, W / 2, H / 2, 100);
}

function draw() {
    background(0);
    stroke(255);
    noFill();

    for (let j = 0; j < asteroids.length; j++) {
        const a = asteroids[j];
        a.render();
        a.update();
        a.bounds([0, W], [0, H]);
    }

    stroke(255, 0, 0);
    circle(W / 2, H / 2, 200);
    rectMode(CORNERS);
    rect(1, 0, W - 1, H - 1);
    //noLoop();
}