InverseTag = class extends this.Scored {

	constructor() {
		super()
		this.GroupScoreByTeam = false
		this.DeathCoolDown = 2 * 20

		this.HighlightedPlayer = null
	}

	BuildWorld() {
		WorldBuilding.Clear()
		const platforms = ["arenas:nether", "arenas:oasis"]
		SlashCommand(`/structure load ${Random.Arr(platforms)} -16 63 -16`)
	}

	RespawnExtension(player) {
		SlashCommand(`/spreadplayers 0 0 5 15 ${player.name}`)
		if (this.HighlightedPlayerNeedsReplacing()) {
			this.SetHighlightedPlayer(player)
		}
	}

	UpdateGameExtension() {
		if (this.HighlightedPlayerNeedsReplacing()) {
			this.SetHighlightedPlayer(Random.Arr(this.players))
		}
		if (!this.GameIsComplete && this.elapsedGameTime % 20 === 0) {
			this.HighlightedPlayer.score++
		}
	}

	EntityAttack(attacker, target) {
		if (target === this.HighlightedPlayer) {
			this.SetHighlightedPlayer(attacker)
        }
	}

	HighlightedPlayerNeedsReplacing() {
		return this.HighlightedPlayer === null || this.HighlightedPlayer.deathTimer !== -1 || !this.players.includes(this.HighlightedPlayer)
    }

	SetHighlightedPlayer(player) {
		if (this.HighlightedPlayer) {
			SlashCommand(`/clear ${this.HighlightedPlayer.name}`)
		}
		SlashCommand(`/replaceitem entity ${player.name} slot.armor.chest 0 diamond_chestplate 1 0`)
		this.HighlightedPlayer = player
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