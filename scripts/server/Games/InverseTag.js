InverseTag = class extends this.Scored {

	constructor() {
		super()
		this.GroupScoreByTeam = false
		this.PvPMode = `on`
		this.DeathCoolDown = 2 * 20

		this.HighlightedPlayer = null
	}

	BuildWorld() {
		const platforms = ["arenas:nether", "arenas:oasis"]
		Command.Structure(Random.Arr(platforms), -16, 63, -16);
	}

	RespawnExtension(player) {
		Command.SpreadPlayers(0, 0, 5, 15, [player]);
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

	PlayerAttack(attacker, target) {
		if (target === this.HighlightedPlayer) {
			this.SetHighlightedPlayer(attacker)
        }
	}

	HighlightedPlayerNeedsReplacing() {
		return this.HighlightedPlayer === null || this.HighlightedPlayer.deathTimer !== -1 || !this.players.includes(this.HighlightedPlayer)
    }

	SetHighlightedPlayer(player) {
		if (this.HighlightedPlayer) {
			Command.Clear(this.HighlightedPlayer);
		}
		Command.ReplaceItem(player, "slot.armor.chest", 0, "diamond_chestplate");
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