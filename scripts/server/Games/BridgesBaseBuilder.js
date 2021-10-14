BridgesBaseBuilder = class extends this.Selection {

	constructor() {
		super()
		this.GameMode = 'creative'
	}

	PlaceStructure(structure, position) {
		Command.Structure(structure, position.x - 14, 50, position.z - 14);
    }

	GetChoices() {
		return [
			{
				construct: slot => this.PlaceStructure(slot.structure, slot),
				radius: 14,
				additionalCheck: (slot, player) => player.requestedBase !== slot.structure,
				onSelect: (slot, player) => {
					player.requestedBase = slot.structure
					Command.Tell(player, `You are working in ${slot.structure}`);
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
		Command.Fill(-64, 64, -64, 63, 64, 63, "glass");
		this.choices[0].options.forEach(slot => this.PlaceStructure(`bridges:Basic`, slot))
	}

	RespawnExtension(player) {
		Command.Teleport(player, Random.Float(-10, 10), 66, Random.Float(-10, 10));
		Command.Give(player, "concrete", 1, 12);
		Command.Give(player, "potato");
		player.requestedBase = undefined
	}

	UseItemExtension(player, item) {
		if (item === "minecraft:potato") {
			const slot = this.choices[0].options.find(opt => opt.structure === player.requestedBase)
			if (slot) {
				Command.StructureSave(slot.structure, slot.x - 14, 50, slot.z - 14, slot.x + 14, 110, slot.z + 14, "disk");
				Command.Tell(player, `${slot.structure} has been saved`);
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