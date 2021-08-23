QuickRespawn = class extends this.BaseGame {

	constructor() {
		super()
	}

	SetupOverride() {
		this.players.forEach(player => {
			player.score = 0
		})
		this.ClearWorld()
		SlashCommand(`/fill -10 64 -10 10 64 10 concrete 14`)
		SlashCommand(`/gamemode survival @a`)
		this.StartGame()
	}

	StartGameOverride() {
		this.players.forEach(player => {
			this.Respawn(player.entity)
		})
		this.UpdateScore()
	}

	RespawnOverride(player) {
		SlashCommand(`/give ${player.name} diamond_sword`)
		SlashCommand(`/tp ${player.name} ${RandomFloat(-5, 5)} 66 ${RandomFloat(-5, 5)}`)
	}

	UpdateGameOverride() {
		if (this.elapsedGameTime % 20 == 0) {
			this.UpdateScore()
        }
	}

	PlayerDiedOverride(player, killer) {
		if (killer == undefined) return
		if (!this.players.has(killer.id)) return
		this.players.get(entity.id).score++
		this.UpdateScore()
	}

	IsGameInProgressOverride() {
		return this.elapsedGameTime < Globals.GameDuration
	}

	EndGameOverride() {
		this.UpdateScore()
		let bestScore = 1
		let bestPlayers = []
		this.players.forEach(player => {
			if (player.score > bestScore) {
				bestPlayers = [ player ]
				bestScore = player.score
			} else if (player.score == bestScore) {
				bestPlayers.push(player)
            }
		})
		var msg
		if (bestPlayers.length == 0) {
			msg = "No one won"
		} else if (bestPlayers.length == 1) {
			msg = `${bestPlayers[0].name} wins`
		} else if (bestPlayers.length == this.players.size) {
			msg = "Everyone wins!"
		} else {
			msg = "It's a tie between " + bestPlayers.map(player => player.name).join(" and ")
        }
		SlashCommand(`/title @a title ${msg}`)
		Chat(msg)
	}

	UpdateScore() {
		let lines = []
		this.players.forEach(player => {
			lines.push({
				text: player.name,
				value: player.score
			})
		})
		if (this.gameHasStarted) {
			lines.push(TicksToDuration(Globals.GameDuration - this.elapsedGameTime))
		}
		this.CreateScoreboard("Scores", lines)
	}
}