QuickRespawn = class extends this.BaseScoredGame {

	constructor(teams) {
		super()
		this.GroupScoreByTeam = teams
	}

	BuildWorld() {
		this.ClearWorld()

		let platforms = ["arenas:desert", "arenas:house", "arenas:nether", "arenas:planks"]
		SlashCommand(`/structure load ${GetRandomItem(platforms)} -16 63 -16   0_degrees`)
		SlashCommand(`/structure load ${GetRandomItem(platforms)}   0 63 -16  90_degrees`)
		SlashCommand(`/structure load ${GetRandomItem(platforms)}   0 63   0 180_degrees`)
		SlashCommand(`/structure load ${GetRandomItem(platforms)} -16 63   0 270_degrees`)

		let spawns = [
			{ x:  13, z:  13 },
			{ x: -13, z: -13 },
			{ x:  13, z: -13 },
			{ x: -13, z:  13 },
			{ x:  13, z:   0 },
			{ x: -13, z:   0 },
			{ x:   0, z:  13 },
			{ x:   0, z: -13 },
		]
		for (var i = 0; i < this.teams.length; i++) {
			this.teams[i].spawn = spawns[i]
		}
	}

	RespawnExtension(player) {
		SlashCommand(`/give ${player.name} diamond_sword`)
		if (this.GroupScoreByTeam) {
			SlashCommand(`/tp ${player.name} ${player.team.spawn.x + RandomFloat(-1, 1)} 66 ${player.team.spawn.z + RandomFloat(-1, 1)}`)
		}
		else {
			SlashCommand(`/tp ${player.name} ${RandomFloat(-5, 5)} 66 ${RandomFloat(-5, 5)}`)
        }
	}

	PlayerKilled(player, killer) {
		if (!this.GameIsComplete) {
			killer.score++
			this.UpdateScore()
		}
	}
}