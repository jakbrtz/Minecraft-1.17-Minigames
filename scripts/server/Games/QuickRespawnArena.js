QuickRespawn = class extends this.Scored {

	constructor(teams) {
		super();
		this.GroupScoreByTeam = teams;
		this.PvPMode = teams ? `teams` : `on`;
	}

	BuildWorld() {
		const platforms = ["arenas:nether", "arenas:oasis"];
		Command.Structure(Random.Arr(platforms), -16, 63, -16);
	}

	RespawnExtension(player) {
		Command.Give(player, "diamond_sword");
		Command.SpreadPlayers(0, 0, 5, 15, [player]);
	}

	PlayerDiedExtension(player, killer) {
		if (!this.GameIsComplete && killer !== undefined) {
			killer.score++;
			this.UpdateScore();
		}
	}
}