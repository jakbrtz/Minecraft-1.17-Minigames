SlimeWall = class extends this.Survival {

	constructor() {
		super();
		this.EndWhenOneRemains = true;
	}

	BuildWorld() {
		Command.Fill(-3, 64, -3, 3, 64, 3, "obsidian");
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

		const direction = Math.floor(this.elapsedGameTime / 100) % 4;
		const distanceTravelled = Math.floor((this.elapsedGameTime % 100) / 5) - 10;

		if (this.elapsedGameTime % 100 === 0) {
			const wall = "slimewall:wall" + Random.Int(1, 9);
			switch (direction) {
				case 0:
					Command.Fill(-10, 65, -3, -10, 67, 3, "air");
					Command.Structure(wall, -3, 65, distanceTravelled);
					break;
				case 1:
					Command.Fill(-3, 65, 10, 3, 67, 10, "air");
					Command.Structure(wall, distanceTravelled, 65, -3, 90);
					break;
				case 2:
					Command.Fill(10, 65, -3, 10, 67, 3, "air");
					Command.Structure(wall, -3, 65, -distanceTravelled);
					break;
				case 3:
					Command.Fill(-3, 65, -10, 3, 67, -10, "air");
					Command.Structure(wall, -distanceTravelled, 65, -3, 90);
					break;
            }
		}
		if (this.elapsedGameTime % 5 === 0) {
			switch (direction) {
				case 0:
					Command.SetBlock(0, 67, distanceTravelled - 1, "piston 2");
					Command.SetBlock(0, 67, distanceTravelled - 2, "redstone_block");
					break;
				case 1:
					Command.SetBlock(distanceTravelled - 1, 67, 0, "piston 4");
					Command.SetBlock(distanceTravelled - 2, 67, 0, "redstone_block");
					break;
				case 2:
					Command.SetBlock(0, 67, 1 - distanceTravelled, "piston 3");
					Command.SetBlock(0, 67, 2 - distanceTravelled, "redstone_block");
					break;
				case 3:
					Command.SetBlock(1 - distanceTravelled, 67, 0, "piston 5");
					Command.SetBlock(2 - distanceTravelled, 67, 0, "redstone_block");
					break;
            }
		} else if (this.elapsedGameTime % 5 === 4) {
			switch (direction) {
				case 0:
					Command.SetBlock(0, 67, distanceTravelled - 1, "air");
					Command.SetBlock(0, 67, distanceTravelled - 2, "air");
					break;
				case 1:
					Command.SetBlock(distanceTravelled - 1, 67, 0, "air");
					Command.SetBlock(distanceTravelled - 2, 67, 0, "air");
					break;
				case 2:
					Command.SetBlock(0, 67, 1 - distanceTravelled, "air");
					Command.SetBlock(0, 67, 2 - distanceTravelled, "air");
					break;
				case 3:
					Command.SetBlock(1 - distanceTravelled, 67, 0, "air");
					Command.SetBlock(2 - distanceTravelled, 67, 0, "air");
					break;
            }
		}
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 40;
	}
}