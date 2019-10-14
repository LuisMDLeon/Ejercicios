const W = 700;
const H = 600;
const x_range = [50, W - 50];
const y_range = [50, H - 50];

const game = new AsteroidsGameREDUX(x_range, y_range);

function setup() {
    const canvas = createCanvas(W, H);
    canvas.parent('sketch');
    game.init();
}

function draw() {
    background(0);
    stroke(255);
    noFill();

    game.render();

    stroke(255, 0, 0);
    circle(W / 2, H / 2, 200);
    rectMode(CORNERS);
    rect(51, 51, W - 51, H - 51);
    //noLoop();
}

function keyPressed() {
    if (key == 'p') {
        noLoop();
    }
}