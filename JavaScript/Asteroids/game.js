function AsteroidsGameREDUX(x_range, y_range) {
    this.INIT_N_ASTEROIDS = 12;
    this.X_RANGE = x_range;
    this.Y_RANGE = y_range;
    this.RADIUS = 100;

    this.CREATOR = new AsteroidsCreator();

    this.init = () => {
        const cx = (this.X_RANGE[1] - this.X_RANGE[0]) / 2 + this.X_RANGE[0];
        const cy = (this.Y_RANGE[1] - this.Y_RANGE[0]) / 2 + this.Y_RANGE[0];
        this.ASTEROIDS = this.CREATOR.generateList(this.INIT_N_ASTEROIDS, BIG_ASTEROID, cx, cy, this.RADIUS);
    }

    this.render = () => {
        for (let i = 0; i < this.ASTEROIDS.length; i++) {
            const asteroid = this.ASTEROIDS[i];
            asteroid.render();
            asteroid.update();
            asteroid.bounds(this.X_RANGE, this.Y_RANGE);
        }
    }
}