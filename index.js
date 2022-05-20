const pyramid = require("./testData");

function getFastestPath(input) {
    const data = parsePyramidInput(input);

    if (!isValidTestData(data))
        return "Invalid test data.";

    const startingField = data[0][0];
    let paths = [startingField];

    for (let layer = 1; layer < data.length; layer++) {
        let newPaths = [];

        const {outerLeft, previousOuterRight, outerRight} = getFieldIndex(layer);

        const previousOuterLeftPath = paths[outerLeft];
        const previousOuterRightPath = paths[previousOuterRight];

        const outerLeftField = data[layer][outerLeft];
        const outerRightField = data[layer][outerRight];

        const outerLeftPath = previousOuterLeftPath + outerLeftField;
        const outerRightPath = previousOuterRightPath + outerRightField;

        newPaths[outerLeft] = outerLeftPath;
        newPaths[outerRight] = outerRightPath;

        // Calculate all middle paths (between the outer left path and outer right path)
        // Rules say that we can only slide to the two adjacent fields downwards.
        for (let fieldIndex = outerLeft + 1; fieldIndex < outerRight; fieldIndex++) {
            const previousLeftPath = paths[fieldIndex - 1];
            const previousRightPath = paths[fieldIndex];

            const middleField = data[layer][fieldIndex];

            const leftPath = previousLeftPath + middleField;
            const rightPath = previousRightPath + middleField;

            // Select the path with lowest friction.
            newPaths[fieldIndex] = Math.min(leftPath, rightPath)
        }

        // Replace previous paths with the new paths (Previous friction cost has been added to the new paths).
        paths = newPaths;
    }

    return Math.min.apply(null, paths);
}

function parsePyramidInput(input) {
    return input
        // Parse newlines regardless of the operation system
        .split(/\r?\n/)
        // Convert row values into decimal numbers
        .map(row => {
            return row
                .split(" ")
                .map(value => convertToPositiveNumber(value))
                .filter(value => value != null);   
        });
}

function convertToPositiveNumber(value) {
    const decimalNumber = parseInt(value, 10);

    // If converted value is not a number or negative number => null
    if (isNaN(decimalNumber) || Math.sign(decimalNumber) === -1)
        return null;

    return decimalNumber;
}

function isValidTestData(data) {
    const layers = convertToPositiveNumber(data.shift());
    const parsedAmountOfLayers = data.length;

    return layers === parsedAmountOfLayers;
}

function getFieldIndex(layer) {
    return {
        outerLeft: 0,
        previousOuterRight: layer - 1,
        couterRight: layer
    }
}

console.log(getFastestPath(pyramid.x));
console.log(getFastestPath(pyramid.a));
console.log(getFastestPath(pyramid.b));