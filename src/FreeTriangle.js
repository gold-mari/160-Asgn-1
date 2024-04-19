class FreeTriangle {

    // A triangle shape used to draw complex images. Not available as a pen.

    // Constructor and setters ====

    constructor() {
        this.type = "freeTriangle";
        this.points = {
            A: {x: 0.0, y: 0.0, z: 0.0},
            B: {x: 0.0, y: 0.0, z: 0.0},
            C: {x: 0.0, y: 0.0, z: 0.0}
        };
        this.color = {
            r: 1.0,
            g: 1.0,
            b: 1.0,
            a: 1.0
        };
    }

    setPosition(points) {
        this.points = {
            A: {x: points[0][0], y: points[0][1], z: 0.0},
            B: {x: points[1][0], y: points[1][1], z: 0.0},
            C: {x: points[2][0], y: points[2][1], z: 0.0}
        };
    }

    setColor(r, g, b, a) {
        this.color = {r, g, b, a};
    }

    // Render methods ====

    render() {      
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, this.color.r, this.color.g, this.color.b, this.color.a);

        // Size delta defined in asg1.js.
        Triangle.drawTriangle([ 
            this.points.A.x, this.points.A.y,
            this.points.B.x, this.points.B.y,
            this.points.C.x, this.points.C.y
        ]);
    }
}