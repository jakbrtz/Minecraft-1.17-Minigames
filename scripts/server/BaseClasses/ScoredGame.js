ScoredGame = class extends this.Game {

	constructor() {
		super()
		this.DefaultGameDuration = 60 * 20
		this.GroupScoreByTeam = true
		this.PvPgroupedByTeams = this.GroupScoreByTeam
	}

	SetupExtension() {
		this.players.forEach(player => player.score = 0)
	}

	UpdateGameGeneral() {
		if (this.elapsedGameTime % 20 === 0) {
			this.UpdateScore()
		}
	}

	RemainingTime() {
		let totalTime = GameController.GameDuration || this.DefaultGameDuration
		if (this.elapsedGameTime > totalTime) {
			return 0
		}
		if (this.elapsedGameTime > 0) {
			return totalTime - this.elapsedGameTime
		}
		return totalTime
    }

	IsGameInProgress() {
		return this.RemainingTime() > 0
	}

	MakeListOfScores() {
		if (!this.GroupScoreByTeam) {
			return this.players
		}
		const list = this.teams.map(team => { return {
			ref: team,
			name: Scoreboard.NumberToColour(team.colour) + team.name,
			score: 0
		}})
		this.players.forEach(player => {
			list.filter(item => item.ref === player.team).forEach(item => item.score += player.score)
		})
		return list
    }

	EndGameExtension() {
		this.UpdateScore()
		const domain = this.MakeListOfScores()
		let bestScore = 1
		let bestElements = []
		domain.forEach(element => {
			if (element.score > bestScore) {
				bestElements = [ element ]
				bestScore = element.score
			} else if (element.score === bestScore) {
				bestElements.push(element)
            }
		})
		var msg
		if (bestElements.length === 0) {
			msg = "No one won"
		} else if (bestElements.length === 1) {
			msg = `${bestElements[0].name} wins`
		} else if (bestElements.length === domain.length) {
			msg = "Everyone wins!"
		} else {
			msg = bestElements.map(element => `${element.name}\u00a7r`).join(" and ") + " wins"
        }
		SlashCommand(`/title @a title ${msg}`)
		Chat(msg)
	}

	UpdateScore() {
		const lines = this.MakeListOfScores().map(element => { return {
			text: element.name,
			value: element.score
        }})
		lines.push(Scoreboard.TicksToDuration(this.RemainingTime()))
		Scoreboard.Create("Scores", lines)
	}
}