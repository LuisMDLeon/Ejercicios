const W = 500;
const H = 500;

let game = new Game(W);

function setup() {
    const canvas = createCanvas(W, H);
    canvas.parent('sketch');
}

function draw() {
    background(0);
    game.showTablero();
    noLoop();
}

function mousePressed() {
    if (game.click(mouseX, mouseY)) render();
}

function keyPressed() {
    if (key == 'r' || key == 'R') {
        game.resetGame();
        render();
    }
}

function render() {
    background(0);
    game.showTablero();
}