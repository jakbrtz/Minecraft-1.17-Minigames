KingOfTheHill = class extends this.ScoredGame {

	constructor() {
		super()
		this.GroupScoreByTeam = false
		this.DeathCoolDown = 5 * 20

		this.HighlightedPlayer = null
		this.size = 5
	}

	BuildWorld() {
		WorldBuilding.Clear()
		// todo
		SlashCommand(`/fill -20 64 -20 20 64 20 grass`)
		for (var i = 0; i < this.size; i++) {
			SlashCommand(`/fill ${i - this.size} ${65 + i} ${i - this.size} ${this.size - i} ${65 + i} ${this.size - i} stone`)
			SlashCommand(`/fill ${i - this.size} ${65 + i} ${i - this.size} ${this.size - i} ${65 + i} ${i - this.size} normal_stone_stairs 2`)
			SlashCommand(`/fill ${i - this.size} ${65 + i} ${i - this.size} ${i - this.size} ${65 + i} ${this.size - i} normal_stone_stairs 0`)
			SlashCommand(`/fill ${this.size - i} ${65 + i} ${this.size - i} ${i - this.size} ${65 + i} ${this.size - i} normal_stone_stairs 3`)
			SlashCommand(`/fill ${this.size - i} ${65 + i} ${this.size - i} ${this.size - i} ${65 + i} ${i - this.size} normal_stone_stairs 1`)
		}
		SlashCommand(`/setblock 0 ${65 + this.size} 0 stone_slab4 2`)
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

	UpdateGameExtension() {
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

	PlayerHasLeftStartArea(player) {
		return this.PositionOnHill(player.position)
	}

	PositionOnHill(position) {
		return Coordinates.PositionsAreClose(position, { x: 0, z: 0 }, this.size + 1, true)
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