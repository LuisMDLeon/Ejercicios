const W = 500;
const H = 500;

let game = new Game(W, "Luis", "Hal9K", true);

function setup() {
    const canvas = createCanvas(W, H);
    canvas.parent('sketch');
    render();
}

function draw() {
    let c = false;
    if (mouseIsPressed && mouseButton == LEFT) {
        c = game.playGame(mouseX, mouseY);
    } else {
        c = game.playGame();
    }

    if (c) render();
}

function keyPressed() {
    if (key == 'r' || key == 'R') {
        game.resetGame();
        render();
    } else if (key == 'i' || key == 'I') {
        game.resetGame(true);
        render();
    }
}

function render() {
    background(0);
    game.showTablero();
}