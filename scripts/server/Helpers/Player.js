Player = class {
    constructor(entity) {
        this.entity = entity;
        this.name = GetName(entity);
        this.team = Teams.Random();
        this.deathTimer = -1;
        this.needsReviving = true;
	}
}