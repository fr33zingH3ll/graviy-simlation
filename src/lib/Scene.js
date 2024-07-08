class Scene {
    constructor() {
        this.pool = [];
    }

    add_pool(entity) {
        this.pool.push(entity);
        console.log(this.pool);
    }

    remove_pool() {
        const index = this.pool.indexOf(entity);
        if (index !== -1) {
            this.pool.splice(index, 1);
        }
    }
}

export { Scene };