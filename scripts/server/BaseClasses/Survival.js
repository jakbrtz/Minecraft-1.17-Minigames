Survival = class extends this.Race {

	constructor() {
		super();
		this.DeathCoolDown = 10000000;
	}

	PlayerDiedExtension(player, killer) {
		if (player.finishTime < 0) {
			player.finishTime = this.elapsedGameTime;
			this.UpdateScore();
		}
	}

	GetScoreboardLine(player, index) {
		return { text: player.name, value: this.players.length - index };
	}
}