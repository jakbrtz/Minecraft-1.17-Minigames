DoorDash = class extends this.BaseUntimedGame {

	constructor() {
		super()

		this.width = 6
		this.depth = 8
		this.rows = 8
		this.doors = 4
		this.xOffset = -Math.floor(this.doors * this.width / 2)
		this.zOffset = -Math.floor(this.rows * this.depth / 2)
	}

	BuildWorld() {
		this.ClearWorld()

		for (var row = 0; row < this.rows; row++) {
			let clearDoor1 = RandomInt(this.doors)
			let clearDoor2 = RandomInt(this.doors)
			for (var door = 0; door < this.doors; door++) {
				let structureName = (door == clearDoor1 || door == clearDoor2) ? "doordash:clear" : "doordash:blocked"
				SlashCommand(`/structure load ${structureName} ${(door * this.width + this.xOffset)} 64 ${row * this.depth + this.zOffset}`)
			}
		}
		SlashCommand(`/fill ${this.xOffset} 64 ${this.zOffset - 2 * this.depth} ${this.xOffset + this.doors * this.width - 1} 64 ${this.zOffset-1} concrete 1`)
		SlashCommand(`/fill ${this.xOffset} 64 ${this.rows * this.depth + this.zOffset} ${this.xOffset + this.doors * this.width - 1} 64 ${(this.rows + 2) * this.depth + this.zOffset} concrete 1`)
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${this.xOffset + ((this.doors / 2 + Math.random(-1, 1)) * this.width)} 66 ${this.zOffset - this.depth} facing 0 66 0`)
		SlashCommand(`/effect ${player.name} speed 30 5 true`)
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 60
	}

	PlayerHasLeftStartArea(player) {
		return player.position.z >= this.zOffset
	}

	PlayerIsFinished(player) {
		return player.position.z >= this.rows * this.depth + this.zOffset
	}
}