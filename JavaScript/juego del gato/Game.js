class Casilla {
    constructor(x1, y1, x2, y2, type = 0) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;

        this.type = type;
        this.inCombo = false;

        //calcular centro con margen de 10%
        this.largo = x2 - x1;
        this.margen = this.largo * 0.25;
        this.centro = {
            x: x1 + (this.largo / 2),
            y: y1 + (this.largo / 2)
        };

        this.colorCombo = [255, 255];
        this.typeColours = [
            [0, 0, 255],
            [255, 0, 0]
        ];
    }

    show() {
        if (this.type != 0) {
            strokeWeight(6);
            let colour = this.typeColours[this.type - 1];
            if (this.inCombo) colour = this.colorCombo;

            stroke(...colour);

            if (this.type == 1) {
                line(this.x1 + this.margen, this.y1 + this.margen, this.x2 - this.margen, this.y2 - this.margen);
                line(this.x2 - this.margen, this.y1 + this.margen, this.x1 + this.margen, this.y2 - this.margen);
            } else if (this.type == 2) {
                noFill();
                ellipse(this.centro.x, this.centro.y, this.largo / 2, this.largo / 2);
            }
        }
    }
}

class Tablero {
    constructor(size = 100) {
        this.margen = size * 0.1;
        this.size = size * 0.8;
        this.casillaSize = this.size / 3;
        this.casillas = [];
        this.state = [];
        this.moves = 9;
        this.combo = null;

        let iy = 0;
        for (let i = 0; i < 9; i++) {
            if (i % 3 == 0 && i != 0) iy++;
            const x1 = this.margen + this.casillaSize * (i % 3);
            const y1 = this.margen + this.casillaSize * iy;
            const x2 = this.margen + this.casillaSize * (i % 3) + this.casillaSize;
            const y2 = this.margen + this.casillaSize * iy + this.casillaSize;

            this.casillas.push(new Casilla(x1, y1, x2, y2, 0));
            this.state.push(0);
        }
    }

    click(mX, mY) {
        if (mX >= this.margen && mX <= this.size + this.margen && mY >= this.margen && mY <= this.size + this.margen) {
            let column = (mX - this.margen) / (this.size / 3);
            column = parseInt(column); // + (column % 1 == 0) ? 0 : 1;
            let row = (mY - this.margen) / (this.size / 3);;
            row = parseInt(row); // + (row % 1 == 0) ? 0 : 1;

            const position = row * 3 + column;
            console.log(position);
            return position;
        } else {
            return -1;
        }
    }

    movimiento(idPlayer, position) {
        if (this.state[position] == 0) {
            this.state[position] = idPlayer;
            this.casillas[position].type = idPlayer;
            this.moves -= 1;
            return true;
        } else {
            return false;
        }
    }

    show() {
        stroke(255);
        strokeWeight(5);
        for (let i = 1; i <= 2; i++) {
            const x1 = this.margen;
            const y1 = this.margen + this.casillaSize * i;
            const x2 = this.margen + this.casillaSize * i;
            const y2 = this.margen;
            line(x1, y1, x1 + this.size, y1);
            line(x2, y2, x2, y2 + this.size);
        }

        for (let i = 0; i < this.casillas.length; i++) {
            this.casillas[i].show();
        }

        this.renderCombo();
    }

    renderCombo() {
        if (this.combo) {
            let x1 = this.casillas[this.combo[0]].centro.x;
            let y1 = this.casillas[this.combo[0]].centro.y;

            let x2 = this.casillas[this.combo[2]].centro.x;
            let y2 = this.casillas[this.combo[2]].centro.y;

            stroke(255, 255, 0);
            strokeWeight(6);
            line(x1, y1, x2, y2);
        }
    }
}

class Game {
    constructor(size, p1Name = "ElTijeras", p2Name = "Jugador2") {
        this.player1 = {
            id: 1,
            name: p1Name
        };
        this.player2 = {
            id: 2,
            name: p2Name
        };
        this.combos = [
            [0, 4, 8],
            [2, 4, 6],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8]
        ];

        this.size = size;
        this.turno = (Math.random(1) < 0.5) ? this.player1 : this.player2;
        this.tablero = new Tablero(size);
        this.finished = false;
    }

    click(x_pos, y_pos) {
        if (this.finished) return false;
        let casilla = this.tablero.click(x_pos, y_pos);
        if (casilla != -1 && this.tablero.movimiento(this.turno.id, casilla)) {
            this.applyRules();
            return true;
        }
    }

    applyRules() {
        const combo = this.verificarCombo(this.turno.id);
        if (combo) {
            this.finished = true;
            this.tablero.combo = combo;
        } else if (this.tablero.moves == 0) {
            this.finished = true;
            this.turno = null;
        } else {
            if (this.turno.id == this.player1.id) this.turno = this.player2;
            else if (this.turno.id == this.player2.id) this.turno = this.player1;
        }
    }

    verificarCombo(player, estado = this.tablero.state) {
        let combos = this.combos;
        for (let i = 0; i < combos.length; i++) {
            if (estado[combos[i][0]] == estado[combos[i][1]] && estado[combos[i][1]] == estado[combos[i][2]] && estado[combos[i][2]] == player) {
                return combos[i];
            }
        }
        return false;
    }

    resetGame() {
        this.tablero = new Tablero(this.size);
        this.turno = (Math.random(1) < 0.5) ? this.player1 : this.player2;
        this.finished = false;
    }

    showTablero() {
        this.tablero.show();

        let turn = "";
        if (this.turno == null) {
            turn = "EMPATE!";
        } else if (this.finished) {
            turn = `GANADOR :  ${this.turno.name}!!`;
        } else {
            turn = `Turno: ${this.turno.name} (P${this.turno.id})`;
        }

        const p1t = `[P1] ${this.player1.name}`;
        const p2t = `[P2] ${this.player2.name}`;

        noStroke();

        textSize(20);
        const p1tl = textWidth(p1t);
        const p2tl = this.size - textWidth(p2t) - 25;

        fill(0, 0, 255);
        textStyle(BOLD);
        text("X", 0, 25);
        textStyle(NORMAL);
        fill(255);
        text(p1t, 20, 25);
        fill(255);
        text(p2t, p2tl, 25);
        fill(255, 0, 0);
        textStyle(BOLD);
        text("O", p2tl + textWidth(p2t), 25);
        textStyle(NORMAL);

        fill(255, 255, 0);
        textSize(15);
        text(turn, 0, this.size - 20);
    }
}