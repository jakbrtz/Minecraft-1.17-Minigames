BaseRacingGame = class extends this.BaseGame {

	constructor() {
		super()

		this.winners = []
	}

	SetupOverride() {

		SlashCommand(`/clear @a`)
		SlashCommand(`/gamemode adventure @a`)
		this.BuildWorld()
		this.StartGame()
	}

	BuildWorld() {

    }

	StartGameOverride() {

	}

	RespawnOverride(player) {

	}

	IsGameInProgressOverride() {
		return this.winners.length < this.players.size
	}

	UpdateGameOverride() {
		this.players.forEach(player => {
			if (this.elapsedGameTime > 20 && this.PlayerIsAtEnd(player) && !this.winners.includes(player)) {
				this.winners.push(player)
				this.UpdateScore()
            }
        })
	}

	UpdateScore() {
		let lines = []
		for (var i = 0; i < this.winners.length; i++) {
			lines.push({ text: this.winners[i].name, value: i + 1 })
		}
		this.CreateScoreboard("Results", lines)
	}
}