BridgesBaseSelection = class extends this.BaseSelection {

	constructor() {
		super()
		this.NextGame = new Bridges()
		this.choices = [
			{
				construct: base => SlashCommand(`/structure load ${base.structure} ${base.x - 14} 50 ${base.z - 14} ${SuggestedRotation(base)}_degrees`),
				radius: 14,
				additionalCheck: (base, player) => player.requestedBase != base.structure,
				onSelect: (base, player) => {
					player.requestedBase = base.structure
					Chat(`${player.name} likes ${base.structure}`)
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
		this.ClearWorld()
		SlashCommand(`/fill -64 64 -64 63 64 63 glass`)
	}

	RespawnOverride(player) {
		SlashCommand(`/tp ${player.name} ${RandomFloat(-10, 10)} 66 ${RandomFloat(-10, 10)}`)
	}
}