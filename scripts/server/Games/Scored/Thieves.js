Thieves = class extends this.BaseScoredGame {

	constructor() {
		super()
		this.DefaultGameDuration = 5 * 60 * 20
		this.DeathCoolDown = 5 * 20
		this.GameMode = 'adventure'
	}

	BuildWorld() {

		while (this.teams.length < 2) {
			const randomTeam = Teams.Random()
			if (!this.teams.includes(randomTeam)) {
				this.teams.push(randomTeam)
			}
		}
		const centers = [
			{ x: 24, y: 65, z: 0 },
			{ x: -24, y: 65, z: 0 },
			{ x: 0, y: 65, z: 24 },
			{ x: 0, y: 65, z: -24 },
			{ x: 16, y: 65, z: 16 },
			{ x: -16, y: 65, z: -16 },
			{ x: -16, y: 65, z: 16 },
			{ x: 16, y: 65, z: -16 },
		]
		for (var i = 0; i < this.teams.length; i++) {
			const team = this.teams[i]
			team.center = centers[i]
			team.spawn = { x: team.center.x, y: team.center.y + 1, z: team.center.z }
			team.goal = { x: team.center.x, y: team.center.y + 6, z: team.center.z }
		}

		WorldBuilding.Clear()
		WorldBuilding.Circle({ x: 0, y: 64, z: 0 }, 31.5, "grass")
		this.teams.forEach(team => {
			SlashCommand(`/structure load minibases:house ${team.center.x - 4} ${team.center.y} ${team.center.z - 4} ${Coordinates.SuggestRotation(team.center)}_degrees`)
			SlashCommand(`/fill ${team.center.x - 4} ${team.center.y} ${team.center.z - 4} ${team.center.x + 4} ${team.center.y + 10} ${team.center.z + 4} concrete ${team.colour} replace concrete 12`)
		})
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${player.team.spawn.x} ${player.team.spawn.y} ${player.team.spawn.z} facing 0 70 0`)
		SlashCommand(`/give ${player.name} iron_sword`)
		player.carrying = false
	}

	UpdateGameExtensionExtension() {

		this.teams.forEach(team => {
			this.players.forEach(player => {
				if (Coordinates.PositionsAreClose(player.position, team.goal, 2, false) && !this.GameIsComplete) {
					if (player.team === team) {
						if (player.carrying) {
							player.score++
							// todo: remove score from opponent
							this.UpdateScore()
							SlashCommand(`/clear ${player.name} diamond`)
							SlashCommand("/title " + player.name + " title You earned a point")
							player.carrying = false
						}
					} else {
						if (!player.carrying) {
							SlashCommand(`/give ${player.name} diamond`)
							SlashCommand("/title " + player.name + " title Diamond stolen!")
							player.carrying = true
						}
					}
				}
            })
		})

	}

	PlayerHasLeftStartArea(player) {
		return !Coordinates.PositionsAreClose(player.position, player.team.spawn, 3, false)
	}

	AttemptRevivePlayerExtension(player) {
		SlashCommand(`/tp ${player.name} 0 100 0`)
	}
}