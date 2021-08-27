Paint = class extends this.BaseGame {

	constructor() {
		super()

		this.teams = []
		this.DeathCoolDown = 5 * 20
		this.trackedBlocks = new ArrayMultiDimensional([41, 41], [-20, -20])
	}

	SetupOverride() {
		this.UpdateScore()
		GameController.Players.forEach(player => {
			this.CreateTeamIfItDoesntExist(player.team)
		})
		this.StartGame()
	}

	CreateTeamIfItDoesntExist(team) {
		for (var i = 0; i < this.teams.length; i++) {
			if (this.teams[i] == team) {
				return
            }
        }
		this.teams.push(team)
    }

	StartGameOverride() {

		this.ClearWorld()

		SlashCommand(`/fill -20 64 -20 20 64 20 concrete 0`)

		GameController.Players.forEach(player => {
			this.Respawn(player.entity)
		})

		SlashCommand(`/gamemode adventure @a`)

		this.UpdateScore()
	}

	RespawnOverride(player) {
		SlashCommand(`/tp ${player.name} ${RandomFloat(-5, 5)} 66 ${RandomFloat(-5, 5)}`)
	}

	UpdateGameOverride() {

		if (this.elapsedGameTime < 20) return

		GameController.Players.forEach(player => {
			if (player.deathTimer == -1) {
				let position = {
					x: Math.floor(player.position.x),
					y: Math.floor(player.position.y - 1),
					z: Math.floor(player.position.z)
				}
				if (this.trackedBlocks.IndicesInRange([position.x, position.z]) && position.y == 64) {
					let blockTeam = this.trackedBlocks.Get([position.x, position.z])
					if (blockTeam != player.team) {
						this.trackedBlocks.Set([position.x, position.z], player.team)
						SlashCommand(`/setblock ${position.x} ${position.y} ${position.z} concrete ${player.team.colour}`)
						player.team.score++
						if (blockTeam != undefined) {
							blockTeam.score--
						}
						this.UpdateScore()
					}
				}
            }
        })

		if (this.elapsedGameTime % 20 == 0) {
			this.UpdateScore()
        }

	}

	AttemptRevivePlayerOverride(player) {
		SlashCommand(`/tp ${player.name} 0 100 0`)
	}

	IsGameInProgressOverride() {
		return this.elapsedGameTime < GameController.GameDuration
	}

	EndGameOverride() {
		this.UpdateScore()
		let bestScore = 1
		let bestTeams = []
		this.teams.forEach(team => {
			if (team.score > bestScore) {
				bestTeams = [ team ]
				bestScore = team.score
			} else if (team.score == bestScore) {
				bestTeams.push(team)
            }
		})
		var msg
		if (bestTeams.length == 0) {
			msg = "No one won"
		} else if (bestTeams.length == 1) {
			msg = `${NumberToColour(bestTeams[0].colour)}${bestTeams[0].name} wins`
		} else if (bestTeams.length == this.teams.length) {
			msg = "Everyone wins!"
		} else {
			msg = "It's a tie between " + bestTeams.map(team => `${NumberToColour(team.colour)}${team.name}\u00a7r`).join(" and ")
        }
		SlashCommand(`/title @a title ${msg}`)
		Chat(msg)
		SlashCommand(`/give @a filled_map`)
	}

	UpdateScore() {
		let lines = []
		this.teams.forEach(team => {
			lines.push({
				text: NumberToColour(team.colour) + team.name,
				value: team.score
            })
		})
		if (this.gameHasStarted) {
			lines.push(TicksToDuration(GameController.GameDuration - this.elapsedGameTime))
		}
		this.CreateScoreboard("Scores", lines)
	}
}