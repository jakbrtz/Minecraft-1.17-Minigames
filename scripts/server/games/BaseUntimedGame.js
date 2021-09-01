BaseUntimedGame = class extends this.BaseGame {

	constructor() {
		super()
		this.GoalIsToFinishFast = true
		this.GameMode = 'adventure'
	}

	SetupOverride() {
		GameController.Players.forEach(player => {
			player.finishTime = -1
		})
		SlashCommand(`/effect @a regeneration 60 1 true`)
	}

	UpdateGameOverride() {
		GameController.Players.forEach(player => {
			if (player.finishTime == -1 && this.PlayerIsFinished(player)) {
				player.finishTime = this.elapsedGameTime
				this.UpdateScore()
			}
		})
		this.UpdateGameOverrideOverride()
	}

	PlayerIsFinished(player) {
		return false
	}

	UpdateGameOverrideOverride() {
	}

	IsGameInProgress() {
		return this.AnyPlayerIs(player => player.finishTime == -1)
	}

	UpdateScore() {

		let finishedPlayers = [...GameController.Players.values()]
			.filter(player => player.finishTime != -1)
			.sort((a, b) => (a.finishTime - b.finishTime))

		let lines = []

		for (var i = 0; i < finishedPlayers.length; i++) {
			lines.push({ text: finishedPlayers[i].name, value: this.GoalIsToFinishFast ? i + 1 : GameController.Players.size - i })
		}

		if (lines.length > 0) {
			this.CreateScoreboard("Results", lines, true)
		} else {
			this.DestroyScoreboard()
        }

		
	}
}