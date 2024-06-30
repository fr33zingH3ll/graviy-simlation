

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
        this.keybind = {right: 'd', left: 'q', up: 'z', down: 's', orbit: 'a', left_click: 'mouseLeft'};
        this.control = {right: false, left: false, up: false, down: false, left_click: false, ctrl_wheel: false};
        this.setupEventListeners();
    }

    /**
    * Sets up event listeners for keyboard and mouse input.
    */
    setupEventListeners() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);

        window.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mouseup', this.handleMouseUp);

        window.addEventListener('wheel', this.handleWheel);
    }

    /**
    * Removes event listeners for keyboard and mouse input.
    */
    removeEventListeners() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);

        window.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mouseup', this.handleMouseUp);

        window.removeEventListener('wheel', this.handleWheel);
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
        if (event.key === this.keybind.left_click) {
            this.control.left_click = true;
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
        }
    }

    /**
    * Handles mousedown events for shooting.
    * @param {MouseEvent} event - The mouse event object.
    */
    handleMouseDown = (event) => {
        if (event.button === 0) { // Left mouse button
            this.control.left_click = true;
        }
    }
    
    /**
     * Handles mouseup events to stop shooting.
     * @param {MouseEvent} event - The mouse event object.
    */
   handleMouseUp = (event) => {
        if (event.button === 0) { // Left mouse button
            this.control.left_click = false;
        }
    }

    /**
     * Handles wheel events for zooming with Ctrl key.
     * @param {WheelEvent} event - The wheel event object.
     */
    handleWheel = (event) => {
        if (event.ctrlKey) {
            // Ajuster la vitesse de simulation avec Ctrl + Molette
            if (event.deltaY < 0) {
                this.game.simulationSpeed = Math.min(this.game.simulationSpeed + this.game.zoomSpeed, 10);
            } else {
                this.game.simulationSpeed = Math.max(this.game.simulationSpeed - this.game.zoomSpeed, 0.1);
            }

            // Appliquer la nouvelle vitesse de simulation
            this.game.engine.timing.timeScale = this.game.simulationSpeed;
            console.log(`Simulation speed: ${this.game.simulationSpeed}`);
        } else {
            event.preventDefault(); // Empêcher le comportement par défaut du navigateur

            // Détecter le sens de défilement
            if (event.deltaY < 0) {
                this.game.zoom += this.game.zoomSpeed;
            } else {
                this.game.zoom -= this.game.zoomSpeed;
            }
    
            // Limiter le zoom pour éviter un zoom excessif
            this.game.zoom = Math.max(0.1, Math.min(this.game.zoom, 5));
    
            // Calculer le centre actuel de la vue
            const centerX = this.game.render.options.width / 2;
            const centerY = this.game.render.options.height / 2;

            // Appliquer le zoom au renderer, centré sur le centre de la vue
            this.game.Render.lookAt(this.game.render, {
                min: { x: centerX - (centerX / this.game.zoom), y: centerY - (centerY / this.game.zoom) },
                max: { x: centerX + (centerX / this.game.zoom), y: centerY + (centerY / this.game.zoom) }
            });
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
        const current_distance = this.game.Vector.magnitude(distanceVector);

        const orbitalSpeed = G * static_body.mass / (current_distance * current_distance);
        
        const normalizedDistanceVector = this.game.Vector.normalise(distanceVector);
        const perpendicularDirection = this.game.Vector.perp(normalizedDistanceVector);

        const velocity = this.game.Vector.mult(perpendicularDirection, -orbitalSpeed);
        
        return velocity;
    }
}

export { Controller };