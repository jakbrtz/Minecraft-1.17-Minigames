QuickRespawn = class extends this.Scored {

	constructor(teams) {
		super()
		this.GroupScoreByTeam = teams
		this.PvPMode = teams ? `teams` : `on`
	}

	BuildWorld() {
		const platforms = ["arenas:nether", "arenas:oasis"]
		SlashCommand(`/structure load ${Random.Arr(platforms)} -16 63 -16`)
	}

	RespawnExtension(player) {
		SlashCommand(`/give ${player.name} diamond_sword`)
		SlashCommand(`/spreadplayers 0 0 5 15 ${player.name}`)
	}

	PlayerDiedExtension(player, killer) {
		if (!this.GameIsComplete && killer !== undefined) {
			killer.score++
			this.UpdateScore()
		}
	}
}