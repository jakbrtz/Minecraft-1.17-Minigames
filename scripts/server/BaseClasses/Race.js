Race = class extends this.Game {

	constructor(endWhenOneRemains) {
		super()
		this.EndWhenOneRemains = endWhenOneRemains
	}

	AddPlayerGeneral(player) {
		player.finishTime = -1
		SlashCommand(`/effect ${player.name} regeneration 60 1 true`)
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