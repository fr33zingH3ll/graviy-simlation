import { CustomVector } from "./lib/Utils";

class Gravity {
    constructor(game, options = {}) {
        this.game = game;
        this.G = 0.06674;
        this.velocities = []; // sous la forme [{ id: 5, velocity: { x: 5, y: 5 } }]
    }

    getVelocitiesById(id) {
        return this.velocities.filter(e => e.id === id);
    }

    applyCustomGravity() {

		const static_bodies = this.game.pool.filter(e => e.body.isStatic);
		const no_static_bodies = this.game.pool.filter(e => !e.body.isStatic);
        let velocities;

		for (const dynamic_body of no_static_bodies) {
            if (!CustomVector.isValidVector(dynamic_body.body.position)) return;
			velocities = this.getVelocitiesById(dynamic_body.id);

			for (const static_body of static_bodies) {
				if (!CustomVector.isValidVector(static_body.body.position)) return;
                if (dynamic_body === this.game.player && this.game.player.controller.control.orbit) {
                    velocities.push({
                        id: dynamic_body.id,
                        velocity: this.getOrbitalVector(dynamic_body.body, static_body.body)
                    });
                } else if (dynamic_body !== this.game.player) {
                    velocities.push({
                        id: dynamic_body.id,
                        velocity: this.getOrbitalVector(dynamic_body.body, static_body.body)
                    });
                }

				const distanceVector = this.game.Vector.sub(dynamic_body.body.position, static_body.body.position);
				const distance = this.game.Vector.magnitude(distanceVector);
				
				const forceMagnitude = this.G * (static_body.body.mass * dynamic_body.body.mass) / (distance * distance);
				
				const normalizedDistanceVector = this.game.Vector.normalise(distanceVector);

				let gravity_velocity = this.game.Vector.mult(normalizedDistanceVector, -forceMagnitude);

				for (const velocity of velocities) {
					gravity_velocity = this.game.Vector.add(gravity_velocity, velocity.velocity);
				}
				
				this.game.Body.applyForce(dynamic_body.body, dynamic_body.body.position, gravity_velocity);
			};
		};
        this.velocities = [];
	}

    getOrbitalVector(dynamic_body, static_body) {
        const distanceVector = this.game.Vector.sub(dynamic_body.position, static_body.position);
        const current_distance = this.game.Vector.magnitude(distanceVector);

        const orbitalSpeed = this.G * static_body.mass / (current_distance * current_distance);
        
        const normalizedDistanceVector = this.game.Vector.normalise(distanceVector);
        const perpendicularDirection = this.game.Vector.perp(normalizedDistanceVector);

        const velocity = this.game.Vector.mult(perpendicularDirection, orbitalSpeed);
        
        return velocity;
    }
}

export { Gravity };