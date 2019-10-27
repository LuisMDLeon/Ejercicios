const LEFT_DIR = 39;
const RIGHT_DIR = 37;

class AsteroidsGameREDUX {
    constructor(x_range, y_range) {
        this.INIT_N_ASTEROIDS = 6;
        this.CREATOR = new AsteroidsCreator();
        this.x_range = x_range;
        this.y_range = y_range;
        this.radius = 100;

        this.cx = (this.x_range[1] - this.x_range[0]) / 2 + this.x_range[0];
        this.cy = (this.y_range[1] - this.y_range[0]) / 2 + this.y_range[0];

        this.asteroids = this.CREATOR.generateList(this.INIT_N_ASTEROIDS, BIG_ASTEROID, this.cx, this.cy, this.radius);
        this.player = new Player(this.cx, this.cy);
        this.bullets = [];

        this.score = 0;

        this.limbo_time = 300;
        this.limbo = 0;
        this.ex_time = 30;
        this.ex_in_time = 0;
        this.explosion = false;

        this.animate = true;
    }

    rotatePlayer(direction) {
        if (!this.player.alive) return;
        if (direction == RIGHT_DIR || direction == LEFT_DIR)
            this.player.rotate2(direction);
    }

    throttlePlayer() {
        if (!this.player.alive) return;
        this.player.speedUp();
    }

    shotBullet() {
        if (!this.player.alive) return;
        shot.play();
        this.bullets.push(this.player.shot());
    }

    // Verificar colisión BALA-ASTEROIDE
    checkCollider() {
        let new_asteroids = [];
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            let destroy = false;
            for (let j = this.bullets.length - 1; j >= 0; j--) {
                const bullet = this.bullets[j];
                // Check by radius (distance)
                //const dist = distance(asteroid.center.array(), bullet.arrayDirection());
                if (collidePointPolygon(bullet.arrayDirection(), asteroid.vertices)) {
                    destroy = true;
                    this.score += asteroid.type.mana;

                    explosion.play();

                    this.asteroids.splice(i, 1);
                    this.bullets.splice(j, 1);
                    if (asteroid.type != TINY_ASTEROID)
                        new_asteroids = new_asteroids.concat(this.destroyAsteroid(asteroid));
                    break;
                }
            }


            if (this.limbo > 0 && this.limbo <= this.limbo_time) {
                this.limbo += 1;
                break;
            } else {
                this.limbo = 0;
            }

            if (!destroy && this.player.alive) {
                const dist = distance(this.player.position.array(), asteroid.center.array());
                this.player.alive = !(dist < (this.player.radius / 2) + (asteroid.radius * 0.7));
                this.explosion = true;
                //console.log("Juego terminado");
                if (!this.player.alive) {
                    p_explosion.play();
                    return;
                }
            }
        }
        this.asteroids = this.asteroids.concat(new_asteroids);
    }

    destroyAsteroid(asteroid) {
        if (asteroid.type == TINY_ASTEROID) return [];
        else {
            const position = asteroid.center;
            if (asteroid.type == BIG_ASTEROID) {
                return this.CREATOR.generateList(2, MEDIUM_ASTEROID, position.x, position.y, 5);
            } else if (asteroid.type == MEDIUM_ASTEROID) {
                return this.CREATOR.generateList(3, TINY_ASTEROID, position.x, position.y, 2);
            }
        }
    }

    showScore() {
        const textP = "SCORE : [" + this.score + "]";
        const textL = " x " + this.player.lives;

        textSize(18);

        const margin = 20;
        const xt = this.x_range[0] + margin;
        const yt = this.y_range[0] + margin * 2;

        text(textP, xt, yt);

        const w = textWidth(textL);
        const xl = this.x_range[1] - w - 20;

        text(textL, xl, yt);
        image(live_img, xl - 10, yt - 8, 25, 25);
    }

    showGO() {
        if (!this.animate) {
            const textG = "GAME OVER";

            textSize(60);
            const wg = textWidth(textG);

            text(textG, (W - wg) / 2, (H / 2) - 30);
        }
    }

    render() {
        if (!this.animate) return;
        background(0);
        stroke(255);
        strokeWeight(1);

        fill(255);
        this.showScore();
        noFill();

        for (let i = 0; i < this.asteroids.length; i++) {
            const asteroid = this.asteroids[i];
            asteroid.render();
            asteroid.update();
            asteroid.bounds(this.x_range, this.y_range);
        }

        strokeWeight(2);
        stroke(240, 0, 80);

        if (!this.player.alive) {
            if (this.explosion) {
                image(p_explosion_img, this.player.position.x, this.player.position.y, this.player.radius * 4, this.player.radius * 4);
                this.ex_in_time += 1;
                if (this.ex_in_time == this.ex_time) {
                    this.ex_in_time = 0;
                    this.explosion = false;
                }
            } else {
                if (!this.player.reborn()) {
                    // GAME OVER
                    console.log("GAME OVER", this.player);
                    this.animate = false;
                    this.showGO();
                    return;
                } else {
                    this.limbo += 1;
                }
            }
        } else {
            this.player.render();
            this.player.update();
            this.player.bounds(this.x_range, this.y_range);
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].bounds()) {
                this.bullets.splice(i, 1);
                break;
            }
            this.bullets[i].render();
            this.bullets[i].update();
        }

        this.checkCollider();
    };
}

// Colisión de polígono con punto, tomada de p5.collide2d
function collidePointPolygon(point, vertices) {
    let collision = false;

    // go through each of the vertices, plus the next vertex in the list
    let next = 0;
    for (let current = 0; current < vertices.length; current++) {

        // get next vertex in list if we've hit the end, wrap around to 0
        next = current + 1;
        if (next == vertices.length) next = 0;

        // get the PVectors at our current position this makes our if statement a little cleaner
        const vc = vertices[current]; // c for "current"
        const vn = vertices[next]; // n for "next"

        // compare position, flip 'collision' variable back and forth
        if (((vc[1] > point[1] && vn[1] < point[1]) || (vc[1] < point[1] && vn[1] > point[1])) &&
            (point[0] < (vn[0] - vc[0]) * (point[1] - vc[1]) / (vn[1] - vc[1]) + vc[0])) {
            collision = !collision;
        }
    }
    return collision;
}