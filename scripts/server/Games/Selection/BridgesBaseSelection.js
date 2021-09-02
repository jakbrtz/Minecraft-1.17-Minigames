BridgesBaseSelection = class extends this.BaseSelection {

	constructor() {
		super()
	}

	GetChoices() {
		return [
			{
				construct: base => SlashCommand(`/structure load ${base.structure} ${base.x - 14} 50 ${base.z - 14} ${SuggestedRotation(base)}_degrees`),
				radius: 14,
				additionalCheck: (base, player) => player.requestedBase != base.structure,
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
		ClearWorld()
		SlashCommand(`/fill -64 64 -64 63 64 63 glass`)
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${RandomFloat(-10, 10)} 66 ${RandomFloat(-10, 10)}`)
	}

	NextGame() {
		return new Bridges()
    }
}