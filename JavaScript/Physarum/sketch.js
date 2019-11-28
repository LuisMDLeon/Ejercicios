let noise_vol;
let particles;

let W = 300;
let H = 300;

function setup() {
    createCanvas(W, H);
    noiseDetail(5, 0.60);
    noise_vol = NoiseMap(W, H);
    particles = new ParticlesList(15000, [W, H]);
    stroke(212, 175, 55, 75);
}

function draw() {
    //background(0);
    particles.update(noise_vol, (frameCount % 2 == 0));
    noise_vol = DiffuseMap(noise_vol);
    //renderNoiseMap();
    //noLoop();
}

function renderNoiseMap() {
    for (let i = 0; i < noise_vol.length; i++) {
        for (let j = 0; j < noise_vol[0].length; j++) {
            stroke(255 * noise_vol[i][j]);
            point(i, j);
        }
    }
}