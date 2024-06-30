class Entity {
    constructor(game, options) {
        this.game = game;

        this.body = options.body;
    }

    update(delta) {}
}

export { Entity };