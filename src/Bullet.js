import { Entity } from "./Entity";

class Bullet extends Entity {
    constructor(game, options) {
        super(game, options);
        this.target;
    }
}