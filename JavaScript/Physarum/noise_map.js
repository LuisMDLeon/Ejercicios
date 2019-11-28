const NoiseMap = (width, height) => {
    let map = [];
    let scale = 0.1;
    for (let i = 0; i < width; i++) {
        map[i] = [];
        for (let j = 0; j < height; j++) {
            map[i][j] = noise(scale * i, scale * j);
        }
    }
    return map;
}

const DiffuseMap = (map) => {
    const percent = 0.1;
    let new_map = [];

    for (let i = 0; i < map.length; i++)
        new_map[i] = [...map[i]];

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] <= 0.0005) continue;

            const amount = map[i][j] * percent;
            new_map[i][j] -= amount;

            const i_amt = amount / 8;

            if (i == 0 || i == map.length - 1 || j == 0 || j == map[0].length - 1) {
                FindPoints(i, j, new_map, i_amt);
                new_map[i][j] *= 0.9;
            } else {
                new_map[i - 1][j - 1] += i_amt;
                new_map[i][j - 1] += i_amt;
                new_map[i + 1][j - 1] += i_amt;
                new_map[i - 1][j] += i_amt;
                new_map[i + 1][j] += i_amt;
                new_map[i - 1][j + 1] += i_amt;
                new_map[i][j + 1] += i_amt;
                new_map[i + 1][j + 1] += i_amt;

                new_map[i][j] *= 0.9;
            }
        }
    }
    return new_map;
}

const FindPoints = (x, y, map, i_amt) => {
    let xf, yf;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            xf = x + i;
            yf = y + j;

            if (xf < 0) {
                xf = map.length - 1;
            } else if (xf >= W) {
                xf = 0;
            }

            if (yf < 0) {
                yf = map[0].length - 1;
            } else if (yf >= H) {
                yf = 0;
            }

            // X y Y quedan mapeados en un toroide
            map[xf][yf] += i_amt;
        }
    }
}