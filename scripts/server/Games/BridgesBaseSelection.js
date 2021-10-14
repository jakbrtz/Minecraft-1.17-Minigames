BridgesBaseSelection = class extends this.Selection {

	constructor() {
		super()
		this.GameMode = 'creative'
	}

	GetChoices() {
		return [
			{
				construct: base => Command.Structure(base.structure, base.x - 14, 50, base.z - 14, Coordinates.SuggestRotation(base)),
				radius: 14,
				additionalCheck: (base, player) => player.requestedBase !== base.structure,
				onSelect: (base, player) => {
					player.requestedBase = base.structure
					Command.Tell(player, `You have chosen ${base.structure.substring(base.structure.lastIndexOf(':') + 1)}`);
				},
				options: [
					{ x: 32, z: 0, structure: "bridges:Amethyst" },
					{ x: 0, z: -32, structure: "bridges:GoldBlocks" },
					{ x: -32, z: 0, structure: "bridges:Mud" },
					{ x: 0, z: 32, structure: "bridges:Temple" },
					{ x: 32, z: 32, structure: "bridges:Monument" },
					{ x: -32, z: -32, structure: "bridges:Mill" },
				]
			}
		]
	}

	BuildWorld() {
		Command.Fill(-64, 64, -64, 63, 64, 63, "glass");
	}

	RespawnExtension(player) {
		Command.Teleport(player, Random.Float(-10, 10), 66, Random.Float(-10, 10));
	}

	IsGameInProgress() {
		return false
	}

	NextGame() {
		return new Bridges()
    }
}