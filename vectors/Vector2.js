export class Vector2 {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    MultiplyScalar(f) {
        const nx = this.x * f;
        const ny = this.y * f;

        return new Vector2(nx, ny);
    }

    Invert() {
        return new Vector2(this.x * -1, this.y * -1);
    }

    Set(x, y) {
        this.x = x;
        this.y = y;
    }


    Add(v) {
        this.Set(this.x + v.x, this.y + v.y)
    }

    Rotate(angle) {
        const nx = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
        const ny = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));

        return new Vector2(nx, ny);
    }
}