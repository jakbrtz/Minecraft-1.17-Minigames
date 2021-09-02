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

    AppearDead(time) {
        SlashCommand(`/clear ${this.name}`)
        SlashCommand(`/effect ${this.name} slow_falling ${time} 15 true`)
        SlashCommand(`/effect ${this.name} night_vision ${time} 1 true`)
        SlashCommand(`/effect ${this.name} speed ${time} 1 true`)
        SlashCommand(`/effect ${this.name} fire_resistance ${time} 100 true`)
        SlashCommand(`/effect ${this.name} conduit_power ${time} 1 true`)
        SlashCommand(`/effect ${this.name} invisibility ${time} 1 true`)
        SlashCommand(`/effect ${this.name} resistance ${time} 100 true`)
        SlashCommand(`/effect ${this.name} weakness ${time} 100 true`)
        SlashCommand(`/effect ${this.name} saturation ${time} 100 true`)
    }
}