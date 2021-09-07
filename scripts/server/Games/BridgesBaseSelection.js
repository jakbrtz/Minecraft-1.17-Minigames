BridgesBaseSelection = class extends this.Selection {

	constructor() {
		super()
		this.GameMode = 'creative'
	}

	GetChoices() {
		return [
			{
				construct: base => SlashCommand(`/structure load ${base.structure} ${base.x - 14} 50 ${base.z - 14} ${Coordinates.SuggestRotation(base)}_degrees`),
				radius: 14,
				additionalCheck: (base, player) => player.requestedBase !== base.structure,
				onSelect: (base, player) => {
					player.requestedBase = base.structure
					Chat(`${player.name} likes ${base.structure.split(':')[1]}`)
				},
				options: [
					{ x: 32, z: 0, structure: "bases:Amethyst" },
					{ x: 0, z: -32, structure: "bases:GoldBlocks" },
					{ x: -32, z: 0, structure: "bases:Mud" },
					{ x: 0, z: 32, structure: "bases:Temple" },
					{ x: 32, z: 32, structure: "bases:EndIslands" },
				]
			}
		]
	}

	BuildWorldWithoutOptions() {
		WorldBuilding.Clear()
		SlashCommand(`/fill -64 64 -64 63 64 63 glass`)
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${Random.Float(-10, 10)} 66 ${Random.Float(-10, 10)}`)
	}

	NextGame() {
		return new Bridges()
    }
}