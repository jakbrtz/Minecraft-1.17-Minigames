TeamChooser = class extends this.BaseGame {

	constructor() {
		super()
		this.dots = [
			{ x: 8, z: 4, team: GetTeam("red") },
			{ x: 8, z: -4, team: GetTeam("green") },
			{ x: 4, z: -8, team: GetTeam("blue") },
			{ x: -4, z: -8, team: GetTeam("black") },
			{ x: -8, z: -4, team: GetTeam("yellow") },
			{ x: -8, z: 4, team: GetTeam("orange") },
			{ x: -4, z: 8, team: GetTeam("purple") },
			{ x: 4, z: 8, team: GetTeam("brown") },
		]
	}

	StartGameOverride() {

		SlashCommand(`/fill -12 65 -12 12 75 12 air`)
		SlashCommand(`/fill -12 64 -12 12 64 12 concrete 0`)
		this.dots.forEach(dot => {
			SlashCommand(`/fill ${dot.x - 1} 64 ${dot.z - 1} ${dot.x + 1} 64 ${dot.z + 1} concrete ${dot.team.colour}`)
		})

		GameController.Players.forEach(player => {
			this.Respawn(player.entity)
		})

		this.UpdateScore()
	}

	RespawnOverride(player) {
		SlashCommand(`/tp ${player.name} ${RandomFloat(-3, 3)} 66 ${RandomFloat(-3, 3)}`)
	}

	UpdateGameOverride() {

		this.dots.forEach(dot => {
			GameController.Players.forEach(player => {
				if (player.team != dot.team && PositionsAreCloseIgnoreY(player.position, dot, 2)) {
					player.team = dot.team
					Chat(`${player.name} is on the ${NumberToColour(player.team.colour)}${player.team.name} team`)
					this.UpdateScore()
				}
			})
		})

	}

	UpdateScore() {
		let lines = []
		GameController.Players.forEach(player => {
			if (player.team != undefined) {
				lines.push({text: `${NumberToColour(player.team.colour)}${player.name}\u00a7r`})
			}
		})
		this.CreateScoreboard("Teams", lines)
	}
}