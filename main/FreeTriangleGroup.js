class FreeTriangleGroup {

    // Render methods ====

    static renderFreeTriangles(points, shapesList, renderStep, doneRendering) {

        let delay = 50;

        // Works effectively as a delayed for loop.
        let i = 0;
        let timer = setInterval( function() {

            if (i >= points.length) {
                clearInterval(timer);
                doneRendering();
                return;
            };

            let pair = birdPoints[i];
            let position = pair[0];
            let color = pair[1];

            let freeTriangle = new FreeTriangle();

            freeTriangle.setPosition(position);
            freeTriangle.setColor(color[0]/255, color[1]/255, color[2]/255, color[3]/255);

            shapesList.push(freeTriangle);
            renderStep();
            
            i++;

        }, delay);
    }
}