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
		SlashCommand(`/give ${player.name} filled_map`)
	}

	UpdateGameOverrideOverride() {

		this.players.filter(player => player.deathTimer == -1).forEach(player => {
			let position = {
				x: Math.floor(player.position.x),
				y: Math.floor(player.position.y - 1),
				z: Math.floor(player.position.z)
			}
			if (this.trackedBlocks.IndicesInRange([position.x, position.z]) && position.y == 64) {
				let blockPlayer = this.trackedBlocks.Get([position.x, position.z])
				if (blockPlayer != player.team) {
					this.trackedBlocks.Set([position.x, position.z], player)
					SlashCommand(`/setblock ${position.x} ${position.y} ${position.z} concrete ${player.team.colour}`)
					player.score++
					if (blockPlayer != undefined) {
						blockPlayer.score--
					}
					this.UpdateScore()
				}
			}
		})

	}

	AttemptRevivePlayerOverride(player) {
		SlashCommand(`/tp ${player.name} 0 100 0`)
	}
}