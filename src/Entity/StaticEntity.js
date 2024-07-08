import { Entity } from "./Entity.js";

class StaticEntity extends Entity {
    constructor() {
        super();
        this.body = options.body;
        this.trail = [];
    }
}


export { StaticEntity };