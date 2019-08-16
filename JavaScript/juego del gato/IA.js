class IA {
    constructor(id, name, id_oponente, game) {
        this.id = id;
        this.name = name;
        this.oponente = id_oponente;
        this.game = game;
    }

    play(state) {
        const move = this.minimax({
            state,
            i: -1
        }, this.id, 0);
        console.log("IA tira", move.i);
        return move.i;
    }

    minimax(move, turn, depth) {
        const state = move.state;
        const winner = this.game.getStatus(state);

        // Evaluación del estado actual
        if (winner == this.id) return {
            eval: 100,
            i: move.i
        }; // Gana
        else if (winner == this.oponente) return {
            eval: -100,
            i: move.i
        }; // Pierde
        else if (winner == 0) return {
            eval: 0,
            i: move.i
        }; // Empate

        // Generar los sub-estados desde el estado actual
        const moves = this.gen_moves(state, turn);

        let evals = [];
        const nw_turn = (turn == this.id) ? this.oponente : this.id; //cambio de turno

        // Evaluar los sub-estados generados. evaluacion = {eval, indice(tiro-posicion)}
        for (let i = 0; i < moves.length; i++) {
            evals[i] = {
                eval: this.minimax(moves[i], nw_turn, depth + 1).eval,
                i: moves[i].i
            }
        }
        // Retorna el movimiento con la evavluación más alta o más baja
        // dependiendo del turno, favoreciendo a la IA para maximizar
        return (turn == this.id) ? this.max(evals) : this.min(evals);;
    }

    // Filtra un conjunto de evaluaciones, retornando la jugado con menor valor
    min(evals) {
        let min = Infinity;
        let move = null;
        let c_prob = 1 / evals.length;

        for (let i = 0; i < evals.length; i++) {
            if (evals[i].eval < min) {
                min = evals[i].eval;
                move = evals[i];
            } else if (evals[i].eval == min && Math.random() < c_prob) {
                move = evals[i];
            }
        }
        return move;
    }

    // Filtra un conjunto de evaluaciones, retornando la jugado con mayor valor
    max(evals) {
        let max = -Infinity;
        let move = null;
        let c_prob = 1 / evals.length;

        for (let i = 0; i < evals.length; i++) {
            if (evals[i].eval > max) {
                max = evals[i].eval;
                move = evals[i];
            } else if (evals[i].eval == max && Math.random() < c_prob) {
                move = evals[i];
            }
        }
        return move;
    }

    // Genera lista de sub-estados posibles desde un estado
    // añadiendo el 'tiro' del jugador en turno
    gen_moves(state, turn) {
        let moves = [];
        for (let i = 0; i < 9; i++) {
            if (state[i] == 0) {
                let move = this.copyState(state);
                move[i] = turn;
                moves.push({
                    state: move,
                    i
                });
            }
        }
        return moves;
    }

    // Genera una copia de un estado
    copyState(state) {
        let copy = [];
        for (let i = 0; i < state.length; i++) {
            copy[i] = state[i];
        }
        return copy;
    }
}