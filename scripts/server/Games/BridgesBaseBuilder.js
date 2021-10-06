BridgesBaseBuilder = class extends this.Selection {

	constructor() {
		super()
		this.GameMode = 'creative'
	}

	PlaceStructure(structure, position) {
		SlashCommand(`/structure load ${structure} ${position.x - 14} 50 ${position.z - 14}`)
    }

	GetChoices() {
		return [
			{
				construct: slot => this.PlaceStructure(slot.structure, slot),
				radius: 14,
				additionalCheck: (slot, player) => player.requestedBase !== slot.structure,
				onSelect: (slot, player) => {
					player.requestedBase = slot.structure
					SlashCommand(`/tell ${player.name} you are working in ${slot.structure}`)
				},
				options: [
					{ x: 32, z: 0, structure: `slot0` },
					{ x: -32, z: 0, structure: `slot1` },
					{ x: 0, z: 32, structure: `slot2` },
					{ x: 0, z: -32, structure: `slot3` },
					{ x: 32, z: 32, structure: `slot4` },
					{ x: -32, z: -32, structure: `slot5` },
					{ x: 32, z: -32, structure: `slot6` },
					{ x: -32, z: 32, structure: `slot7` },
				]
			}
		]
	}

	BuildWorld() {
		SlashCommand(`/fill -64 64 -64 63 64 63 glass`)
		this.choices[0].options.forEach(slot => this.PlaceStructure(`bridges:Basic`, slot))
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${Random.Float(-10, 10)} 66 ${Random.Float(-10, 10)}`)
		SlashCommand(`/give ${player.name} concrete 1 12`)
		SlashCommand(`/give ${player.name} potato`)
		player.requestedBase = undefined
	}

	UseItemExtension(player, item) {
		if (item === "minecraft:potato") {
			const slot = this.choices[0].options.find(opt => opt.structure === player.requestedBase)
			if (slot) {
				SlashCommand(`/structure save ${slot.structure} ${slot.x - 14} 50 ${slot.z - 14} ${slot.x + 14} 110 ${slot.z + 14} disk`)
				SlashCommand(`/tell ${player.name} ${slot.structure} has been saved`)
			}
		}
	}

	IsGameInProgress() {
		return false
	}

	NextGame() {
		return new BridgesBaseSelection()
	}
}