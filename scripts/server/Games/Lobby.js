Lobby = class extends this.Selection {

	constructor() {
		super()
	}

	GetChoices() {

		const teamSelector = {
			construct: dot => Command.Fill(dot.x - 1, 6, dot.z - 1, dot.x + 1, 6, dot.z + 1, `concrete ${dot.team.colour}`),
			radius: 2,
			additionalCheck: (dot, player) => player.team !== dot.team,
			onSelect: (dot, player) => {
				player.team = dot.team
				Command.Say(`${player.name} is on the ${Colours.NumberToCharacter(player.team.colour)}${player.team.name} team`);
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
		}

		const gamePicker = {
			construct: game => Command.Structure(`lobby:${game.structure||"default"}`, game.x - 4, 4, game.z - 4, game.angle),
			radius: 3,
			onSelect: game => GameController.ChangeGame(game.game), // todo: use the NextGame() function
			options: []
		}

		const allGames = [
			{ structure: "arena", game: new QuickRespawn(false) },
			{ structure: "arenateam", game: new QuickRespawn(true) },
			{ structure: "hill", game: new KingOfTheHill() },
			{ structure: "bombsaway", game: new BombsAway(10) },
			{ structure: "bridges", game: new Bridges() },
			{ structure: "bridgeselect", game: new BridgesBaseSelection() },
			{ structure: "bridgebuild", game: new BridgesBaseBuilder() },
			{ structure: "droppers", game: new DroppingBlocks() },
			{ structure: "paint", game: new Paint() },
			{ structure: "steppingstones", game: new SteppingStones() },
			{ structure: "doordash", game: new DoorDash() },
			{ structure: "inversetag", game: new InverseTag() },
			{ structure: "shooters", game: new Shooters() },
			{ structure: "parkour", game: new Parkour() },
			{ structure: "spleef", game: new Spleef() },
			{ structure: "thieves", game: new Thieves() },
			{ structure: "match", game: new Match() },
			{ structure: "maze", game: new Maze() },
			{ structure: "hurdles", game: new Hurdles() },
			{ structure: "boatrace", game: new BoatRace() },
		]

		allGames.forEach((option, i) => {
			const Round2dp = num => Math.round(num * 100) / 100
			const radius = 40
			const angle = 2 * Math.PI * i / allGames.length
			option.x = Round2dp(radius * -Math.sin(angle))
			option.z = Round2dp(radius * Math.cos(angle))
			option.angle = ((Math.round(angle * 2 / Math.PI) + 4) % 4) * 90
			gamePicker.options.push(option)
		})

		return [teamSelector, gamePicker]
	}

	BuildWorld() {
		this.serverName = Random.Arr(["NA", "NA", "EU", "EU", "OCE"])
		this.serverNumber = Random.Int(1, 100)
		Command.Structure("lobby:Spawn", -16, 4, -16);
	}

	RespawnExtension(player) {
		Command.Teleport(player, Random.Float(-3, 3), 7, Random.Float(-3, 3));
	}

	UpdateScore() {
		const lines = []
		this.players.forEach(player => {
			lines.push(`${Colours.NumberToCharacter(player.team.colour)}${player.name}\u00a7r`)
		})
		if (this.serverNumber < 16) {
			lines.push("")
			lines.push(`${this.serverName} #${this.serverNumber}`)
		}
		Scoreboard.Create("Teams", lines)
	}
}