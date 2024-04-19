class Point {

    // Constructor and setters ====

    constructor() {
        this.type = "point";
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

    // Render method ====

    render() {
        let [x, y, z] = [this.position.x, this.position.y, this.position.z];
        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, x, y, z);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, this.color.r, this.color.g, this.color.b, this.color.a);
        // Pass the size of a point to the u_Size variable
        gl.uniform1f(u_Size, this.size);

        // Stop using the buffer to send attributes
        gl.disableVertexAttribArray(a_Position);

        // Draw a point
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}