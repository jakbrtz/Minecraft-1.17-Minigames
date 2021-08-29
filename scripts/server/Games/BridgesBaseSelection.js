BridgesBaseSelection = class extends this.BaseGame {

	constructor() {
		super()
		this.bases = [
			{ x: 32, z: 0, rotation: 270, structure: "bases:Amethyst" },
			{ x: 0, z: -32, rotation: 180, structure: "bases:GoldBlocks" },
			{ x: -32, z: 0, rotation: 90, structure: "bases:Mud" },
			{ x: 0, z: 32, rotation: 0, structure: "bases:Temple" },
		]
	}

	StartGameOverride() {
		this.ClearWorld()
		SlashCommand(`/fill -64 64 -64 63 64 63 glass`)
		this.bases.forEach(base => {
			SlashCommand(`/structure load ${base.structure} ${base.x - 14} 50 ${base.z - 14} ${base.rotation}_degrees`)
        })

		GameController.Players.forEach(player => {
			this.Respawn(player.entity)
			player.requestedBase = undefined
		})
	}

	RespawnOverride(player) {
		SlashCommand(`/tp ${player.name} ${RandomFloat(-10, 10)} 66 ${RandomFloat(-10, 10)}`)
	}

	UpdateGameOverride() {

		GameController.Players.forEach(player => {
			this.bases.forEach(base => {
				if (player.requestedBase != base.structure && PositionsAreCloseIgnoreY(player.position, base, 14)) {
					player.requestedBase = base.structure
					Chat(`${player.name} likes ${base.structure}`)
				}
			})
		})

	}
}