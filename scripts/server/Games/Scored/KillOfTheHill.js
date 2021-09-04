KingOfTheHill = class extends this.BaseScoredGame {

	constructor() {
		super()
		this.GroupScoreByTeam = false
		this.DeathCoolDown = 5 * 20

		this.HighlightedPlayer = null
		this.hillSize = 5
	}

	BuildWorld() {
		WorldBuilding.Clear()
		// todo
		SlashCommand(`/fill -20 64 -20 20 64 20 grass`)
		for (var i = 0; i <= this.hillSize; i++) {
			SlashCommand(`/fill ${i - this.hillSize} ${65 + i} ${i - this.hillSize} ${this.hillSize - i} ${65 + i} ${this.hillSize - i} stone`)
        }
	}

	RespawnExtension(player) {
		var x
		var z
		do {
			x = Random.Float(-15, 15)
			z = Random.Float(-15, 15)
		} while (this.PositionOnHill({ x: x, z: z }))
		SlashCommand(`/tp ${player.name} ${x} 66 ${z}`)
	}

	UpdateGameExtensionExtension() {
		const previousHighlightedPlayer = this.HighlightedPlayer
		this.HighlightedPlayer = this.players.filter(player => player.deathTimer < 0 && this.PositionOnHill(player.position)).sort((a,b)=>a.position.y-b.position.y)[0]||null
		if (!this.GameIsComplete && this.elapsedGameTime % 20 === 0 && this.HighlightedPlayer !== null) {
			this.HighlightedPlayer.score++
		}
		if (previousHighlightedPlayer !== this.HighlightedPlayer) {
			if (this.HighlightedPlayer !== null) {
				Chat(`${this.HighlightedPlayer.name} rules the hill`)
			} else {
				Chat(`The hill has no ruler`)
			}
			this.UpdateScore()
        }
	}

	PositionOnHill(position) {
		return Coordinates.PositionsAreClose(position, { x: 0, z: 0 }, this.hillSize + 1, true)
    }

	AttemptRevivePlayerExtension(player) {
		SlashCommand(`/tp ${player.name} 0 80 0`)
	}

	MakeListOfScores() {
        return this.players.map(player => {
			return {
				name: (player === this.HighlightedPlayer ? '\u00a7c' : '') + player.name,
				score: player.score
			}
		})
	}
}