import * as matter from 'matter-js';
import { Controller } from './Controller.js';
import { Player } from './Player.js';

const G = 0.06674;

class Game {
    constructor() {
        this.pool = [];
        this.Engine = matter.Engine;
        this.Render = matter.Render;
        this.World = matter.World;
        this.Bodies = matter.Bodies;
        this.Body = matter.Body;
        this.Events = matter.Events;
		this.Vector = matter.Vector;

		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;

		this.player = new Player(this, {
			body: this.Bodies.rectangle(...Object.values(this.getRandomPosition(50)), 10, 10, { mass: 1}),
			controller: new Controller(this)
		});

		this.engine = this.Engine.create();

		this.engine.world.gravity.x = 0;
		this.engine.world.gravity.y = 0;



		this.render = this.Render.create({
			element: document.body,
			engine: this.engine,
			options: {
				width: this.screenWidth,
				height: this.screenHeight,
				wireframes: false
			}
		});

		this.add_pool(this.Bodies.circle(...Object.values(this.getRandomPosition(50)), 50, { isStatic: true, mass: 20 }));
		this.add_pool(this.Bodies.circle(...Object.values(this.getRandomPosition(50)), 50, { isStatic: true, mass: 20 }));
		this.add_pool(this.Bodies.circle(...Object.values(this.getRandomPosition(50)), 20, { mass: 1, restitution: 0.5}));
		this.add_pool(this.Bodies.circle(...Object.values(this.getRandomPosition(50)), 20, { mass: 1}));
		this.add_pool(this.Bodies.circle(...Object.values(this.getRandomPosition(50)), 20, { mass: 1}));
		this.add_pool(this.Bodies.circle(...Object.values(this.getRandomPosition(50)), 20, { mass: 1}));
		this.add_pool(this.Bodies.circle(...Object.values(this.getRandomPosition(50)), 20, { mass: 1}));
		this.add_pool(this.Bodies.circle(...Object.values(this.getRandomPosition(50)), 20, { mass: 1}));
		this.add_pool(this.Bodies.circle(...Object.values(this.getRandomPosition(50)), 20, { mass: 1}));
		this.add_pool(this.player.body);

		this.World.add(this.engine.world, [...this.pool]);

		this.Events.on(this.engine, 'beforeUpdate', () => {
			this.applyCustomGravity();
		});
	}

	add_pool(entity) {
		this.pool.push(entity);
	}

	getRandomPosition(radius) {
		return {
			x: Math.random() * (this.screenWidth - 2 * radius) + radius,
			y: Math.random() * (this.screenHeight - 2 * radius) + radius
		};
	}

	applyCustomGravity() {
		const static_bodies = this.pool.filter(e => e.isStatic);
		const no_static_bodies = this.pool.filter(e => !e.isStatic);
		const velocities = [];
		for (const dynamic_body of no_static_bodies) {
			if (!this.isValidVector(dynamic_body.position)) return;
			if (dynamic_body == this.player.body) velocities.push(this.player.controller.getMoveVector());
			
			for (const static_body of static_bodies) {
				if (!this.isValidVector(static_body.position)) return;
				if (dynamic_body == this.player.body && this.player.controller.control.orbit) {
					velocities.push(this.player.controller.getOrbitalVector(dynamic_body, static_body));
					console.log("je balance le vecteur pour mettre en orbit")
				}
					
				const distanceVector = this.Vector.sub(dynamic_body.position, static_body.position);
				const distance = this.Vector.magnitude(distanceVector);
				
				const forceMagnitude = G * (static_body.mass * dynamic_body.mass) / (distance * distance);
				
				const normalizedDistanceVector = this.Vector.normalise(distanceVector);
				

				let gravity_velocity = this.Vector.mult(normalizedDistanceVector, -forceMagnitude);

				for (const velocity of velocities) {
					gravity_velocity = this.Vector.add(gravity_velocity, velocity);
				}
				
				this.Body.applyForce(dynamic_body, dynamic_body.position, gravity_velocity);
			};
		};
	}

	isValidVector(vector) {
		return vector && !isNaN(vector.x) && !isNaN(vector.y);
	}

	start() {
		this.Render.run(this.render);
	}

	update() {
		for (const entity of this.pool) {
			if (entity.update) entity.update();
		}
		this.Engine.update(this.engine);
	}
}

export { Game };
