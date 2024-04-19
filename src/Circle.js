class Circle {

    // Constructor and setters ====

    constructor() {
        this.type = "circle";
        this.position = {
            x : 0.0,
            y: 0.0,
            z: 0.0
        };
        this.color = {
            r: 1.0,
            g: 1.0,
            b: 1.0,
            a: 1.0
        };
        this.size = 10.0;
        this.segments = 10;
    }

    setPosition(x, y, z) {
        this.position = {x, y, z};
    }

    setColor(r, g, b, a) {
        this.color = {r, g, b, a};
    }

    setSize(size) {
        this.size = size;
    }

    setSegments(segments) {
        this.segments = segments;
    }

    // Render methods ====
    render() {
        let [x, y] = [this.position.x, this.position.y];

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, this.color.r, this.color.g, this.color.b, this.color.a);

        for (let i = 0; i < this.segments; i++) {
            let angleStart = i * (360/this.segments);
            let angleEnd = (i+1) * (360/this.segments);

            // Size delta defined in asg1.js.
            let vector1 = {
                x: x + Math.cos(angleStart*Math.PI/180)*SIZE_DELTA*this.size,
                y: y + Math.sin(angleStart*Math.PI/180)*SIZE_DELTA*this.size,
            };
            let vector2 = {
                x: x + Math.cos(angleEnd*Math.PI/180)*SIZE_DELTA*this.size,
                y: y + Math.sin(angleEnd*Math.PI/180)*SIZE_DELTA*this.size,
            };

            Triangle.drawTriangle([
                x,          y,
                vector1.x,  vector1.y,
                vector2.x,  vector2.y
            ]);
        }
    }
}