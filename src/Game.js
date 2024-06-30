import * as matter from 'matter-js';
import { Controller } from './Controller.js';
import { Player } from './Player.js';
import { Entity } from './Entity.js';

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
		this.Mouse = matter.Mouse;
		this.Composite = matter.Composite;
		this.MouseConstraint = matter.MouseConstraint;

		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;

		this.zoom = 1;
		this.zoomSpeed = 0.1;
		this.simulationSpeed = 1;
		
		this.engine = this.Engine.create();
		this.world = this.engine.world;
		this.world.gravity.scale = 0;
		
		this.render = this.Render.create({
			element: document.body,
			engine: this.engine,
			options: {
				width: this.screenWidth,
				height: this.screenHeight,
				wireframes: false
			}
		});
		
		document.body.style.margin = 0;
		document.body.style.overflow = 'hidden';
		this.render.canvas.style.display = 'block';
		
		this.player = new Player(this, {
			body: this.Bodies.rectangle(...Object.values(this.getRandomPosition(50)), 10, 10, { mass: 1}),
			controller: new Controller(this)
		});

		this.add_pool(
			new Entity(this, {
				body: this.Bodies.circle(...Object.values(this.getRandomPosition(50)), 50, { isStatic: true, mass: 20 })
			}
		));

		for (let i = 0; i < 2; i++) {
			console.log(i);
			this.add_pool(
				new Entity(this, {
					body: this.Bodies.circle(...Object.values(this.getRandomPosition(50)), 20, { mass: 1 })
				}
			));
		}

		this.add_pool(this.player);
		const pool_body = this.pool.filter(e => e.body);
		this.World.add(this.engine.world, [...pool_body]);

		const mouse = this.Mouse.create(this.render.canvas);
		const mouseConstraint = this.MouseConstraint.create(this.engine, {
			mouse: mouse,
			constraint: {
				stiffness: 0.2,
				render: {
					visible: false
				}
			}
		});

		this.Composite.add(this.engine.world, mouseConstraint);
		this.render.mouse = mouse;


        // Add event listeners to pan the view with the mouse
        this.isPanning = false;
        this.start_x = 0;
		this.start_y = 0;

		this.render.canvas.addEventListener('mousedown', (event) => {
            if (event.button === 2) {
                this.isPanning = true;
                this.start_x = event.clientX;
                this.start_y = event.clientY;
            }
        });

		this.render.canvas.addEventListener('mousemove', (event) => {
            if (this.isPanning) {
				const new_pos = {x: event.clientX, y: event.clientY};
				const pos = this.Vector.sub(new_pos, { x: this.start_x, y: this.start_y });

				this.start_x = new_pos.x;
				this.start_y = new_pos.y;
				this.Composite.translate(this.engine.world, pos);
            }
        });

        this.render.canvas.addEventListener('mouseup', (event) => {
            if (event.button === 2) {
                this.isPanning = false;
            }
        });

		this.Events.on(this.engine, 'beforeUpdate', () => {
			this.applyCustomGravity();
		});
	}

	add_pool(entity) {
		this.pool.push(entity);
		this.Composite.add(this.world, entity.body);
	}

	getRandomPosition(radius) {
		return {
			x: Math.random() * (this.screenWidth - 2 * radius) + radius,
			y: Math.random() * (this.screenHeight - 2 * radius) + radius
		};
	}

	applyCustomGravity() {

		const static_bodies = this.pool.filter(e => e.body.isStatic);
		const no_static_bodies = this.pool.filter(e => !e.body.isStatic);


		const velocities = [];
		for (const dynamic_body of no_static_bodies) {
			if (!this.isValidVector(dynamic_body.body.position)) return;
			if (dynamic_body.body == this.player.body) velocities.push(this.player.controller.getMoveVector());
			
			for (const static_body of static_bodies) {
				if (!this.isValidVector(static_body.body.position)) return;
				//if (dynamic_body.body === this.player.body && this.player.controller.control.orbit) 
				velocities.push(this.getOrbitalVector(dynamic_body.body, static_body.body));
					
				const distanceVector = this.Vector.sub(dynamic_body.body.position, static_body.body.position);
				const distance = this.Vector.magnitude(distanceVector);
				
				const forceMagnitude = G * (static_body.body.mass * dynamic_body.body.mass) / (distance * distance);
				
				const normalizedDistanceVector = this.Vector.normalise(distanceVector);

				let gravity_velocity = this.Vector.mult(normalizedDistanceVector, -forceMagnitude);

				for (const velocity of velocities) {
					gravity_velocity = this.Vector.add(gravity_velocity, velocity);
				}
				
				this.Body.applyForce(dynamic_body.body, dynamic_body.body.position, gravity_velocity);
			};
		};
	}

	getOrbitalVector(dynamic_body, static_body) {
        const distanceVector = this.Vector.sub(dynamic_body.position, static_body.position);
        const current_distance = this.Vector.magnitude(distanceVector);

        const orbitalSpeed = G * static_body.mass / (current_distance * current_distance);
        
        const normalizedDistanceVector = this.Vector.normalise(distanceVector);
        const perpendicularDirection = this.Vector.perp(normalizedDistanceVector);

        const velocity = this.Vector.mult(perpendicularDirection, orbitalSpeed);
        
        return velocity;
    }

	isValidVector(vector) {
		return vector && !isNaN(vector.x) && !isNaN(vector.y);
	}

	start() {
		this.Render.run(this.render);
	}

	update(delta) {
		for (const entity of this.pool) {
			entity.update(delta);
		}
		this.Engine.update(this.engine);
	}
}

export { Game };
