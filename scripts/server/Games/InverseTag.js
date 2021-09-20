InverseTag = class extends this.ScoredGame {

	constructor() {
		super()
		this.GroupScoreByTeam = false
		this.DeathCoolDown = 2 * 20

		this.HighlightedPlayer = null
	}

	BuildWorld() {
		WorldBuilding.Clear()
		const platforms = ["arenas:desert", "arenas:house", "arenas:nether", "arenas:planks"]
		SlashCommand(`/structure load ${Random.Arr(platforms)} -16 63 -16   0_degrees`)
		SlashCommand(`/structure load ${Random.Arr(platforms)}   0 63 -16  90_degrees`)
		SlashCommand(`/structure load ${Random.Arr(platforms)}   0 63   0 180_degrees`)
		SlashCommand(`/structure load ${Random.Arr(platforms)} -16 63   0 270_degrees`)
	}

	RespawnExtension(player) {
		SlashCommand(`/spreadplayers 0 0 5 15 ${player.name}`)
		if (this.HighlightedPlayer === null) {
			this.SetHighlightedPlayer(player)
		}
	}

	UpdateGameExtension() {
		if (this.HighlightedPlayer === null || this.HighlightedPlayer.deathTimer !== -1) {
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

	SetHighlightedPlayer(player) {
		SlashCommand(`/clear ${this.HighlightedPlayer.name}`)
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