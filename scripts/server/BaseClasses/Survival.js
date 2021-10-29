Survival = class extends this.Race {

	constructor() {
		super();
		this.DeathCoolDown = 10000000;
	}

	PlayerDiedExtension(player, killer) {
		if (!this.FinishedPlayers.includes(player)) {
			this.FinishedPlayers.push(player);
			this.UpdateScore();
		}
	}

	GetScoreboardLine(player, index) {
		const numberOfPlayers = this.players.length +
			this.FinishedPlayers.filter(player => !this.players.includes(player)).length;
		return { text: player.name, value: numberOfPlayers - index };
	}
}