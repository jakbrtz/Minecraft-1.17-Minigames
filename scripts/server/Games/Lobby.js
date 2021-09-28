Lobby = class extends this.Selection {

	constructor() {
		super()
	}

	GetChoices() {

		const teamSelector = {
			construct: dot => SlashCommand(`/fill ${dot.x - 1} 6 ${dot.z - 1} ${dot.x + 1} 6 ${dot.z + 1} concrete ${dot.team.colour}`),
			radius: 2,
			additionalCheck: (dot, player) => player.team !== dot.team,
			onSelect: (dot, player) => {
				player.team = dot.team
				Chat(`${player.name} is on the ${Colours.NumberToCharacter(player.team.colour)}${player.team.name} team`)
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
			construct: game => SlashCommand(`/structure load lobby:${game.structure || "default"} ${game.x - 3} 4 ${game.z - 3} ${game.angle}_degrees`),
			radius: 3,
			onSelect: game => GameController.ChangeGame(game.game), // todo: use the NextGame() function
			options: []
		}

		const allGames = [
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
			{ game: new Maze() },
		]

		allGames.forEach((option, i) => {
			const radius = 40
			const angle = 2 * Math.PI * i / allGames.length
			option.x = radius * Math.sin(angle)
			option.z = radius * -Math.cos(angle)
			option.angle = ((Math.round(angle * 2 / Math.PI) + 6) % 4) * 90 // todo: shouldn't it be +4?
			gamePicker.options.push(option)
		})

		const gameTime = {
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

		return [teamSelector, gamePicker, gameTime]
	}

	BuildWorld() {
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
			lines.push(`${Colours.NumberToCharacter(player.team.colour)}${player.name}\u00a7r`)
		})
		if (this.serverNumber < 16) {
			lines.push("")
			lines.push(`${this.serverName} #${this.serverNumber}`)
		}
		Scoreboard.Create("Teams", lines)
	}
}