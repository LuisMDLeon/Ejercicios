const BIG_ASTEROID = {
    radius: {
        min: 75,
        max: 100
    },
    veritices: {
        min: 6,
        max: 12
    }
};
const MEDIUM_ASTEROID = {
    radius: {
        min: 35,
        max: 50
    },
    veritices: {
        min: 5,
        max: 8
    }
};
const TINY_ASTEROID = {
    radius: {
        min: 10,
        max: 15
    },
    veritices: {
        min: 5,
        max: 6
    }
};

function random2DVector(min_lenght, max_lenght) {
    const length = min_lenght + Math.random() * (max_lenght - min_lenght);
    const angle = Math.random() * (Math.PI * 2);

    const x = length * Math.cos(angle);
    const y = length * Math.sin(angle);

    return [x, y];
}

function Asteroid(vertices, type, radius, center) {
    this.vertices = vertices;
    this.type = type;
    this.radius = radius;
    this.center = center;
    this.velocity = random2DVector(1, 2.5);
    //this.drag = 0.2;

    // Actualiza la posición del polígono en base al vector de velocidad u otro parámetro
    this.update = (delta = this.velocity) => {
        for (let i = 0; i < this.vertices.length; i++) {
            // Aplicación de velocidad a la posición (cada vértice)
            this.vertices[i][0] += delta[0];
            this.vertices[i][1] += delta[1];
        }
        // Reposicionamiento del centro
        this.center[0] += delta[0];
        this.center[1] += delta[1];
    }

    // Controla la posición de cada polígono de manera que no sobrepasen un area definida
    // invierte su posición al lado opuesto
    this.bounds = (x_range, y_range) => {
        let dc = [0, 0];


        if (this.center[0] + this.radius <= x_range[0]) {
            //dc[0] = x_range[1] + this.radius - Math.abs(this.center[0]);
            dc[0] = (x_range[1] + this.radius) - this.center[0];
        } else if (this.center[0] - this.radius >= x_range[1]) {
            dc[0] = -(this.center[0] - (x_range[0] - this.radius));
        }

        if (this.center[1] + this.radius <= y_range[0]) {
            dc[1] = (y_range[1] + this.radius) - this.center[1];
        } else if (this.center[1] - this.radius >= y_range[1]) {
            dc[1] = -(this.center[1] - (y_range[0] - this.radius));
        }

        if (dc[0] != 0 || dc[1] != 0) this.update(dc);
    }

    this.render = () => {
        const length = this.vertices.length;
        for (let i = 0; i + 1 < length; i++) {
            const a = this.vertices[i];
            const b = this.vertices[i + 1];

            line(a[0], a[1], b[0], b[1]);
        }

        const a = this.vertices[0];
        const b = this.vertices[length - 1];

        line(a[0], a[1], b[0], b[1]);
        circle(this.center[0], this.center[1], this.radius * 2);
    }
}

function AsteroidsCreator() {
    // Genera un conjunto de vertices de un polígono
    this.createAsteroid = (radius, vertices, x, y, type) => {
        // Divide 360 grados en el número de lados indicado y genera un margen entre cada vertice
        const angle_size = (Math.PI / (vertices + 1)) * 2;
        const margin = angle_size / (vertices + 1);

        // Para cada vertice se calcula el rango del angulo y una distancia del centro (x, y)
        let polygon = [];
        for (let i = 0; i < vertices; i++) {
            const a1 = (angle_size * i) + margin;
            const a2 = (angle_size * (i + 1)) - margin;

            const rmin = radius / 3; // distancia mínima
            const rmax = radius - rmin; // distancia máxima

            const angle = a2 + Math.random() * (a2 - a1);
            const distance = rmin + Math.random() * rmax;

            const vx = distance * Math.cos(angle) + x;
            const vy = distance * Math.sin(angle) + y;

            polygon[i] = [vx, vy];
        }

        return new Asteroid(polygon, type, radius, [x, y]);
    }

    // Genera una lista de polígonos con radio y número de vertices aleatorios dentro de un rango
    // el objeto area indica un área circular en donde NO aparecerán polígonos
    this.createAsteroids = (n, min_radius, max_radius, min_vertices, max_vertices, area, type) => {
        let asteroids = [];

        for (let i = 0; i < n; i++) {
            // Generación aleatoria del radio y número de vertices
            const radius = min_radius + Math.random() * (max_radius - min_radius);
            const vertices = min_vertices + Math.round(Math.random() * (max_vertices - min_vertices));

            // Cálculo de una coordenada polar de un punto
            const angle = Math.random() * (Math.PI * 2);
            const distance = area.radius + radius + Math.random() * (3 * area.radius);

            // El punto se desplaza fuera del área indicada y se convierte a coordenadas rectangulares
            const x = distance * Math.cos(angle) + area.center.x;
            const y = distance * Math.sin(angle) + area.center.y;

            asteroids[i] = this.createAsteroid(radius, vertices, x, y, type);
        }

        return asteroids;
    }

    this.generateList = (n, size, cx, cy, radius) => {
        const area = {
            center: {
                x: cx,
                y: cy
            },
            radius: radius,
        }
        const asteroids_list = this.createAsteroids(n, size.radius.min, size.radius.max, size.veritices.min, size.veritices.max, area, size);
        return asteroids_list;
    }
}