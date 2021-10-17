BombsAway = class extends this.Survival {

	constructor(timeBetweenBombs) {
		super();
		this.TimeBetweenBombs = timeBetweenBombs;
	}

	BuildWorld() {
		Command.Fill(-15, 64, -15, 15, 64, 15, "bedrock");
	}

	RespawnExtension(player) {
		Command.Teleport(player, Random.Float(-13, 13), 66, Random.Float(-13, 13));
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 40;
	}

	UpdateGameExtension() {
		if (this.elapsedGameTime % this.TimeBetweenBombs === 0) {
			Command.Summon("tnt", Random.Float(-15, 15), 70, Random.Float(-15, 15));
        }
	}
}