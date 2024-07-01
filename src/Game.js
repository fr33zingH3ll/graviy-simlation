import * as matter from 'matter-js';
import { Controller } from './Controller.js';
import { Player } from './Player.js';
import { Entity } from './Entity.js';
import { Gravity } from './Gravity.js';

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

        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;

        this.zoom = 1;
        this.zoomSpeed = 0.1;
        this.simulationSpeed = 1;

        this.gravity = new Gravity(this, {});
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

        this.render.mouse = mouse;

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
            this.gravity.applyCustomGravity();
        });
    }

    add_pool(entity) {
        this.pool.push(entity);
        this.Composite.add(this.world, entity.body);
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

    getRandomPosition(offset) {
        const x = Math.random() * (this.screenWidth - 2 * offset) + offset;
        const y = Math.random() * (this.screenHeight - 2 * offset) + offset;
        return { x, y };
    }
}

export { Game };
