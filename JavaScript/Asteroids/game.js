const LEFT_DIR = 39;
const RIGHT_DIR = 37;

class AsteroidsGameREDUX {
    constructor(x_range, y_range) {
        this.INIT_N_ASTEROIDS = 7;
        this.CREATOR = new AsteroidsCreator();
        this.x_range = x_range;
        this.y_range = y_range;
        this.radius = 100;

        this.cx = (this.x_range[1] - this.x_range[0]) / 2 + this.x_range[0];
        this.cy = (this.y_range[1] - this.y_range[0]) / 2 + this.y_range[0];

        this.asteroids = this.CREATOR.generateList(this.INIT_N_ASTEROIDS, BIG_ASTEROID, this.cx, this.cy, this.radius);
        this.player = new Player(this.cx, this.cy);
        this.bullets = [];

        this.playing = true;

        this.score = 0;
    }

    rotatePlayer(direction) {
        if (direction == RIGHT_DIR || direction == LEFT_DIR)
            this.player.rotate2(direction);
    }

    throttlePlayer() {
        this.player.speedUp();
    }

    shotBullet() {
        shot.play();
        this.bullets.push(this.player.shot());
    }

    checkCollider() {
        let new_asteroids = [];
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            let destroy = false;
            for (let j = this.bullets.length - 1; j >= 0; j--) {
                const bullet = this.bullets[j];
                // Check by radius (distance)
                const dist = distance(asteroid.center.array(), bullet.arrayDirection());
                if (dist < asteroid.radius) {
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

            if (!destroy) {
                const dist = distance(this.player.position.array(), asteroid.center.array());
                this.playing = !(dist < (this.player.radius / 2) + (asteroid.radius * 0.7));
                //console.log("Juego terminado");
                if (!this.playing) {
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
        const textP = "PUNTUACION : [" + this.score + "]";
        textSize(18);
        const margin = 20;
        const xt = this.x_range[0] + margin;
        const yt = this.y_range[0] + margin * 2;

        text(textP, xt, yt);
    }

    render() {
        if (!this.playing) return;

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

        this.player.render();
        this.player.update();
        this.player.bounds(this.x_range, this.y_range);

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