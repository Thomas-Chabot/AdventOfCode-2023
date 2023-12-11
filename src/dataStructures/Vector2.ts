export class Vector2 {
    X: number;
    Y: number;
    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }
    Add(x: number, y: number): Vector2 {
        return new Vector2(this.X + x, this.Y + y);
    }
    Equals(other: Vector2) {
        return this.X === other.X && this.Y === other.Y;
    }
    ToString(): string {
        return `${this.X},${this.Y}`;
    }
}