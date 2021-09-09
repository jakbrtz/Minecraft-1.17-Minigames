RaceOrSurvival = class extends this.Game {

	constructor() {
		super()
		this.IsRace = true
		this.GameMode = 'adventure'
		// IsRace in constructor
	}

	SetupExtension() {
		this.players.forEach(player => player.finishTime = -1)
		SlashCommand(`/effect @a regeneration 60 1 true`)
		if (!this.IsRace) this.DeathCoolDown = 10000000 //todo: what about end-game potion?
	}

	UpdateGameGeneral() {
		this.players.forEach(player => {
			if (player.finishTime < 0 && this.PlayerIsFinished(player)) {
				player.finishTime = this.elapsedGameTime
				this.UpdateScore()
			}
		})
	}

	PlayerIsFinished(player) {
		return false
	}

	PlayerDiedExtension(player, killer) {
		if (!this.IsRace && player.finishTime < 0) {
			player.finishTime = this.elapsedGameTime
			this.UpdateScore()
		}
	}

	IsGameInProgress() {
		return this.players.some(player => player.finishTime < 0)
	}

	UpdateScore() {
		const lines = this.players
			.filter(player => player.finishTime > 0)
			.sort((a, b) => (a.finishTime - b.finishTime))
			.map((player, i) => { return { text: player.name, value: this.IsRace ? i + 1 : this.players.length - i } })
		if (lines.length > 0) {
			Scoreboard.Create("Results", lines, true)
		} else {
			Scoreboard.Destroy()
        }
	}
}