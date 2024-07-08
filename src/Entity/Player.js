import { Bullet } from "./Bullet.js";
import { LivingEntity } from "./LivingEntity.js";

class Player extends LivingEntity {
    constructor(game, options) {
        super(game, options)
        this.controller = options.controller;

        this.shot_cooldown = 500;
        this.timer = 0;
        this.can_shot = true;
    }

    onDied() {
        super.onDied();
        this.controller.removeEventListeners();
    }

    shot() {
        this.game.add_pool(
            new Bullet(this.game, {
                body: this.game.Bodies.circle(...Object.values(this.body.position), 100, { mass: 0.1 }),
                target: this.controller.getShotAngle(),
                topSpeed: /*this.game.gravity.G*/ 1
            })
        );
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