const W = 700;
const H = 600;
const x_range = [0, W];
const y_range = [0, H];

let shot = null;
let explosion = null;
let c_font = null;
let p_explosion = null;
let p_explosion_img = null;
let live_img = null;

let game = new AsteroidsGameREDUX(x_range, y_range);

function preload() {
    shot = loadSound('/res/laser-shot.wav');
    explosion = loadSound('/res/explosion.wav');
    p_explosion = loadSound('/res/player-explosion.wav');

    c_font = loadFont('/res/PixelOperator8.ttf');

    p_explosion_img = loadImage('/res/player-explosion-2.png');
    live_img = loadImage('/res/live.png');
}

function setup() {
    const canvas = createCanvas(W, H);
    canvas.parent('sketch');
    imageMode(CENTER);

    shot.setVolume(0.5);
    explosion.setVolume(0.3);
    p_explosion.setVolume(0.3);

    textFont(c_font);
}

function draw() {
    game.render();

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

    if (!game.playing && (key == 'r' || key == 'R')) {
        game = new AsteroidsGameREDUX(x_range, y_range);
    }
}