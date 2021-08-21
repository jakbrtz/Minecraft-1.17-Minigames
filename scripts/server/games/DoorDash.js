DoorDash = class extends this.BaseGame {

	constructor() {
		super()

		this.width = 6
		this.depth = 8
		this.rows = 8
		this.doors = 4
		this.xOffset = -Math.floor(this.doors * this.width / 2)
		this.zOffset = 0
	}

	SetupOverride() {
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

		SlashCommand(`/spreadplayers 0 ${this.zOffset - this.depth} 3 ${this.depth-2} @a`)
		SlashCommand(`/gamemode adventure @a`)

		SlashCommand(`/clear @a`)

		this.StartGame()
	}

	StartGameOverride() {
		SlashCommand(`/spreadplayers ${this.xOffset + Math.floor(this.doors * this.width / 2)} ${this.zOffset - this.depth} 3  ${this.depth - 2} @a`)
	}

	RespawnOverride(player) {
		SlashCommand(`/spreadplayers ${this.xOffset + Math.floor(this.doors * this.width / 2)} ${this.zOffset - this.depth} 3  ${this.depth - 2} ${player.name}`)
	}

	IsGameInProgressOverride() {
		return this.AllPlayersAre(player => player.position.z < this.rows * this.depth + this.zOffset)
	}
}