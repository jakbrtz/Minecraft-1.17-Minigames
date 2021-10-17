Player = class {
    constructor(entity) {
        this.entity = entity;
        this.name = System.GetName(entity);
        this.team = Teams.Random();
        this.deathTimer = -1;
        this.needsReviving = true;
	}
}