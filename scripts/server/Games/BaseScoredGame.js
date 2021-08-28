BaseScoredGame = class extends this.BaseGame {

	constructor() {
		super()
		this.GroupScoreByTeam = true
	}

	SetupOverride() {
		this.BuildWorld()
		this.UpdateScore()
		this.StartGame()
	}

	BuildWorld() {

	}

	StartGameOverride() {

		GameController.Players.forEach(player => {
			this.Respawn(player.entity)
		})

		SlashCommand(`/gamemode survival @a`) //todo: sometimes adventure mode

		this.UpdateScore()
	}

	UpdateGameOverride() {

		if (this.elapsedGameTime % 20 == 0) {
			this.UpdateScore()
		}

		this.UpdateGameOverrideOverride()

	}

	UpdateGameOverrideOverride() {

    }

	IsGameInProgressOverride() {
		return this.elapsedGameTime < GameController.GameDuration
	}

	EndGameOverride() {
		this.UpdateScore()
		let bestScore = 1
		let domain = this.GroupScoreByTeam ? this.teams : GameController.Players
		let bestElements = []
		domain.forEach(element => {
			if (element.score > bestScore) {
				bestElements = [ element ]
				bestScore = element.score
			} else if (element.score == bestScore) {
				bestElements.push(element)
            }
		})
		var msg
		if (bestElements.length == 0) {
			msg = "No one won"
		} else if (bestElements.length == 1) {
			msg = `${PlayerOrTeamColourCodeFormat(bestElements[0])}${bestElements[0].name} wins`
		} else if (bestElements.length == domain.length) {
			msg = "Everyone wins!"
		} else {
			msg = "It's a tie between " + bestElements.map(element => `${PlayerOrTeamColourCodeFormat(element)}${element.name}\u00a7r`).join(" and ")
        }
		SlashCommand(`/title @a title ${msg}`)
		Chat(msg)
	}

	UpdateScore() {
		let domain = this.GroupScoreByTeam ? this.teams : GameController.Players
		let lines = []
		domain.forEach(element => {
			lines.push({
				text: PlayerOrTeamColourCodeFormat(element) + element.name,
				value: element.score
            })
		})
		if (this.gameHasStarted) {
			lines.push(TicksToDuration(GameController.GameDuration - this.elapsedGameTime))
		}
		this.CreateScoreboard("Scores", lines)
	}
}