Race = class extends this.Game {

	constructor() {
		super();
		this.EndWhenOneRemains = false;
		this.FinishedPlayers = [];
	}

	AddPlayerGeneral(player) {
		this.FinishedPlayers = this.FinishedPlayers.filter(p => p !== player);
	}

	UpdateGameGeneral() {
		const remainingPlayers = this.players.filter(player => !this.FinishedPlayers.includes(player));
		remainingPlayers.forEach(player => {
			if (this.PlayerIsFinished(player) || (this.EndWhenOneRemains && remainingPlayers.length === 1)) {
				this.FinishedPlayers.push(player);
				this.UpdateScore();
			}
		})
	}

	PlayerIsFinished(player) {
		return false;
	}

	IsGameInProgress() {
		return this.players.some(player => !this.FinishedPlayers.includes(player));
	}

	UpdateScore() {
		const lines = this.FinishedPlayers
			.map((player, i) => this.GetScoreboardLine(player, i));
		if (lines.length > 0) {
			Scoreboard.Create("Results", lines, true);
		} else {
			Scoreboard.Destroy();
        }
	}

	GetScoreboardLine(player, index) {
		return { text: player.name, value: index + 1 };
	}
}