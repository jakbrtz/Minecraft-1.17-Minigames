BaseScoredGame = class extends this.BaseGame {

	constructor() {
		super()
		this.GroupScoreByTeam = true
		this.PvPgroupedByTeams = this.GroupScoreByTeam
	}

	UpdateGameOverride() {

		if (this.elapsedGameTime % 20 == 0) {
			this.UpdateScore()
		}

		this.UpdateGameOverrideOverride()

	}

	UpdateGameOverrideOverride() {

    }

	IsGameInProgress() {
		return this.elapsedGameTime < GameController.GameDuration
	}

	MakeListOfScores() {
		if (!this.GroupScoreByTeam) {
			return Array.from(GameController.Players.values())
		}
		let list = this.teams.map(team => { return {
			ref: team,
			name: NumberToColour(team.colour) + team.name,
			score: 0
		}})
		GameController.Players.forEach(player => {
			list.filter(item => item.ref == player.team).forEach(item => item.score += player.score)
		})
		return list
    }

	EndGameOverride() {
		this.UpdateScore()
		let bestScore = 1
		let domain = this.MakeListOfScores()
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
			msg = `${bestElements[0].name} wins`
		} else if (bestElements.length == domain.length) {
			msg = "Everyone wins!"
		} else {
			msg = bestElements.map(element => `${element.name}\u00a7r`).join(" and ") + " wins"
        }
		SlashCommand(`/title @a title ${msg}`)
		Chat(msg)
	}

	UpdateScore() {
		let lines = this.MakeListOfScores().map(element => { return {
			text: element.name,
			value: element.score
        }})
		let remainingTime = GameController.GameDuration - this.elapsedGameTime
		if (remainingTime < 0) remainingTime = 0
		if (remainingTime > GameController.GameDuration) remainingTime = GameController.GameDuration
		lines.push(TicksToDuration(remainingTime))
		this.CreateScoreboard("Scores", lines)
	}
}