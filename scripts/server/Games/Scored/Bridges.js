Bridges = class extends this.BaseScoredGame {

	constructor() {
		super()
		this.DefaultGameDuration = 5 * 60 * 20
		this.DeathCoolDown = 5 * 20
		this.GameMode = 'survival'
	}

	BuildWorld() {

		while (this.teams.length < 2) {
			let randomTeam = RandomTeam()
			if (!this.teams.includes(randomTeam)) {
				this.teams.push(randomTeam)
			}
		}
		let centers = [
			{ x: 48, y: 65, z: 0 },
			{ x: -48, y: 65, z: 0 },
			{ x: 0, y: 65, z: 48 },
			{ x: 0, y: 65, z: -48 },
			{ x: 32, y: 65, z: 32 },
			{ x: -32, y: 65, z: -32 },
			{ x: -32, y: 65, z: 32 },
			{ x: 32, y: 65, z: -32 },
		]
		for (var i = 0; i < this.teams.length; i++) {
			let team = this.teams[i]
			team.center = centers[i]
			team.requestedBases = []
		}

		this.players.filter(player => player.requestedBase != undefined).forEach(player => player.team.requestedBases.push(player.requestedBase))

		this.ClearWorld()
		this.teams.forEach(team => {

			team.selectedBase = (team.requestedBases.length > 0)
				? GetRandomItem(team.requestedBases)
				: GetRandomItem(["bases:Amethyst", "bases:GoldBlocks", "bases:Mud", "bases:Temple"])

			team.spawn = StructureSpawn(team.selectedBase, team.center, SuggestedRotation(team.center))
			team.goal = StructureGoal(team.selectedBase, team.center, SuggestedRotation(team.center))

			// Place structure
			SlashCommand(`/structure load ${team.selectedBase} ${team.center.x - 14} ${team.center.y - 15} ${team.center.z - 14} ${SuggestedRotation(team.center)}_degrees`)
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
			if (SuggestedRotation(team.center) % 180 == 0) {
				SlashCommand(`/fill ${xlim} ${team.center.y - 3} ${zlim} ${xlim} ${team.center.y - 10} 0 concrete ${team.colour} keep`)
				SlashCommand(`/fill ${xlim} ${team.center.y - 3} 0 0 ${team.center.y - 10} 0 concrete ${team.colour} keep`)
			} else {
				SlashCommand(`/fill ${xlim} ${team.center.y - 3} ${zlim} 0 ${team.center.y - 10} ${zlim} concrete ${team.colour} keep`)
				SlashCommand(`/fill 0 ${team.center.y - 3} ${zlim} 0 ${team.center.y - 10} 0 concrete ${team.colour} keep`)
			}
			SlashCommand(`/fill 0 ${team.center.y - 3} 0 0 ${team.center.y - 10} 0 air`)
		})
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${player.team.spawn.x} ${player.team.spawn.y} ${player.team.spawn.z} facing 0 70 0`)
		SlashCommand(`/give ${player.name} iron_sword`)
		SlashCommand(`/give ${player.name} iron_pickaxe`)
		SlashCommand(`/give ${player.name} bow`)
		SlashCommand(`/give ${player.name} arrow 16`)
		SlashCommand(`/give ${player.name} concrete 64 ${player.team.colour}`)
	}

	UpdateGameExtensionExtension() {

		this.teams.forEach(team => {
			this.players.forEach(player => {
				if (player.team != team && PositionsAreClose(player.position, team.goal, 2)) {
					if (!this.GameIsComplete) {
						player.score++
						this.UpdateScore()
						SlashCommand("/title " + player.name + " title You earned a point");
                    }
					this.Respawn(player)
                }
            })
		})

	}

	PlayerHasLeftStartArea(player) {
		return !PositionsAreClose(player.position, player.team.spawn, 3)
	}

	AttemptRevivePlayerExtension(player) {
		if (Math.random() < 0.1) {
			SlashCommand("/execute " + player.name + " ~~~ say " + GetRandomItem([
				"I got rekt",
				"aww man",
				"when I respawn it will be over for you punks",
				"If I was better then I wouldn't be so bad",
				"I'll get my revenge... probably"
			]))
		}
		SlashCommand(`/tp ${player.name} 0 100 0`)
	}

	PlayerPlacedBlock(player, position) {
		this.teams.forEach(team => {
			if (PositionsAreClose(position, team.goal, 1) || PositionsAreClose(position, team.spawn, 1)) {
				SlashCommand(`/msg ${player.name} You cannot build here`)
				SlashCommand(`/setblock ${position.x} ${position.y} ${position.z} air`)
            }
		})
	}

	PlayerTriedToDestroyBlock(player, position) {
		let block = GetBlock(player.entity, position)
		if (block.__identifier != "minecraft:concrete") {

        }
	}
}