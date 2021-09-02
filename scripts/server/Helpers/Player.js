Player = class {
    constructor(entity) {
		this.entity = entity
		this.position = Find(entity)
		this.name = GetName(entity)
		this.team = RandomTeam()
		this.deathTimer = -1
	}

	Update(entity) {
		this.entity = entity
		this.position = Find(entity)
    }
}