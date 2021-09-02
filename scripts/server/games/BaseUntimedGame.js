BaseUntimedGame = class extends this.BaseGame {

	constructor() {
		super()
		this.GoalIsToFinishFast = true
		this.GameMode = 'adventure'
	}

	SetupExtension() {
		this.players.forEach(player => player.finishTime = -1)
		SlashCommand(`/effect @a regeneration 60 1 true`)
	}

	UpdateGameExtension() {
		this.players.forEach(player => {
			if (player.finishTime == -1 && this.PlayerIsFinished(player)) {
				player.finishTime = this.elapsedGameTime
				this.UpdateScore()
			}
		})
		this.UpdateGameExtensionExtension()
	}

	PlayerIsFinished(player) {
		return false
	}

	UpdateGameExtensionExtension() {
	}

	IsGameInProgress() {
		return this.players.some(player => player.finishTime == -1)
	}

	UpdateScore() {

		let finishedPlayers = this.players
			.filter(player => player.finishTime != -1)
			.sort((a, b) => (a.finishTime - b.finishTime))

		let lines = []

		for (var i = 0; i < finishedPlayers.length; i++) {
			lines.push({ text: finishedPlayers[i].name, value: this.GoalIsToFinishFast ? i + 1 : this.players.length - i })
		}

		if (lines.length > 0) {
			this.CreateScoreboard("Results", lines, true)
		} else {
			this.DestroyScoreboard()
        }

	}
}