class CustomMath {
    constructor() {
        throw new Error("Cannot instantiate the CustomMath class.");
    }

    static getRandomPosition(radius) {
		return {
			x: Math.random() * (this.screenWidth - 2 * radius) + radius,
			y: Math.random() * (this.screenHeight - 2 * radius) + radius
		};
	}
}

class CustomVector {
    constructor() {
        throw new Error("Cannot instantiate the CustomVector class.");
    }

    static isValidVector(vector) {
		return vector && !isNaN(vector.x) && !isNaN(vector.y);
	}
}

export { CustomMath, CustomVector };