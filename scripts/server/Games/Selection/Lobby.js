Lobby = class extends this.BaseSelection {

	constructor() {
		super()
		this.serverName = GetRandomItem(["NA", "NA", "NA", "NA", "EU", "EU", "EU", "OCE", "OCE", "SEA", "ANT"])
		this.serverNumber = RandomInt(60) + 1
	}

	GetChoices() {
		return [
			{
				construct: dot => SlashCommand(`/fill ${dot.x - 1} 6 ${dot.z - 1} ${dot.x + 1} 6 ${dot.z + 1} concrete ${dot.team.colour}`),
				radius: 2,
				additionalCheck: (dot, player) => player.team != dot.team,
				onSelect: (dot, player) => {
					player.team = dot.team
					Chat(`${player.name} is on the ${NumberToColour(player.team.colour)}${player.team.name} team`)
					this.UpdateScore()
				},
				options: [
					{ x: 8, z: 4, team: GetTeam("blue") },
					{ x: 8, z: -4, team: GetTeam("orange") },
					{ x: 4, z: -8, team: GetTeam("red") },
					{ x: -4, z: -8, team: GetTeam("black") },
					{ x: -8, z: -4, team: GetTeam("pink") },
					{ x: -8, z: 4, team: GetTeam("green") },
					{ x: -4, z: 8, team: GetTeam("purple") },
					{ x: 4, z: 8, team: GetTeam("yellow") },
				]
			},
			{
				construct: game => SlashCommand(`/structure load lobby:${game.structure} ${game.x - 3} 4 ${game.z - 3} ${SuggestedRotation(game)}_degrees`),
				radius: 3,
				onSelect: game => GameController.ChangeGame(game.game), // todo: use the NextGame() function
				options: [
					{ x: 24, z: 8, structure: "arena", game: new QuickRespawn(false) },
					{ x: 24, z: -8, structure: "bridges", game: new Bridges() },
					{ x: 20, z: -20, structure: "bridgeselect", game: new BridgesBaseSelection() },
					{ x: 8, z: -24, structure: "bridgebuild", game: new BridgesBaseBuilder() },
					{ x: -8, z: -24, structure: "droppers", game: new DroppingBlocks() },
					{ x: -24, z: -8, structure: "paint", game: new Paint() },
					{ x: -24, z: 8, structure: "steppingstones", game: new SteppingStones() },
					{ x: -8, z: 24, structure: "arenateam", game: new QuickRespawn(true) },
					{ x: 8, z: 24, structure: "doordash", game: new DoorDash() },
					{ x: 20, z: 20, structure: "inversetag", game: new InverseTag() },
				]
			}
		]
	}

	BuildWorldWithoutOptions() {
		this.ClearWorld()
		SlashCommand(`/structure load lobby:Spawn -16 4 -16`)
		SlashCommand(`/gamemode adventure @a`)
		this.UpdateScore()
	}

	RespawnOverride(player) {
		SlashCommand(`/tp ${player.name} ${RandomFloat(-3, 3)} 7 ${RandomFloat(-3, 3)}`)
	}

	UpdateScore() {
		let lines = []
		this.players.forEach(player => {
			lines.push(`${NumberToColour(player.team.colour)}${player.name}\u00a7r`)
		})
		if (this.serverNumber < 16) {
			lines.push("")
			lines.push(`${this.serverName} #${this.serverNumber}`)
		}
		this.CreateScoreboard("Teams", lines)
	}
}