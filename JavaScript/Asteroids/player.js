class Player {
    constructor(x_spaw, y_spaw) {
        this.ANGLE_L = 2.356194490192345;
        this.ANGLE_R = 0.10471975511965978;

        this.position = new Vector2D(x_spaw, y_spaw);
        this.x_spaw = x_spaw;
        this.y_spaw = y_spaw;
        this.radius = 8;

        this.drag = 0.991;
        this.aceleration = new Vector2D();
        this.velocity = new Vector2D();
        this.rotation_vel = 1;
        this.speedUpForce = 0.15;
        this.max_vel = 3;

        this.shot_force = 0.15;

        // Cálculo de la cabecera
        this.head = new Vector2D(this.position.x, this.position.y - this.radius);

        // Desplazamiento con longitud r a  45 grados
        const angle = Math.PI / 4;
        const dx = this.radius * Math.cos(angle);
        const dy = this.radius * Math.sin(angle);

        // Calculo de puntos adyacentes (alerones)
        this.l1 = new Vector2D(dx + this.position.x, dy + this.position.y);
        this.l2 = new Vector2D(this.position.x - dx, dy + this.position.y);

        // Estados
        this.alive = true;
        this.lives = 1;
    }

    reborn() {
        if (!this.alive && (this.lives > 0)) {
            this.lives -= 1;
            this.position = new Vector2D(this.x_spaw, this.y_spaw);
            this.aceleration = new Vector2D();
            this.velocity = new Vector2D();

            // Cálculo de la cabecera
            this.head = new Vector2D(this.position.x, this.position.y - this.radius);

            // Desplazamiento con longitud r a  45 grados
            const angle = Math.PI / 4;
            const dx = this.radius * Math.cos(angle);
            const dy = this.radius * Math.sin(angle);

            // Calculo de puntos adyacentes (alerones)
            this.l1 = new Vector2D(dx + this.position.x, dy + this.position.y);
            this.l2 = new Vector2D(this.position.x - dx, dy + this.position.y);

            this.alive = true;
            return true;
        } else {
            return false;
        }
    }

    speedUp() {
        let h = this.head.copy();
        h.substract(this.position.x, this.position.y);
        let force = SVectorFromPolarC(h.heading(), this.speedUpForce);
        this.aceleration.add(force.x, force.y);
    }

    update() {
        this.velocity.add(this.aceleration.x, this.aceleration.y);
        this.velocity.limit(this.max_vel);
        this.position.add(this.velocity.x, this.velocity.y);
        this.head.add(this.velocity.x, this.velocity.y);
        this.l1.add(this.velocity.x, this.velocity.y);
        this.l2.add(this.velocity.x, this.velocity.y);
        this.aceleration.multiply(0);

        // Desaceleración por fricción
        this.velocity.multiply(this.drag);

        if (this.velocity.magnitude() < 0.08) this.velocity.multiply(0);
    }

    // Rotación en base a un punto objetivo limitado a una velocidad de giro máxima
    rotate(objetive) {
        // Trasladar el objetivo de giro y la cabecera al punto central del jugador
        const center = this.position;
        objetive.substract(center.x, center.y);
        this.head.substract(center.x, center.y);

        // Obtener la nueva dirección de giro y limitarla a la velicidad de giro máxima
        objetive.substract(this.head.x, this.head.y);
        objetive.limit(this.rotation_vel);

        // Sumar a la cabecera la dirección para obtener la nueva orientación
        this.head.add(objetive.x, objetive.y);
        this.head.setMagnitude(this.radius);

        // Genarar los puntos l1 y l2 en base a la rotación de la cabecera
        this.l1 = this.head.copy();
        this.l2 = this.head.copy();
        // Rotación de  (+-) 135° para l1 y l2
        this.l1.rotate(2.356194490192345);
        this.l2.rotate(-2.356194490192345);

        // Retrasladar los puntos al centro del jugador
        this.head.add(center.x, center.y);
        this.l1.add(center.x, center.y);
        this.l2.add(center.x, center.y);
    }

    // Rotación del jugador en incrementos de (+-) 10° = 0.17453292519943295
    rotate2(direction) {
        this.head.substract(this.position.x, this.position.y);
        if (direction == RIGHT_DIR) this.head.rotate(this.ANGLE_R);
        else if (direction == LEFT_DIR) this.head.rotate(-this.ANGLE_R);

        this.l1 = this.head.copy();
        this.l2 = this.head.copy();

        this.l1.rotate(this.ANGLE_L);
        this.l2.rotate(-this.ANGLE_L);

        this.head.add(this.position.x, this.position.y);
        this.l1.add(this.position.x, this.position.y);
        this.l2.add(this.position.x, this.position.y);
    }

    bounds(x_range, y_range) {
        let dx = 0;
        let dy = 0;

        if (this.position.x + this.radius <= x_range[0]) {
            dx = (x_range[1] + this.radius) - this.position.x;
        } else if (this.position.x - this.radius >= x_range[1]) {
            dx = -(this.position.x - (x_range[0] - this.radius));
        }

        if (this.position.y + this.radius <= y_range[0]) {
            dy = (y_range[1] + this.radius) - this.position.y;
        } else if (this.position.y - this.radius >= y_range[1]) {
            dy = -(this.position.y - (y_range[0] - this.radius));
        }

        if (dx != 0 || dy != 0) {
            this.position.add(dx, dy);
            this.head.add(dx, dy);
            this.l1.add(dx, dy);
            this.l2.add(dx, dy);
        }
    }

    shot() {
        let o = this.head.copy();
        o.substract(this.position.x, this.position.y);

        let hc = this.head.copy();
        hc.substract(this.position.x, this.position.y);
        this.velocity = SubSVectors(this.velocity, SVectorFromPolarC(hc.heading(), this.shot_force));

        return new Bullet(this.head.x, this.head.y, o);
    }

    render() {
        line(this.head.x, this.head.y, this.l1.x, this.l1.y);
        line(this.l1.x, this.l1.y, this.position.x, this.position.y);
        line(this.position.x, this.position.y, this.l2.x, this.l2.y);
        line(this.head.x, this.head.y, this.l2.x, this.l2.y);
    };
}

class Bullet {
    constructor(ox, oy, direction) {
        this.ox = ox;
        this.oy = oy;
        this.direction = direction;
        this.velocity = SVectorFromPolarC(direction.heading(), 5);
        this.range = 250;
    }

    update() {
        this.direction.add(this.velocity.x, this.velocity.y);
    }

    bounds() {
        return this.direction.magnitude() > this.range;
    }

    arrayDirection() {
        return [this.direction.x + this.ox, this.direction.y + this.oy]
    }

    render() {
        const px = this.direction.x + this.ox;
        const py = this.direction.y + this.oy;
        point(px, py);
    }
}