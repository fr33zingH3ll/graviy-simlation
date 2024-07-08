class CustomMath {
    constructor() {
        throw new Error("Cannot instantiate the CustomMath class.");
    }

    static getRandomPosition(offset) {
        const x = Math.random() * (window.innerWidth - 2 * offset) + offset;
        const y = Math.random() * (window.innerHeight - 2 * offset) + offset;
        return { x, y };
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