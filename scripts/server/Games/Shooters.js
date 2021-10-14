Shooters = class extends this.Survival {

	constructor() {
		super()
	}

	BuildWorld() {

		Command.Structure("shooters:barracks", -9, 64, -16, 0);
		Command.Structure("shooters:barracks", -9, 64, 14, 180);

		for (var i = -9; i <= 9; i += 6) {
			Command.Fill(i, 64, -9, i, 64, 9, "bone_block");
			Command.Fill(-9, 64, i, 9, 64, i, "bone_block");
		}

		for (var i = -6; i <= 6; i += 6) {
			Command.Summon("skeleton", i, 65, 15);
			Command.Summon("skeleton", i, 65, -15);
        }
	}

	RespawnExtension(player) {
		if (Random.Bool()) {
			Command.Teleport(player, (Random.Int(4) - 1.5) * 6, 66, Random.Float(-9, 9));
		} else {
			Command.Teleport(player, Random.Float(-9, 9), 66, (Random.Int(4) - 1.5) * 6);
		}
		Command.Effect(player, "resistance", 3, 15);
		Command.Effect(player, "invisibility", 3, 15, false);
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 40
	}
}