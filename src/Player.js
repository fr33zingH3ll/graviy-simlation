import { Entity } from "./Entity.js";

class Player extends Entity {
    constructor(game, options) {
        super(game, options)
        this.controller = options.controller;

        this.shot_cooldown = 500;
        this.timer = 0;
        this.can_shot = true;
    }

    shot() {
        console.log("j'ai tiré");
    }

    update(delta) {
        this.game.gravity.velocities.push({ id: this.id, velocity: this.controller.getMoveVector() });
        if (this.timer >= this.shot_cooldown) {
            this.timer = 0;
            this.can_shot = true;
        }
        this.timer += delta;
        if (this.can_shot && this.controller.control.left_click) {
            this.shot();
            this.can_shot = false;
        }
    }
}

export { Player };