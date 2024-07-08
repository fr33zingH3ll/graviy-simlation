import { Entity } from "./Entity.js";

class LivingEntity extends Entity {
    constructor(game, options) {
        super(game, options);
        this.hp = options.hp || 100;
        this.hp_max = options.hp_max || 100;
    }

    onCreate() {}

    onCollide() {}

    onDied() {
        this.game.remove_pool(this);
    }
    

    renderTrail() {
        const context = this.game.render.context;
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = 'white';
      
        // Dessiner la traînée
        for (let i = 0; i < this.trail.length - 1; i++) {
          context.moveTo(this.trail[i].x, this.trail[i].y);
          context.lineTo(this.trail[i + 1].x, this.trail[i + 1].y);
        }
      
        context.stroke();
        context.closePath();
    }
}


export { LivingEntity };