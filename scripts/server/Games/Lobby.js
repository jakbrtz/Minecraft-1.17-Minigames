Lobby = class extends this.Selection {

	constructor() {
		super()
	}

	GetChoices() {
		return [
			{
				construct: dot => SlashCommand(`/fill ${dot.x - 1} 6 ${dot.z - 1} ${dot.x + 1} 6 ${dot.z + 1} concrete ${dot.team.colour}`),
				radius: 2,
				additionalCheck: (dot, player) => player.team !== dot.team,
				onSelect: (dot, player) => {
					player.team = dot.team
					Chat(`${player.name} is on the ${Scoreboard.NumberToColour(player.team.colour)}${player.team.name} team`)
					this.UpdateScore()
				},
				options: [
					{ x: 8, z: 4, team: Teams.Get("Blue") },
					{ x: 8, z: -4, team: Teams.Get("Orange") },
					{ x: 4, z: -8, team: Teams.Get("Red") },
					{ x: -4, z: -8, team: Teams.Get("Black") },
					{ x: -8, z: -4, team: Teams.Get("Pink") },
					{ x: -8, z: 4, team: Teams.Get("Green") },
					{ x: -4, z: 8, team: Teams.Get("Purple") },
					{ x: 4, z: 8, team: Teams.Get("Yellow") },
				]
			},
			{
				construct: (game, i) => {
					let radius = 40
					game.x = Math.round(radius * Math.sin(i * 2 * Math.PI / this.choices[1].options.length))
					game.z = Math.round(radius * Math.cos(i * 2 * Math.PI / this.choices[1].options.length))
					SlashCommand(`/structure load lobby:${game.structure || "default"} ${game.x - 3} 4 ${game.z - 3} ${Coordinates.SuggestRotation(game)}_degrees`)
				},
				radius: 3,
				onSelect: game => GameController.ChangeGame(game.game), // todo: use the NextGame() function
				options: [
					{ structure: "arena", game: new QuickRespawn(false) },
					{ structure: "bridges", game: new Bridges() },
					{ structure: "bridgeselect", game: new BridgesBaseSelection() },
					{ structure: "bridgebuild", game: new BridgesBaseBuilder() },
					{ structure: "droppers", game: new DroppingBlocks() },
					{ structure: "paint", game: new Paint() },
					{ structure: "steppingstones", game: new SteppingStones() },
					{ structure: "arenateam", game: new QuickRespawn(true) },
					{ structure: "doordash", game: new DoorDash() },
					{ structure: "inversetag", game: new InverseTag() },
					{ structure: "shooters", game: new Shooters() },
					{ structure: "hill", game: new KingOfTheHill() },
					{ structure: "bombsaway", game: new BombsAway(10) },
					{ structure: "parkour", game: new Parkour() },
					{ structure: "spleef", game: new Spleef() },
					{ game: new Thieves() },
					{ structure: "match", game: new Match() },
				]
			},
			{
				construct: time => SlashCommand(`/setblock ${time.x} 4 ${time.z} obsidian`),
				additionalCheck: time => GameController.GameDuration !== time.duration,
				onSelect: time => {
					GameController.GameDuration = time.duration
					Chat(`The game duration is now ${time.duration ? Scoreboard.TicksToDuration(time.duration) : "default"}`)
				},
				options: [
					{ x: -4, z: -31, duration: 0 },
					{ x: -2, z: -31, duration: 30 * 20 },
					{ x: 0, z: -31, duration: 60 * 20 },
					{ x: 2, z: -31, duration: 120 * 20 },
					{ x: 4, z: -31, duration: 300 * 20 },
				]
            }
		]
	}

	BuildWorldWithoutOptions() {
		this.serverName = Random.Arr(["NA", "NA", "EU", "EU", "OCE"])
		this.serverNumber = Random.Int(100) + 1
		WorldBuilding.Clear()
		SlashCommand(`/structure load lobby:Spawn -16 4 -16`)
		this.UpdateScore()
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${Random.Float(-3, 3)} 7 ${Random.Float(-3, 3)}`)
	}

	UpdateScore() {
		const lines = []
		this.players.forEach(player => {
			lines.push(`${Scoreboard.NumberToColour(player.team.colour)}${player.name}\u00a7r`)
		})
		if (this.serverNumber < 16) {
			lines.push("")
			lines.push(`${this.serverName} #${this.serverNumber}`)
		}
		Scoreboard.Create("Teams", lines)
	}
}