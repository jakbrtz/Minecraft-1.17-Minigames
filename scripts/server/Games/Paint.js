Paint = class extends this.Scored {

	constructor() {
		super()
		this.DeathCoolDown = 5 * 20
	}

	BuildWorld() {
		this.trackedBlocks = new ArrayMultiDimensional([41, 41], [-20, -20])
		SlashCommand(`/fill -20 64 -20 20 64 20 concrete 0`)
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${Random.Float(-5, 5)} 66 ${Random.Float(-5, 5)}`)
		SlashCommand(`/give ${player.name} filled_map`)
	}

	UpdateGameExtension() {

		if (this.GameIsComplete) return

		this.players.filter(player => player.deathTimer === -1).forEach(player => {
			const position = {
				x: Math.floor(player.position.x),
				y: Math.floor(player.position.y - 1),
				z: Math.floor(player.position.z)
			}
			if (this.trackedBlocks.IndicesInRange([position.x, position.z]) && position.y === 64) {
				const blockPlayer = this.trackedBlocks.Get([position.x, position.z])
				if (blockPlayer !== player) {
					this.trackedBlocks.Set([position.x, position.z], player)
					SlashCommand(`/setblock ${position.x} ${position.y} ${position.z} concrete ${player.team.colour}`)
					player.score++
					if (blockPlayer !== undefined) {
						blockPlayer.score--
					}
					this.UpdateScore()
				}
			}
		})

	}
}