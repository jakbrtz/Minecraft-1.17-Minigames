KingOfTheHill = class extends this.Scored {

	constructor() {
		super();
		this.GroupScoreByTeam = false;
		this.PvPMode = `on`;
		this.DeathCoolDown = 5 * 20;

		this.HighlightedPlayer = null;
		this.size = 5;
	}

	BuildWorld() {
		Command.Fill(-20, 64, -20, 20, 64, 20, "grass");
		for (let i = 0; i < this.size; i++) {
			Command.Fill(i - this.size, 65 + i, i - this.size, this.size - i, 65 + i, this.size - i, "stone");
			Command.Fill(i - this.size, 65 + i, i - this.size, this.size - i, 65 + i, i - this.size, "normal_stone_stairs 2");
			Command.Fill(i - this.size, 65 + i, i - this.size, i - this.size, 65 + i, this.size - i, "normal_stone_stairs 0");
			Command.Fill(this.size - i, 65 + i, this.size - i, i - this.size, 65 + i, this.size - i, "normal_stone_stairs 3");
			Command.Fill(this.size - i, 65 + i, this.size - i, this.size - i, 65 + i, i - this.size, "normal_stone_stairs 1");
		}
		Command.SetBlock(0, 65 + this.size, 0, "stone_slab4 2");
	}

	RespawnExtension(player) {
		let x;
		let z;
		do {
			x = Random.Float(-15, 15);
			z = Random.Float(-15, 15);
		} while (this.PositionOnHill({ x: x, z: z }));
		Command.Teleport(player, x, 66, z);
	}

	UpdateGameExtension() {
		const previousHighlightedPlayer = this.HighlightedPlayer;
		this.HighlightedPlayer = this.players.filter(player => player.deathTimer < 0 && this.PositionOnHill(player.position)).sort((a, b) => b.position.y - a.position.y)[0] || null;
		if (!this.GameIsComplete && this.elapsedGameTime % 20 === 0 && this.HighlightedPlayer !== null) {
			this.HighlightedPlayer.score++;
		}
		if (previousHighlightedPlayer !== this.HighlightedPlayer) {
			this.UpdateScore();
		}
	}

	PlayerHasLeftStartArea(player) {
		return this.PositionOnHill(player.position);
	}

	PositionOnHill(position) {
		return Coordinates.PositionsAreClose(position, { x: 0, z: 0 }, this.size + 1, true);
    }

	MakeListOfScores() {
        return this.players.map(player => {
			return {
				name: (player === this.HighlightedPlayer ? '\u00a7c' : '') + player.name,
				score: player.score
			};
		})
	}
}