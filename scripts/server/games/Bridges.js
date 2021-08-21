Bridges = class extends this.BaseGame {

	constructor() {
		super()

		this.teams = {
			"blue": { x: 48, y: 65, z: 0, r: 270, c: 11 },
			"red": { x: -48, y: 65, z: 0, r: 90, c: 14 },
			"yellow": { x: 0, y: 65, z: 48, r: 0, c: 4 },
			"green": { x: 0, y: 65, z: -48, r: 180, c: 13 },
		}

		this.DeathCoolDown = 5 * 20
		this.GameDuration = 5 * 60 * 20

		this.includeTestBases = false

		this.requestedBases = []
	}

	SetupOverride() {
		SlashCommand(`/dialogue open @e[type=npc,c=1] @a bridges_team`)
		this.UpdateScore()
		this.players.forEach(player => {
			player.readyToPlay = false
			player.score = 0
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
					player.team = tag
					this.UpdateScore()
					let dialogue = this.includeTestBases ? "bridges_baseAdv" : "bridges_base"
					SlashCommand(`/dialogue open @e[type=npc,c=1] ${player.name} ${dialogue}`)
				} else if (player.team == undefined) {
					SlashCommand(`/execute ${player.name} ~~~ function end`)
                }
			} else if (tag.startsWith("base-")) {
				tag = tag.substr(5)
				if (tag != "") {
					this.requestedBases.push(tag)
				}
				player.readyToPlay = true
            }
        }
	}

	UpdateSetupOverride() {
		if (this.AllPlayersAre(player => player.readyToPlay)) {
			this.StartGame()
		}
	}

	StartGameOverride() {

		this.ClearWorld()

		let structureName = "bridgebases:Mud" // todo: randomize
		if (this.requestedBases.length > 0) {
			structureName = getRandomItem(this.requestedBases)
		}
		for (let [team, p] of Object.entries(this.teams)) {
			// Place structure
			SlashCommand(`/structure load ${structureName} ${p.x - 14} ${p.y - 15} ${p.z - 14} ${p.r}_degrees`)
			// Recolour concrete
			SlashCommand(`/fill ${p.x - 14} ${p.y - 15} ${p.z - 14} ${p.x + 14} ${p.y + 15} ${p.z + 14} concrete ${p.c} replace concrete 14`)
			SlashCommand(`/fill ${p.x - 14} ${p.y + 16} ${p.z - 14} ${p.x + 14} ${p.y + 45} ${p.z + 14} concrete ${p.c} replace concrete 14`)
			// Build bridge
			let xlim = 0
			let zlim = 0
			if (p.x > 14) {
				xlim = p.x - 14
			}
			if (p.x < -14) {
				xlim = p.x + 14
			}
			if (p.z > 14) {
				zlim = p.z - 14
			}
			if (p.z < -14) {
				zlim = p.z + 14
			}
			if (p.r % 180 == 0) {
				SlashCommand(`/fill ${xlim} ${p.y - 3} ${zlim} 0 ${p.y - 10} ${zlim} concrete ${p.c}`)
				SlashCommand(`/fill 0 ${p.y - 3} ${zlim} 0 ${p.y - 10} 0 concrete ${p.c}`)
			} else {
				SlashCommand(`/fill ${xlim} ${p.y - 3} ${zlim} ${xlim} ${p.y - 10} 0 concrete ${p.c}`)
				SlashCommand(`/fill ${xlim} ${p.y - 3} 0 0 ${p.y - 10} 0 concrete ${p.c}`)
			}
			SlashCommand(`/fill 0 ${p.y - 3} 0 0 ${p.y - 10} 0 air`)
		}

		// Start game for all players
		this.players.forEach(player => {
			if (player.team != undefined) {
				this.Respawn(player.entity)
				Chat(`${player.name} is on the ${this.TeamColour(player.team)}${player.team} team`)
				SlashCommand("/gamemode survival " + player.name)
			} else {
				Chat(GetName(entity) + " is not on any team")
            }
		})

		this.UpdateScore()
	}

	RespawnOverride(player) {
		if (player.team == undefined) return
		let team = this.teams[player.team]
		SlashCommand(`/tp ${player.name} ${team.x} ${team.y + 1} ${team.z} facing 0 70 0`)
		SlashCommand(`/give ${player.name} iron_sword`)
		SlashCommand(`/give ${player.name} iron_pickaxe`)
		SlashCommand(`/give ${player.name} bow`)
		SlashCommand(`/give ${player.name} arrow 16`)
		SlashCommand(`/give ${player.name} concrete 64 ${team.c}`)
		// todo: armor
	}

	UpdateGameOverride() {

		for (let [team, basePosition] of Object.entries(this.teams)) {

			if (!this.AnyPlayerIs(player => player.team == team)) {
				// continue;
				// todo: why doesn't continue work?
			}

			this.players.forEach(player => {
				if (player.team != undefined && player.team != team &&
					player.position.x >= basePosition.x - 2 && player.position.y >= basePosition.y - 2 && player.position.z >= basePosition.z - 2 &&
					player.position.x <= basePosition.x + 2 && player.position.y <= basePosition.y + 2 && player.position.z <= basePosition.z + 2) {
					player.score++
					this.UpdateScore()
					SlashCommand("/title " + player.name + " title You earned a point");
					this.Respawn(player.entity)
				}
			})

		}

		if (this.elapsedGameTime % 20 == 0) {
			this.UpdateScore()
        }

	}

	PlayerDiedOverride (player) {

		if (Math.random() < 0.1) {
			SlashCommand("/execute " + player.name + " ~~~ say " + getRandomItem([
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

	IsGameInProgressOverride() {
		return this.elapsedGameTime < this.GameDuration
	}

	EndGameOverride() {
		this.UpdateScore()
		let teamScores = new Map()
		this.players.forEach(player => {
			if (player.team != undefined) {
				let score = player.score
				if (teamScores.has(player.team)) {
					score += teamScores.get(player.team)
				}
				teamScores.set(player.team, score)
			}
		})
		let bestScore = 0
		let bestTeam = null
		teamScores.forEach((score, team) => {
			if (score > bestScore) {
				bestTeam = team
				bestScore = score
			}
		})
		let msg = (bestTeam == null) ? `no one won` : `${this.TeamColour(bestTeam)}${bestTeam} wins`
		SlashCommand(`/title @a title ${msg}`)
		Chat(msg)
	}

	UpdateScore() {
		let lines = []
		this.players.forEach(player => {
			if (player.team != undefined) {
				lines.push({
					text: `${this.TeamColour(player.team)}${player.name}\u00a7r  `,
					value: player.score
				})
			}
		})
		if (this.gameHasStarted) {
			lines.push(TicksToDuration(this.GameDuration - this.elapsedGameTime))
		}
		this.CreateScoreboard("Scores", lines)
	}

	TeamColour(team) {
		return NumberToColour(this.teams[team].c)
	}
}