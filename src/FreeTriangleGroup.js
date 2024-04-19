class FreeTriangleGroup {

    // Render methods ====

    static renderFreeTriangles(points, shapesList, renderStep, doneRendering,
                               rush=false) {

        if (rush) {
            for (let i = 0; i < points.length; i++) {
                FreeTriangleGroup.addFreeTriangle(points, i, shapesList);
            }
            renderStep();
            doneRendering();
            return;
        }

        // Elsewise, we're not rushing, and are free to draw sequentially.
        let delay = 50;

        // Works effectively as a delayed for loop.
        let i = 0;
        let timer = setInterval( function(forceQuit) {

            if (i >= points.length) {
                clearInterval(timer);
                doneRendering();
                return;
            };

            FreeTriangleGroup.addFreeTriangle(points, i, shapesList);
            renderStep();
            console.log("draw");
            
            i++;

        }, delay);

        return timer;
    }

    static addFreeTriangle(points, i, shapesList) {
        let pair = points[i];
        let position = pair[0];
        let color = pair[1];

        let freeTriangle = new FreeTriangle();

        freeTriangle.setPosition(position);
        freeTriangle.setColor(color[0] / 255, color[1] / 255, color[2] / 255, color[3] / 255);

        shapesList.push(freeTriangle);
    }
}