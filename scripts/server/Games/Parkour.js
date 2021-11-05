Parkour = class extends this.Race {

	constructor() {
		super();
		this.PvPEnabled = false;

		this.checkPoints = [
			{ x: -16, z: -16 },
			{ x: 16, z: -16 },
			{ x: 16, z: 16 },
			{ x: -16, z: 16 },
		];
	}

	BuildWorld() {

		let order = [];
		for (let i = 0; i < 9; i++) {
			order.push(`parkour:parkour${i}`)
		};
		Random.Shuffle(order);

		Command.Fill(-22, 64, -22, -11, 64, -11, "concrete 1");
		Command.Fill( 21, 64, -22,  10, 64, -11, "concrete 1");
		Command.Fill(-22, 64,  21, -11, 64,  10, "concrete 1");
		Command.Fill( 21, 64,  21,  10, 64,  10, "concrete 1");

		Command.Structure(order[0], -10, 61, -21,   0);
		Command.Structure(order[1],  11, 61, -10,  90);
		Command.Structure(order[2], -10, 61,  11, 180);
		Command.Structure(order[3], -21, 61, -10, 270);
	}

	AddPlayerExtension(player) {
		player.checkPoint = 0;
	}

	RespawnExtension(player) {
		const x = this.checkPoints[player.checkPoint % 4].x + Random.Float(-3, 3);
		const z = this.checkPoints[player.checkPoint % 4].z + Random.Float(-3, 3);
		const facingX = this.checkPoints[(player.checkPoint + 1) % 4].x;
		const facingZ = this.checkPoints[(player.checkPoint + 1) % 4].z;
		Command.Teleport(player, x, 66, z, facingX, 66, facingZ);
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 50;
	}

	PlayerHasLeftStartArea(player) {
		return !Coordinates.PositionsAreClose(player.position, this.checkPoints[0], 6, true);
	}

	PlayerIsFinished(player) {
		return player.checkPoint >= 4;
	}

	UpdateGameExtension() {

		this.players.forEach(player => {
			if (player.position.y > 64 && Coordinates.PositionsAreClose(player.position, this.checkPoints[(player.checkPoint + 1) % 4], 6, true)) {
				player.checkPoint++;
				Command.Say(`${player.name} has reached \u00a7bcheckpoint ${player.checkPoint}!`);
            }
		})

	}
}