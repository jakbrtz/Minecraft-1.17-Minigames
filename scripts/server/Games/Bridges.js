Bridges = class extends this.Scored {

	constructor() {
		super();
		this.DefaultGameDuration = 5 * 60 * 20;
		this.DeathCoolDown = 5 * 20;
		this.TeamsCanBeAddedAfterStart = false;
		this.minimumNumberOfTeams = 2;
		this.maximumNumberOfTeams = 4;
	}

	AddTeamExtension(team) {

		const centers = [
			{ x: 48, y: 65, z: 0 },
			{ x: -48, y: 65, z: 0 },
			{ x: 0, y: 65, z: 48 },
			{ x: 0, y: 65, z: -48 },
		];

		team.center = centers[this.teams.length - 1];
		const options = this.players.filter(player => player.requestedBase && player.team === team).map(player => player.requestedBase);

		team.selectedBase = options.length
			? Random.Arr(options)
			: (team !== this.teams[0])
				? this.teams[0].selectedBase
				: ("bridges:" + Random.Arr(["Amethyst", "GoldBlocks", "Mud", "Temple", "Monument", "Mill"]));

		team.spawn = Coordinates.Offset(team.center, Coordinates.SuggestRotation(team.center), { x: 0, y: 1, z: -8 });
		team.goal = Coordinates.Offset(team.center, Coordinates.SuggestRotation(team.center), { x: 0, y: 1, z: 8 });

		// Place structure
		Command.Structure(team.selectedBase, team.center.x - 14, team.center.y - 15, team.center.z - 14, Coordinates.SuggestRotation(team.center));
		// Recolour concrete
		Command.Fill(team.center.x - 14, team.center.y - 15, team.center.z - 14, team.center.x + 14, team.center.y + 15, team.center.z + 14, `concrete ${team.colour} replace concrete 12`);
		Command.Fill(team.center.x - 14, team.center.y + 16, team.center.z - 14, team.center.x + 14, team.center.y + 45, team.center.z + 14, `concrete ${team.colour} replace concrete 12`);
		// Build bridge
		let xlim = 0;
		let zlim = 0;
		if (team.center.x > 15) {
			xlim = team.center.x - 15;
		}
		if (team.center.x < -15) {
			xlim = team.center.x + 15;
		}
		if (team.center.z > 15) {
			zlim = team.center.z - 15;
		}
		if (team.center.z < -15) {
			zlim = team.center.z + 15;
		}
		if (Coordinates.SuggestRotation(team.center) % 180 === 0) {
			Command.Fill(xlim, team.center.y - 3, zlim, xlim, team.center.y - 10, 0, `stained_hardened_clay ${team.colour} keep`);
			Command.Fill(xlim, team.center.y - 3, 0, 0, team.center.y - 10, 0, `stained_hardened_clay ${team.colour} keep`);
		} else {
			Command.Fill(xlim, team.center.y - 3, zlim, 0, team.center.y - 10, zlim, `stained_hardened_clay ${team.colour} keep`);
			Command.Fill(0, team.center.y - 3, zlim, 0, team.center.y - 10, 0, `stained_hardened_clay ${team.colour} keep`);
		}
		Command.Fill(0, team.center.y - 3, 0, 0, team.center.y - 10, 0, "air");

	}

	RespawnExtension(player) {
		Command.Teleport(player, player.team.spawn.x, player.team.spawn.y, player.team.spawn.z, 0, player.team.spawn.y + 5, 0);
		Command.Give(player, "iron_sword");
		Command.Give(player, "iron_pickaxe", 1, `0 ${AdventureTags.CanDestroy("stained_hardened_clay")}`);
		Command.Give(player, "bow");
		Command.Give(player, "arrow", 16);
		Command.Give(player, "stained_hardened_clay", 64, `${player.team.colour} ${AdventureTags.CanPlaceOn()}`);
	}

	UpdateGameExtension() {

		this.teams.forEach(team => {
			this.players.forEach(player => {
				if (player.team !== team && player.deathTimer === -1 && Coordinates.PositionsAreClose(player.position, team.goal, 2, false)) {
					if (!this.GameIsComplete) {
						player.score++;
						this.UpdateScore();
						Command.Title(player, "title", "You earned a point");
                    }
					this.Respawn(player);
                }
            })
		})

	}

	PlayerHasLeftStartArea(player) {
		return !Coordinates.PositionsAreClose(player.position, player.team.spawn, 3, false);
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 30;
	}

	PlayerPlacedBlock(player, position) {
		this.teams.forEach(team => {
			if (Coordinates.PositionsAreClose(position, team.goal, 1, false) || Coordinates.PositionsAreClose(position, team.spawn, 1, false)) {
				Command.Tell(player, "You cannot build here");
				Command.SetBlock(position.x, position.y, position.z, "air");
            }
		})
	}

	PlayerTriedToDestroyBlock(player, position, GetBlockData) {
		const block = GetBlockData();
		if (block) {
			player.terracottaColourBeingDestroyed = Colours.NameToNumber(block.color);
		}
	}

	PlayerDestroyedBlock(player, position) {
		Command.Give(player, "stained_hardened_clay", 1, `${player.terracottaColourBeingDestroyed} ${AdventureTags.CanPlaceOn()}`);
		Command.RemoveItemEntities(position.x, position.y, position.z, 15);
	}
}