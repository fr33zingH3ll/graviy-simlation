import { LivingEntity } from "./LivingEntity.js";

class Bullet extends LivingEntity {
    constructor(game, options) {
        super(game, options);
        this.target = options.target || 0;
        this.effects = options.effetcs || [];
        this.topSpeed = options.topSpeed*this.game.gravity.G || this.game.gravity.G;
        this.totalDistance = 0;

        this.onCreate();
    }

    onCreate() {
        super.onCreate();
        if (this.target){
            const vector = this.game.Vector.create(Math.sin(this.target), Math.cos(this.target));
            const velocity = this.game.Vector.mult(vector, this.topSpeed);

        
            this.game.gravity.velocities.push({ id: this.id, velocity });
        }
    }

    onCollide() {
        super.onCollide();
    }

    onDied() {
        super.onDied();
    }

    update(delta) {}
}

export { Bullet };