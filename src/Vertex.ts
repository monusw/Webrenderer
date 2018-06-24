class Vertex {

    public position: Vec3;
    public color: Color;

    constructor(x: number = 0, y: number = 0, z: number = 0, color?: Color) {
        this.position = new Vec3(x, y, z);
        if (color === undefined) {
            this.color = new Color(0x000000);
        } else {
            this.color = color;
        }
    }

    public interp(v: Vertex, t: number) {
        var position = this.position.interp(v.position, t);
        var color = this.color.interp(v.color, t);
        return new Vertex(position.x, position.y, position.z, color);
    }

    public swap(v: Vertex) {
        this.position.swap(v.position);
        this.color.swap(v.color);
    }
}