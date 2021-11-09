SlimeWall = class extends this.Survival {

	constructor() {
		super();
		this.EndWhenOneRemains = true;
	}

	BuildWorld() {
		Command.Fill(-3, 64, -3, 3, 64, 3, "obsidian");
		Command.Fill(-1, 64, -1, 1, 64, 1, "air");
	}

	RespawnExtension(player) {
		let x;
		let z;
		do {
			x = Random.Float(-3, 3);
			z = Random.Float(-3, 3);
		} while (x > -1 && x < 1 && z > -1 && z < 1);
		Command.Teleport(player, x, 66, z);
	}

	UpdateGameExtension() {

		if (this.elapsedGameTime % 100 === 0) {
			Command.Fill(-3, 65, 10, 3, 67, 10, "air");
			Command.Structure("slimewall:wall" + Random.Int(1, 9), -3, 65, -10);
		}
		if (this.elapsedGameTime % 5 === 0) {
			Command.SetBlock(0, 67, (this.elapsedGameTime % 100) / 5 - 11, "piston 2");
			Command.SetBlock(0, 67, (this.elapsedGameTime % 100) / 5 - 12, "redstone_block");
		} else if (this.elapsedGameTime % 5 === 4) {
			Command.SetBlock(0, 67, (this.elapsedGameTime % 100) / 5 - 11, "air");
			Command.SetBlock(0, 67, (this.elapsedGameTime % 100) / 5 - 12, "air");
		}
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 40;
	}
}