class AbstractEffect {
    constructor() {
        if (this.constructor === AbstractEffect) {
            throw new Error("Cannot instantiate an abstract class.");
        }
    }

    onCreate() {}

    onCollide() {}

    onDied() {}
}

class ExplodeEffect extends AbstractEffect {
    constructor() {
        super();
        this.section;
        this.explosion_force;
    }

    onCreate() {
        
    }
}

class AttractEffect extends AbstractEffect {
    constructor() {
        super();
        this.force;
        this.cooldown;
        this.effect_distance; // 'effect_distance' c'est la distance que l'attaque doit parcourir avant d'activer son effet.
    }
}

class DrillEffect extends AbstractEffect {
    constructor() {
        super();
        this.force;
    }
}

class FocusEffect extends AbstractEffect {
    constructor() {
        super();
        this.target;
        this.reaction_speed;
    }
}

class DisingrateEffect extends AbstractEffect {
    constructor() {
        super();
        this.force;
    }
}

class BlockEffect extends AbstractEffect {
    constructor() {
        super();
        this.force;
    }
}

class DivertEffect extends AbstractEffect {
    constructor() {
        super();
        this.force;
    }
}

class TeleportEffect extends AbstractEffect {
    constructor() {
        super();
        this.cooldown;
    }
}

export { ExplodeEffect, AttractEffect, DrillEffect, FocusEffect, DisingrateEffect, BlockEffect, DivertEffect, TeleportEffect };
