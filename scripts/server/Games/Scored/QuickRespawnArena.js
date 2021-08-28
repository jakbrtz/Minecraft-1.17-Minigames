QuickRespawn = class extends this.BaseScoredGame {

	constructor() {
		super()
		this.GroupScoreByTeam = false
	}

	BuildWorld() {
		this.ClearWorld()
		SlashCommand(`/fill -10 64 -10 10 64 10 concrete 14`)
	}

	RespawnOverride(player) {
		SlashCommand(`/give ${player.name} diamond_sword`)
		SlashCommand(`/tp ${player.name} ${RandomFloat(-5, 5)} 66 ${RandomFloat(-5, 5)}`)
	}

	PlayerKilled(player, killer) {
		killer.score++
		this.UpdateScore()
	}
}