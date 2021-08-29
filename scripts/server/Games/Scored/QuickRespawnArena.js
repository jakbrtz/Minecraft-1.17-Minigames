QuickRespawn = class extends this.BaseScoredGame {

	constructor(teams) {
		super()
		this.GroupScoreByTeam = teams
	}

	BuildWorld() {
		this.ClearWorld()
		SlashCommand(`/fill -10 64 -10 10 64 10 concrete 14`)

		let spawns = [
			{ x: 6, z: 0 },
			{ x: -6, z: 0 },
			{ x: 0, z: 6 },
			{ x: 0, z: -6 },
			{ x: 4, z: 4 },
			{ x: -4, z: -4 },
			{ x: 4, z: -4 },
			{ x: -4, z: 4 },
		]
		for (var i = 0; i < this.teams.length; i++) {
			this.teams[i].spawn = spawns[i]
		}
	}

	RespawnOverride(player) {
		SlashCommand(`/give ${player.name} diamond_sword`)
		if (this.GroupScoreByTeam) {
			SlashCommand(`/tp ${player.name} ${player.team.spawn.x + RandomFloat(-1, 1)} 66 ${player.team.spawn.z + RandomFloat(-1, 1)}`)
		}
		else {
			SlashCommand(`/tp ${player.name} ${RandomFloat(-5, 5)} 66 ${RandomFloat(-5, 5)}`)
        }
	}

	PlayerKilled(player, killer) {
		killer.score++
		this.UpdateScore()
	}
}