Paint = class extends this.BaseScoredGame {

	constructor() {
		super()

		this.DeathCoolDown = 5 * 20
		this.trackedBlocks = new ArrayMultiDimensional([41, 41], [-20, -20])
	}

	BuildWorld() {
		this.ClearWorld()
		SlashCommand(`/fill -20 64 -20 20 64 20 concrete 0`)
	}

	RespawnOverride(player) {
		SlashCommand(`/tp ${player.name} ${RandomFloat(-5, 5)} 66 ${RandomFloat(-5, 5)}`)
		SlashCommand(`/give @a filled_map`)
	}

	UpdateGameOverrideOverride() {

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

	}

	AttemptRevivePlayerOverride(player) {
		SlashCommand(`/tp ${player.name} 0 100 0`)
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