BaseUntimedGame = class extends this.BaseGame {

	constructor() {
		super()
		this.GoalIsToFinishFast = true
	}

	SetupOverride() {

		this.BuildWorld()

		GameController.Players.forEach(player => {
			player.finishTime = -1
        })

		SlashCommand(`/gamemode adventure @a`)
		SlashCommand(`/effect @a regeneration 60 1 true`)
		SlashCommand(`/clear @a`)

		GameController.Players.forEach(player => {
			this.Respawn(player)
		})
	}

	BuildWorld() {

	}

	UpdateSetupOverride() {
		switch (this.elapsedGameTime) {
			case 0:
				SlashCommand(`/title @a title 3...`);
				if (Math.random() < 0.05) {
					SlashCommand(`/title @a actionbar ⚠ cross-teaming is bannable or whatever`)
				}
				break;
			case 20:
				SlashCommand(`/title @a title 2...`);
				break;
			case 40:
				SlashCommand(`/title @a title 1...`);
				break;
			case 60:
				SlashCommand(`/title @a clear`);
				this.StartGame()
				break;
		}
		GameController.Players.forEach(player => {
			if (this.PlayerIsOutOfBounds(player) || this.PlayerHasLeftStartArea(player)) {
				this.Respawn(player)
			}
		})
	}

	UpdateGameOverride() {
		GameController.Players.forEach(player => {
			if (this.PlayerIsOutOfBounds(player)) {
				this.Respawn(player)
			} else if (this.elapsedGameTime > 20 && player.finishTime == -1 && this.PlayerIsFinished(player)) {
				player.finishTime = this.elapsedGameTime
				this.UpdateScore()
			}
		})
		this.UpdateGameOverrideOverride()
	}

	PlayerIsFinished(player) {
		return false
	}

	PlayerIsOutOfBounds(player) {
		return false
	}

	PlayerHasLeftStartArea(player) {
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

		this.CreateScoreboard("Results", lines, true)
	}
}