DoorDash = class extends this.Race {

	constructor() {
		super()

		this.width = 6
		this.depth = 8
		this.rows = 8
		this.doors = 4
	}

	BuildWorld() {

		this.xStart = -this.doors * this.width / 2
		this.zStart = -this.rows * this.depth / 2

		for (var row = 0; row < this.rows; row++) {
			const clearDoor1 = Random.Int(this.doors)
			const clearDoor2 = Random.Int(this.doors)
			for (var door = 0; door < this.doors; door++) {
				const structureName = (door === clearDoor1 || door === clearDoor2) ? "doordash:clear" : "doordash:blocked"
				SlashCommand(`/structure load ${structureName} ${(door * this.width + this.xStart)} 64 ${row * this.depth + this.zStart}`)
			}
		}
		SlashCommand(`/fill ${this.xStart} 64 ${this.zStart - 2 * this.depth} ${this.xStart + this.doors * this.width - 1} 64 ${this.zStart-1} concrete 1`)
		SlashCommand(`/fill ${this.xStart} 64 ${this.rows * this.depth + this.zStart} ${this.xStart + this.doors * this.width - 1} 64 ${(this.rows + 2) * this.depth + this.zStart} concrete 1`)
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${this.xStart + ((this.doors / 2 + Math.random(-1, 1)) * this.width)} 66 ${this.zStart - this.depth} facing 0 66 0`)
		SlashCommand(`/effect ${player.name} speed 1000000 5 true`)
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 60
	}

	PlayerHasLeftStartArea(player) {
		return player.position.z >= this.zStart
	}

	PlayerIsFinished(player) {
		return player.position.z >= this.rows * this.depth + this.zStart
	}
}