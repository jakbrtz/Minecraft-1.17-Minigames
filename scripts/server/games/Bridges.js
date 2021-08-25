Bridges = class extends this.BaseGame {

	constructor() {
		super()

		this.teams = []
		this.DeathCoolDown = 5 * 20
	}

	SetupOverride() {
		this.UpdateScore()
		this.players.forEach(player => {
			player.readyToPlay = false
			player.score = 0
			this.OpenDialogue(player, "bridges_team")
        })
	}

	ReceivedTagOverride(player, tag) {
		if (this.gameHasStarted) {
			if ((tag.startsWith("team-") || tag.startsWith("base-")) && tag.length > 5) {
				SlashCommand(`/msg ${player.name} The game has already started!`)
            }
		} else {
			if (tag.startsWith("team-")) {
				tag = tag.substr(5)
				if (tag != "") {
					player.team = this.CreateTeamIfItDoesntExist(tag)
					this.UpdateScore()
					let dialogue = Globals.Editor ? "bridges_baseAdv" : "bridges_base"
					SlashCommand(`/dialogue open @e[type=npc,c=1] ${player.name} ${dialogue}`)
				} else if (player.team == undefined) {
					this.OpenDialogue(player, "bridges_team")
				}
			} else if (tag.startsWith("base-")) {
				tag = tag.substr(5)
				if (tag != "") {
					player.team.requestedBases.push(tag)
				} else {
					player.readyToPlay = true
				}
			}
        }
	}

	CreateTeamIfItDoesntExist(name) {
		for (var i = 0; i < this.teams.length; i++) {
			if (this.teams[i].name == name) {
				return this.teams[i]
			}
		}
		var center
		var rotation
		switch (this.teams.length) {
			case 0:
				center = { x: 48, y: 65, z: 0 }
				rotation = 270
				break;
			case 1:
				center = { x: -48, y: 65, z: 0 }
				rotation = 90
				break;
			case 2:
				center = { x: 0, y: 65, z: 48 }
				rotation = 0
				break;
			case 3:
				center = { x: 0, y: 65, z: -48 }
				rotation = 180
				break;
			case 4:
				center = { x: 32, y: 65, z: 32 }
				rotation = 0
				break;
			case 5:
				center = { x: -32, y: 65, z: -32 }
				rotation = 180
				break;
		}
		var colour
		switch (name) {
			case "red":
				colour = 14
				break;
			case "blue":
				colour = 11
				break;
			case "green":
				colour = 13
				break;
			case "yellow":
				colour = 4
				break;
			case "orange":
				colour = 1
				break;
			case "black":
				colour = 7
				break;
		}
		let team = {
			name: name,
			center: center,
			rotation: rotation,
			colour: colour,
			score: 0,
			requestedBases: []
		}
		this.teams.push(team)
		return team
    }

	UpdateSetupOverride() {
		if (this.AllPlayersAre(player => player.readyToPlay)) {
			this.StartGame()
		}
	}

	StartGameOverride() {

		this.ClearWorld()

		while (this.teams.length < 2) {
			this.CreateTeamIfItDoesntExist(GetRandomItem(["red","yellow","green","blue","orange","black"]))
		}

		this.teams.forEach(team => {

			team.selectedBase = (team.requestedBases.length > 0)
				? GetRandomItem(team.requestedBases)
				: GetRandomItem(["bases:Amethyst", "bases:GoldBlocks", "bases:Mud", "bases:Temple"])

			team.spawn = StructureSpawn(team.selectedBase, team.center, team.rotation)
			team.goal = StructureGoal(team.selectedBase, team.center, team.rotation)

			// Place structure
			SlashCommand(`/structure load ${team.selectedBase} ${team.center.x - 14} ${team.center.y - 15} ${team.center.z - 14} ${team.rotation}_degrees`)
			// Recolour concrete
			SlashCommand(`/fill ${team.center.x - 14} ${team.center.y - 15} ${team.center.z - 14} ${team.center.x + 14} ${team.center.y + 15} ${team.center.z + 14} concrete ${team.colour} replace concrete 14`)
			SlashCommand(`/fill ${team.center.x - 14} ${team.center.y + 16} ${team.center.z - 14} ${team.center.x + 14} ${team.center.y + 45} ${team.center.z + 14} concrete ${team.colour} replace concrete 14`)
			// Build bridge
			let xlim = 0
			let zlim = 0
			if (team.center.x > 15) {
				xlim = team.center.x - 15
			}
			if (team.center.x < -15) {
				xlim = team.center.x + 15
			}
			if (team.center.z > 15) {
				zlim = team.center.z - 15
			}
			if (team.center.z < -15) {
				zlim = team.center.z + 15
			}
			if (team.center.r % 180 == 0) {
				SlashCommand(`/fill ${xlim} ${team.center.y - 3} ${zlim} 0 ${team.center.y - 10} ${zlim} concrete ${team.colour} keep`)
				SlashCommand(`/fill 0 ${team.center.y - 3} ${zlim} 0 ${team.center.y - 10} 0 concrete ${team.colour} keep`)
			} else {
				SlashCommand(`/fill ${xlim} ${team.center.y - 3} ${zlim} ${xlim} ${team.center.y - 10} 0 concrete ${team.colour} keep`)
				SlashCommand(`/fill ${xlim} ${team.center.y - 3} 0 0 ${team.center.y - 10} 0 concrete ${team.colour} keep`)
			}
			SlashCommand(`/fill 0 ${team.center.y - 3} 0 0 ${team.center.y - 10} 0 air`)
		})

		// Start game for all players
		this.players.forEach(player => {
			this.Respawn(player.entity)
			Chat(`${player.name} is on the ${NumberToColour(player.team.colour)}${player.team.name} team`)
			SlashCommand(`/gamemode survival ${player.name}`)
		})

		this.UpdateScore()
	}

	RespawnOverride(player) {
		if (player.team == undefined) return
		SlashCommand(`/tp ${player.name} ${player.team.spawn.x} ${player.team.spawn.y} ${player.team.spawn.z} facing 0 70 0`)
		SlashCommand(`/give ${player.name} iron_sword`)
		SlashCommand(`/give ${player.name} iron_pickaxe`)
		SlashCommand(`/give ${player.name} bow`)
		SlashCommand(`/give ${player.name} arrow 16`)
		SlashCommand(`/give ${player.name} concrete 64 ${player.team.colour}`)
	}

	UpdateGameOverride() {

		if (this.elapsedGameTime < 20) return

		this.teams.forEach(team => {
			this.players.forEach(player => {
				if (player.team != team && PositionsAreClose(player.position, team.goal, 2)) {
					player.score++
					player.team.score++
					this.UpdateScore()
					SlashCommand("/title " + player.name + " title You earned a point");
					this.Respawn(player.entity)
                }
            })
		})

		if (this.elapsedGameTime % 20 == 0) {
			this.UpdateScore()
        }

	}

	AttemptRevivePlayerOverride(player) {
		if (Math.random() < 0.1) {
			SlashCommand("/execute " + player.name + " ~~~ say " + GetRandomItem([
				"I got rekt",
				"aww man",
				"It's kinda sad that we are so desensitised to death",
				"when I respawn it will be over for you punks",
				"I would swear but then I would get in trouble",
				"If I was better then I wouldn't be so bad",
				"I'll get my revenge... probably"
			]))
		}
		SlashCommand(`/tp ${player.name} 0 100 0`)
	}

	PlayerPlacedBlockOverride(player, position) {
		this.teams.forEach(team => {
			if (PositionsAreClose(position, team.goal, 2)) {
				SlashCommand(`/msg ${player.name} don't build there`)
				SlashCommand(`/setblock ${position.x} ${position.y} ${position.z} air`)
            }
		})
	}

	IsGameInProgressOverride() {
		return this.elapsedGameTime < Globals.GameDuration
	}

	EndGameOverride() {
		this.UpdateScore()
		let bestScore = 1
		let bestTeams = []
		this.teams.forEach(team => {
			if (team.score > bestScore) {
				bestTeams = [ team ]
				bestScore = team.score
			} else if (team.score == bestScore) {
				bestTeams.push(team)
            }
		})
		var msg
		if (bestTeams.length == 0) {
			msg = "No one won"
		} else if (bestTeams.length == 1) {
			msg = `${NumberToColour(bestTeams[0].colour)}${bestTeams[0].name} wins`
		} else if (bestTeams.length == this.teams.length) {
			msg = "Everyone wins!"
		} else {
			msg = "It's a tie between " + bestTeams.map(team => `${NumberToColour(team.colour)}${team.name}\u00a7r`).join(" and ")
        }
		SlashCommand(`/title @a title ${msg}`)
		Chat(msg)
	}

	UpdateScore() {
		let lines = []
		this.players.forEach(player => {
			if (player.team != undefined) {
				lines.push({
					text: `${NumberToColour(player.team.colour)}${player.name}\u00a7r`,
					value: player.score
				})
			}
		})
		if (this.gameHasStarted) {
			lines.push(TicksToDuration(Globals.GameDuration - this.elapsedGameTime))
		}
		this.CreateScoreboard("Scores", lines)
	}
}