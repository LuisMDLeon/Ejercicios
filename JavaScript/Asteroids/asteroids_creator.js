const BIG_ASTEROID = {
    radius: {
        min: 75,
        max: 85
    },
    veritices: {
        min: 6,
        max: 12
    },
    vel: {
        min: 0.3,
        max: 1.1
    }
};
const MEDIUM_ASTEROID = {
    radius: {
        min: 40,
        max: 50
    },
    veritices: {
        min: 5,
        max: 8
    },
    vel: {
        min: 0.5,
        max: 1.3
    }
};
const TINY_ASTEROID = {
    radius: {
        min: 14,
        max: 17
    },
    veritices: {
        min: 5,
        max: 6
    },
    vel: {
        min: 1,
        max: 2
    }
};

function Asteroid(vertices, type, radius, x, y) {
    this.vertices = vertices;
    this.type = type;
    this.radius = radius;
    this.center = new Vector2D(x, y);
    this.velocity = SVectorRandom(type.vel.min, type.vel.max);

    // Actualiza la posición del polígono en base al vector de velocidad u otro parámetro
    this.update = (delta = this.velocity) => {
        for (let i = 0; i < this.vertices.length; i++) {
            // Aplicación de velocidad a la posición (cada vértice)
            this.vertices[i][0] += delta.x;
            this.vertices[i][1] += delta.y;
        }
        // Reposicionamiento del centro
        this.center.add(delta.x, delta.y);
    }

    // Controla la posición de cada polígono de manera que no sobrepasen un area definida
    // invierte su posición al lado opuesto
    this.bounds = (x_range, y_range) => {
        let dx = 0;
        let dy = 0;

        if (this.center.x + this.radius <= x_range[0]) {
            dx = (x_range[1] + this.radius) - this.center.x;
        } else if (this.center.x - this.radius >= x_range[1]) {
            dx = -(this.center.x - (x_range[0] - this.radius));
        }

        if (this.center.y + this.radius <= y_range[0]) {
            dy = (y_range[1] + this.radius) - this.center.y;
        } else if (this.center.y - this.radius >= y_range[1]) {
            dy = -(this.center.y - (y_range[0] - this.radius));
        }

        if (dx != 0 || dy != 0) this.update(new Vector2D(dx, dy));
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
    }
}

function AsteroidsCreator() {
    // Genera un conjunto de vertices de un polígono
    this.createAsteroid = (radius, vertices, x, y, type) => {
        // Divide 360 grados en el número de lados indicado y genera un margen entre cada vertice
        const angle_size = (Math.PI / (vertices + 1)) * 2;
        const margin = angle_size / (vertices + 1);

        // Para cada vertice se calcula el rango del angulo y una distancia del centro (x, y)
        // max define el radio más grande generado entre todos los vertices
        let polygon = [];
        let max = -Infinity;
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

            if (max < rmax) max = rmax;
        }

        return new Asteroid(polygon, type, max, x, y);
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