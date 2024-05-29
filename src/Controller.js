

const G = 0.06674;
/**
 * Contrôleur pour gérer les entrées utilisateur et le mouvement de la caméra.
 */
class Controller {
    /**
     * Crée une instance du contrôleur.
     * @param {Game} game - L'instance du jeu.
     */
    constructor(game) {
        this.game = game;
        this.keybind = {right: 'd', left: 'q', up: 'z', down: 's', orbit: 'a'};
        this.control = {right: false, left: false, up: false, down: false, left_click: false};
        this.setupEventListeners();
    }

    /**
    * Sets up event listeners for keyboard and mouse input.
    */
    setupEventListeners() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    /**
    * Removes event listeners for keyboard and mouse input.
    */
    removeEventListeners() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    /**
    * Handles keydown events for player movement and shooting.
    * @param {KeyboardEvent} event - The keyboard event object.
    */
    handleKeyDown = (event) => {
        if (event.key === this.keybind.left) {
            this.control.left = true;
        } else if (event.key === this.keybind.right) {
            this.control.right = true;
        }
        if (event.key === this.keybind.up) {
            this.control.up = true;
        } else if (event.key === this.keybind.down) {
            this.control.down = true;
        }
    }

    /**
    * Handles keyup events to stop player movement.
    * @param {KeyboardEvent} event - The keyboard event object.
    */
    handleKeyUp = (event) => {
        if (event.key === this.keybind.left) {
            this.control.left = false;
        } else if (event.key === this.keybind.right) {
            this.control.right = false;
        }
        if (event.key === this.keybind.up) {
            this.control.up = false;
        } else if (event.key === this.keybind.down) {
            this.control.down = false;
        }
        if (event.key === this.keybind.orbit) {
            this.control.orbit = !this.control.orbit;
            console.log(this.control.orbit);
        }
    }

   /**
    * Gets the movement vector based on the current control state and camera orientation.
    * @param {THREE.Spherical} spherical - The spherical coordinates of the camera.
    */
   getMoveVector() {
        let x = 0;
        let y = 0;

        if (this.control.up) {
            y += 1;
        }
        if (this.control.down) {
            y -= 1;
        }
        if (this.control.right) {
            x -= 1;
        }
        if (this.control.left) {
            x += 1;
        }

        const controlVector = this.game.Vector.create(x, y);
        const normalizeControlVector = this.game.Vector.normalise(controlVector);
        const final_vector = this.game.Vector.mult(normalizeControlVector, -0.00006674);
        return final_vector;
    }

    getOrbitalVector(dynamic_body, static_body) {
        const distanceVector = this.game.Vector.sub(dynamic_body.position, static_body.position);
		const distance = this.game.Vector.magnitude(distanceVector);

        const orbitalSpeed = G * static_body.mass / (distance * distance);
        const normalizedDistanceVector = this.game.Vector.normalise(distanceVector);
        const perpendicularDirection = this.game.Vector.perp(normalizedDistanceVector);

        const velocity = this.game.Vector.mult(perpendicularDirection, -orbitalSpeed);
        return velocity;
    }
}

export { Controller };