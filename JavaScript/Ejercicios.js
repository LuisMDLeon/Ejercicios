//Autor: Luis M. de León

function factorial(n) {
    if (n == 0) return 1;
    let result = n;
    for (let i = n - 1; i >= 2; i--) {
        result *= i;
    }
    return result;
}

function pow(n, e) {
    if (e == 0) return 1;
    let result = n;
    for (let i = e; i >= 2; i--) {
        result *= n;
    }
    return result;
}

function c_bin(n, k) {
    const t = factorial(n);
    const d = factorial(k) * factorial(n - k);
    return t / d;
}

function s_number(n, k) {
    const p1 = (k % 2 == 0 ? 1 : -1) / factorial(k);
    let p2 = 0;

    for (let m = 1; m <= k; m++) {
        let sp1 = (m % 2 == 0) ? 1 : -1;
        let sp2 = c_bin(k, m) * pow(m, n);
        p2 += sp1 * sp2;
    }

    return p1 * p2;;
}

function s_number2(n, k) {
    const v1 = 1 / factorial(k);
    let v2 = 0;

    for (let i = 0; i <= k; i++) {
        v2 += (i % 2 == 0 ? 1 : -1) * c_bin(k, i) * pow(k - i, n);
    }

    return v1 * v2;
}

function combinaciones(puntaje) {
    if (puntaje < 1 || puntaje > 12) return 0;
    return 6 - Math.abs(puntaje - 6 - 1);
}

function multiplicacion(n1, n2) {
    let suma = 0;
    do {
        if (n1 % 2 != 0) suma += n2;
        n2 *= 2;
        n1 = parseInt(n1 / 2);
    } while (n1 >= 1);
    return suma;
}

function sumDiv(n) {
    let sum = 1;
    for (let i = n - 1; i >= 2; i--) {
        if (n % i == 0) sum += i;
    }
    return sum;
}

function num_amigables(limInf, limSup) {
    for (let num = limInf; num <= limSup; num++) {
        let numA = sumDiv(num);
        if (numA >= limInf && numA <= limSup) {
            let numB = sumDiv(numA)
            if (num == numB) return [numA, numB];
        }
    }
    return false;
}

//num_amigables(1000, 1500) ==> [ 1210, 1184 ]

console.log(num_amigables(1000, 1500));