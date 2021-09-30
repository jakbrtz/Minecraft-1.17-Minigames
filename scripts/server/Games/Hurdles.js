Hurdles = class extends this.Race {

	constructor() {
		super()
	}

	BuildWorld() {

		this.xStart = -12
		this.zStart = -32
		this.xEnd = 12
		this.zEnd = 32
		this.distanceBetweenHurdles = 8

		WorldBuilding.Clear()

		SlashCommand(`/fill ${this.xStart} 64 ${this.zStart} ${this.xEnd} 64 ${this.zEnd} magenta_glazed_terracotta 2`)
		for (var hurdle = this.zStart; hurdle <= this.zEnd; hurdle += this.distanceBetweenHurdles) {
			SlashCommand(`/fill ${this.xStart} 65 ${hurdle} ${this.xEnd} 67 ${hurdle} purpur_block`)
		}
		SlashCommand(`/fill ${this.xStart} 64 ${this.zStart - 10} ${this.xEnd} 64 ${this.zStart - 1} concrete 1`)
		SlashCommand(`/fill ${this.xStart} 64 ${this.zEnd + 1} ${this.xEnd} 64 ${this.zEnd + 10} concrete 1`)
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${Random.Float(this.xStart, this.xEnd)} 66 ${this.zStart - 5} facing 0 66 0`)
		SlashCommand(`/effect ${player.name} speed 1000000 5 true`)
		SlashCommand(`/effect ${player.name} jump_boost 1000000 5 true`)
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 60
	}

	PlayerHasLeftStartArea(player) {
		return player.position.z >= this.zStart
	}

	PlayerIsFinished(player) {
		return player.position.z >= this.zEnd
	}
}