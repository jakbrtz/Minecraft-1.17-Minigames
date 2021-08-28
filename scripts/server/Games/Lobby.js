Lobby = class extends this.BaseGame {

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
		this.games = [
			{ x: 32, z: 16, rotation: 270, structure: "arena", game: new QuickRespawn() },
			{ x: 32, z: -16, rotation: 270, structure: "bridges", game: new Bridges() },
			{ x: 16, z: -32, rotation: 180, structure: "doordash", game: new DoorDash() },
			{ x: -16, z: -32, rotation: 180, structure: "droppers", game: new DroppingBlocks() },
			{ x: -32, z: -16, rotation: 90, structure: "paint", game: new Paint() },
			{ x: -32, z: 16, rotation: 90, structure: "steppingstones", game: new SteppingStones() },
		]
	}

	StartGameOverride() {

		this.ClearWorld()
		SlashCommand(`/structure load lobby:Spawn -16 4 -16`)
		this.dots.forEach(dot => {
			SlashCommand(`/fill ${dot.x - 1} 6 ${dot.z - 1} ${dot.x + 1} 6 ${dot.z + 1} concrete ${dot.team.colour}`)
		})
		this.games.forEach(game => {
			SlashCommand(`/structure load lobby:${game.structure} ${game.x - 8} 4 ${game.z - 8} ${game.rotation}_degrees`)
        })

		GameController.Players.forEach(player => {
			this.Respawn(player.entity)
		})

		this.UpdateScore()
	}

	RespawnOverride(player) {
		SlashCommand(`/tp ${player.name} ${RandomFloat(-3, 3)} 7 ${RandomFloat(-3, 3)}`)
	}

	UpdateGameOverride() {

		GameController.Players.forEach(player => {
			this.dots.forEach(dot => {
				if (player.team != dot.team && PositionsAreCloseIgnoreY(player.position, dot, 2)) {
					player.team = dot.team
					Chat(`${player.name} is on the ${NumberToColour(player.team.colour)}${player.team.name} team`)
					this.UpdateScore()
				}
			})
			this.games.forEach(game => {
				if (PositionsAreCloseIgnoreY(player.position, game, 8)) {
					GameController.ChangeGame(game.game)
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