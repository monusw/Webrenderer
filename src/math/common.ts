function interp(x1: number, x2: number, t: number) {
    return x1 + (x2 - x1) * t;
}

function radians(angle: number): number {
    return angle / 180.0 * Math.PI
}