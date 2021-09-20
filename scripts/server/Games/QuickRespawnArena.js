QuickRespawn = class extends this.ScoredGame {

	constructor(teams) {
		super()
		this.GroupScoreByTeam = teams
	}

	BuildWorld() {
		WorldBuilding.Clear()
		const platforms = ["arenas:desert", "arenas:house", "arenas:nether", "arenas:planks"]
		SlashCommand(`/structure load ${Random.Arr(platforms)} -16 63 -16   0_degrees`)
		SlashCommand(`/structure load ${Random.Arr(platforms)}   0 63 -16  90_degrees`)
		SlashCommand(`/structure load ${Random.Arr(platforms)}   0 63   0 180_degrees`)
		SlashCommand(`/structure load ${Random.Arr(platforms)} -16 63   0 270_degrees`)
	}

	AddTeamExtension(team) {
		const spawns = [
			{ x:  13, z:  13 },
			{ x: -13, z: -13 },
			{ x:  13, z: -13 },
			{ x: -13, z:  13 },
			{ x:  13, z:   0 },
			{ x: -13, z:   0 },
			{ x:   0, z:  13 },
			{ x:   0, z: -13 },
		]
		team.spawn = spawns[this.teams.length - 1]
	}

	RespawnExtension(player) {
		SlashCommand(`/give ${player.name} diamond_sword`)
		if (this.GroupScoreByTeam) {
			SlashCommand(`/tp ${player.name} ${player.team.spawn.x + Random.Float(-1, 1)} 66 ${player.team.spawn.z + Random.Float(-1, 1)}`)
		}
		else {
			SlashCommand(`/tp ${player.name} ${Random.Float(-5, 5)} 66 ${Random.Float(-5, 5)}`)
        }
	}

	PlayerDiedExtension(player, killer) {
		if (!this.GameIsComplete && killer !== undefined) {
			killer.score++
			this.UpdateScore()
		}
	}
}