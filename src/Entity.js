var ID_COUNTER = 0;

class Entity {
    constructor(game, options) {
        this.game = game;
        this.id = ID_COUNTER++;
        
        this.body = options.body;
    }

    update(delta) {}
}

export { Entity };