const W = 700;
const H = 600;
const x_range = [50, W - 50];
const y_range = [50, H - 50];

const game = new AsteroidsGameREDUX(x_range, y_range);

function setup() {
    const canvas = createCanvas(W, H);
    canvas.parent('sketch');
}

function draw() {
    game.render();

    // noFill();
    // stroke(255, 0, 0);
    // circle(W / 2, H / 2, 200);
    // rectMode(CORNERS);
    // rect(51, 51, W - 51, H - 51);
    //noLoop();

    if (keyIsDown(UP_ARROW)) {
        game.throttlePlayer();
    }

    if (keyIsDown(RIGHT_ARROW)) {
        game.rotatePlayer(RIGHT_DIR);
    }
    if (keyIsDown(LEFT_ARROW)) {
        game.rotatePlayer(LEFT_DIR);
    }
}

function keyPressed() {
    if (keyCode == 32) {
        game.shotBullet();
    }
}