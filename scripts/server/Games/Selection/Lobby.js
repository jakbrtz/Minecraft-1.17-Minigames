Lobby = class extends this.BaseSelection {

	constructor() {
		super()
		this.choices = [
			{
				construct: dot => SlashCommand(`/fill ${dot.x - 1} 6 ${dot.z - 1} ${dot.x + 1} 6 ${dot.z + 1} concrete ${dot.team.colour}`),
				radius: 2,
				additionalCheck: (player, dot) => player.team != dot.team,
				onSelect: (player, dot) => {
					player.team = dot.team
					Chat(`${player.name} is on the ${NumberToColour(player.team.colour)}${player.team.name} team`)
					this.UpdateScore()
				},
				options: [
					{ x: 8, z: 4, team: GetTeam("red") },
					{ x: 8, z: -4, team: GetTeam("green") },
					{ x: 4, z: -8, team: GetTeam("blue") },
					{ x: -4, z: -8, team: GetTeam("black") },
					{ x: -8, z: -4, team: GetTeam("yellow") },
					{ x: -8, z: 4, team: GetTeam("orange") },
					{ x: -4, z: 8, team: GetTeam("purple") },
					{ x: 4, z: 8, team: GetTeam("brown") },
				]
			},
			{
				construct: game => SlashCommand(`/structure load lobby:${game.structure} ${game.x - 8} 4 ${game.z - 8} ${SuggestedRotation(game)}_degrees`),
				radius: 5,
				additionalCheck: (player, game) => true,
				onSelect: (player, game) => {
					GameController.ChangeGame(game.game)
				},
				options: [
					{ x: 32, z: 16, structure: "arena", game: new QuickRespawn() },
					{ x: 32, z: -16, structure: "bridges", game: new Bridges() },
					{ x: 64, z: -16, structure: "bridges", game: new BridgesBaseSelection() },
					{ x: 16, z: -32, structure: "doordash", game: new DoorDash() },
					{ x: -16, z: -32, structure: "droppers", game: new DroppingBlocks() },
					{ x: -32, z: -16, structure: "paint", game: new Paint() },
					{ x: -32, z: 16, structure: "steppingstones", game: new SteppingStones() },
				]
            }
		]
	}

	BuildWorldWithoutOptions() {
		this.ClearWorld()
		SlashCommand(`/structure load lobby:Spawn -16 4 -16`)
		this.UpdateScore()
	}

	RespawnOverride(player) {
		SlashCommand(`/tp ${player.name} ${RandomFloat(-3, 3)} 7 ${RandomFloat(-3, 3)}`)
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