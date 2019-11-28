const ROT_ANG = 0.7854;
const SEN_ANG = 0.3927;
const SEN_OFF = 9;

class Particle {
    constructor(x, y, dir) {
        this.pos = new Vector2D(x, y);
        this.dir = dir || SVectorRandom(1);

        this.updateSensors();
    }

    updateSensors() {
        //Sensores: uno orientado a su direccion y dos con rotación de (+-) 45°
        const h = this.dir.heading();
        this.c_s = this.dir.copy();
        this.c_s.multiply(SEN_OFF);

        this.l_s = SVectorFromPolarC(h - SEN_ANG, SEN_OFF);
        this.r_s = SVectorFromPolarC(h + SEN_ANG, SEN_OFF);

        this.c_s.add(this.pos);
        this.l_s.add(this.pos);
        this.r_s.add(this.pos);

        this.boundsVector(this.c_s);
        this.boundsVector(this.l_s);
        this.boundsVector(this.r_s);
    }

    // Obtiene los valores de densidad correspondientes a la posición de cada sensor y 
    // selecciona el valor más alto para realizar el giro correspondiente en esa dirección
    update(field) {
        let f, fl, fr;
        let x, y;

        // Valor del sensor central
        x = parseInt(this.c_s.x);
        y = parseInt(this.c_s.y);
        f = field[x][y];

        // Valor del sensor izquierdo
        x = parseInt(this.l_s.x);
        y = parseInt(this.l_s.y);
        fl = field[x][y];

        // Valor del sensor derecho
        x = parseInt(this.r_s.x);
        y = parseInt(this.r_s.y);
        fr = field[x][y];

        if (f > fl && f > fr) {
            // continuar en la misma dirección
        } else if (f < fl && f < fr) {
            // rotar aleatoriamente a la derecha o izquierda
            if (Math.random() > 0.5)
                this.dir.rotate(ROT_ANG);
            else
                this.dir.rotate(-ROT_ANG);
        } else if (fl < fr) {
            // rotar a la derecha
            this.dir.rotate(ROT_ANG);
        } else if (fr < fl) {
            // rotar a la izquierda
            this.dir.rotate(-ROT_ANG);
        }

        this.pos.add(this.dir);
        this.boundsVector(this.pos);
        this.updateSensors();
        this.deposit(field);
    }

    // Afectar densidad en el campo
    deposit(field) {
        const amount = 3;
        const x = parseInt(this.pos.x);
        const y = parseInt(this.pos.y);
        field[x][y] += amount;

        //field[x][y] *= 0.99;
    }

    // Contener posición de la partícula en el área
    boundsVector(vector) {
        if (vector.x < 0) {
            vector.x += W;
        } else if (vector.x >= W) {
            vector.x -= W;
        }

        if (vector.y < 0) {
            vector.y += H;
        } else if (vector.y >= H) {
            vector.y -= H;
        }
    }
}

class ParticlesList {
    constructor(size, field) {
        this.list = [];
        this.field = field;

        const margin = 20;
        const width = field[0] - (margin * 2);
        const height = field[1] - (margin * 2);
        let x, y;

        for (let i = 0; i < size; i++) {
            x = margin + (Math.random() * width);
            y = margin + (Math.random() * height);

            this.list[i] = new Particle(x, y);
        }
    }

    update(field, render) {
        if (render) background(0);
        for (let i = 0; i < this.list.length; i++) {
            if (render) {
                const p = this.list[i].pos;
                point(p.x, p.y);
            }
            this.list[i].update(field);
        }
    }

    render() {
        stroke(230, 0, 70, 75);
        strokeWeight(1);

        for (let i = 0; i < this.list.length; i++) {
            const p = this.list[i].pos;
            point(p.x, p.y);

            // const p = this.list[i];
            // line(p.pos.x, p.pos.y, p.pos.x + p.c_s.x, p.pos.y + p.c_s.y);
            // line(p.pos.x, p.pos.y, p.pos.x + p.l_s.x, p.pos.y + p.l_s.y);
            // line(p.pos.x, p.pos.y, p.pos.x + p.r_s.x, p.pos.y + p.r_s.y);
        }
    }
}