Race = class extends this.Game {

	constructor() {
		super()
		this.EndWhenOneRemains = false
	}

	AddPlayerGeneral(player) {
		player.finishTime = -1
	}

	UpdateGameGeneral() {
		const remainingPlayers = this.players.filter(player => player.finishTime < 0)
		remainingPlayers.forEach(player => {
			if (this.PlayerIsFinished(player) || (this.EndWhenOneRemains && remainingPlayers.length === 1)) {
				player.finishTime = this.elapsedGameTime
				this.UpdateScore()
			}
		})
	}

	PlayerIsFinished(player) {
		return false
	}

	IsGameInProgress() {
		return this.players.some(player => player.finishTime < 0)
	}

	UpdateScore() {
		const lines = this.players
			.filter(player => player.finishTime > 0)
			.sort((a, b) => (a.finishTime - b.finishTime))
			.map((player, i) => this.GetScoreboardLine(player, i))
		if (lines.length > 0) {
			Scoreboard.Create("Results", lines, true)
		} else {
			Scoreboard.Destroy()
        }
	}

	GetScoreboardLine(player, index) {
		return { text: player.name, value: index + 1 }
	}
}