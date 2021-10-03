Bridges = class extends this.Scored {

	constructor() {
		super()
		this.DefaultGameDuration = 5 * 60 * 20
		this.DeathCoolDown = 5 * 20
		this.TeamsCanBeAddedAfterStart = false
		this.minimumNumberOfTeams = 2
		this.maximumNumberOfTeams = 4
	}

	BuildWorld() {
		WorldBuilding.Clear()
		// Bases will be built as players join
	}

	AddTeamExtension(team) {

		const centers = [
			{ x: 48, y: 65, z: 0 },
			{ x: -48, y: 65, z: 0 },
			{ x: 0, y: 65, z: 48 },
			{ x: 0, y: 65, z: -48 },
		]

		team.center = centers[this.teams.length - 1]
		const options = this.players.filter(player => player.requestedBase && player.team === team).map(player => player.requestedBase)

		team.selectedBase = options.length > 0 // todo: must we write the '>0'?
			? Random.Arr(options)
			: (team !== this.teams[0])
				? this.teams[0].selectedBase
				: ("bridges:" + Random.Arr(["Amethyst", "GoldBlocks", "Mud", "Temple", "Monument", "Mill"]))

		team.spawn = Coordinates.Offset(team.center, Coordinates.SuggestRotation(team.center), { x: 0, y: 1, z: -8 })
		team.goal = team.selectedBase === "bridges:GoldBlocks"
			? team.center
			: Coordinates.Offset(team.center, Coordinates.SuggestRotation(team.center), { x: 0, y: 1, z: 8 })

		// Place structure
		SlashCommand(`/structure load ${team.selectedBase} ${team.center.x - 14} ${team.center.y - 15} ${team.center.z - 14} ${Coordinates.SuggestRotation(team.center)}_degrees`)
		// Recolour concrete
		SlashCommand(`/fill ${team.center.x - 14} ${team.center.y - 15} ${team.center.z - 14} ${team.center.x + 14} ${team.center.y + 15} ${team.center.z + 14} concrete ${team.colour} replace concrete 12`)
		SlashCommand(`/fill ${team.center.x - 14} ${team.center.y + 16} ${team.center.z - 14} ${team.center.x + 14} ${team.center.y + 45} ${team.center.z + 14} concrete ${team.colour} replace concrete 12`)
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
		if (Coordinates.SuggestRotation(team.center) % 180 === 0) {
			SlashCommand(`/fill ${xlim} ${team.center.y - 3} ${zlim} ${xlim} ${team.center.y - 10} 0 stained_hardened_clay ${team.colour} keep`)
			SlashCommand(`/fill ${xlim} ${team.center.y - 3} 0 0 ${team.center.y - 10} 0 stained_hardened_clay ${team.colour} keep`)
		} else {
			SlashCommand(`/fill ${xlim} ${team.center.y - 3} ${zlim} 0 ${team.center.y - 10} ${zlim} stained_hardened_clay ${team.colour} keep`)
			SlashCommand(`/fill 0 ${team.center.y - 3} ${zlim} 0 ${team.center.y - 10} 0 stained_hardened_clay ${team.colour} keep`)
		}
		SlashCommand(`/fill 0 ${team.center.y - 3} 0 0 ${team.center.y - 10} 0 air`)

	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${player.team.spawn.x} ${player.team.spawn.y} ${player.team.spawn.z} facing 0 70 0`)
		SlashCommand(`/give ${player.name} iron_sword`)
		SlashCommand(`/give ${player.name} iron_pickaxe 1 0 ${AdventureTags.CanDestroy("stained_hardened_clay")}`)
		SlashCommand(`/give ${player.name} bow`)
		SlashCommand(`/give ${player.name} arrow 16`)
		SlashCommand(`/give ${player.name} stained_hardened_clay 64 ${player.team.colour} ${AdventureTags.CanPlaceOn()}`)
	}

	UpdateGameExtension() {

		this.teams.forEach(team => {
			this.players.forEach(player => {
				if (player.team !== team && player.deathTimer === -1 && Coordinates.PositionsAreClose(player.position, team.goal, 2, false)) {
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
		return !Coordinates.PositionsAreClose(player.position, player.team.spawn, 3, false)
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 30
	}

	PlayerPlacedBlock(player, position) {
		this.teams.forEach(team => {
			if (Coordinates.PositionsAreClose(position, team.goal, 1, false) || Coordinates.PositionsAreClose(position, team.spawn, 1, false)) {
				SlashCommand(`/msg ${player.name} You cannot build here`)
				SlashCommand(`/setblock ${position.x} ${position.y} ${position.z} air`)
            }
		})
	}

	PlayerTriedToDestroyBlock(player, position) {
		const block = GetBlockData(player.entity, position)
		player.terracottaColourBeingDestroyed = Colours.NameToNumber(block.color)
	}

	PlayerDestroyedBlock(player, position) {
		SlashCommand(`/give ${player.name} stained_hardened_clay 1 ${player.terracottaColourBeingDestroyed} ${AdventureTags.CanPlaceOn()}`)
		SlashCommand(`/kill @e[type=item,x=${position.x},y=${position.y},z=${position.z},rm=0,r=15]`)
	}
}