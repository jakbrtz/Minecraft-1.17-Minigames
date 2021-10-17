Thieves = class extends this.Scored {

	constructor() {
		super();
		this.DefaultGameDuration = 5 * 60 * 20;
		this.DeathCoolDown = 5 * 20;
		this.TeamsCanBeAddedAfterStart = false;
		this.minimumNumberOfTeams = 2;
	}

	BuildWorld() {
		WorldBuilding.Circle({ x: 0, y: 64, z: 0 }, 31.5, "grass");
		// Bases will be built as players join
	}

	AddTeamExtension(team) {

		const centers = [
			{ x: 24, y: 65, z: 0 },
			{ x: -24, y: 65, z: 0 },
			{ x: 0, y: 65, z: 24 },
			{ x: 0, y: 65, z: -24 },
			{ x: 16, y: 65, z: 16 },
			{ x: -16, y: 65, z: -16 },
			{ x: -16, y: 65, z: 16 },
			{ x: 16, y: 65, z: -16 },
		];

		team.center = centers[this.teams.length - 1];
		team.spawn = { x: team.center.x, y: team.center.y + 1, z: team.center.z };
		team.goal = { x: team.center.x, y: team.center.y + 6, z: team.center.z };
		
		const structure = "thieves:" + Random.Arr(["house", "pond", "monument", "rich", "treehouse"]);
		Command.Structure(structure, team.center.x - 4, team.center.y, team.center.z - 4, Coordinates.SuggestRotation(team.center));
		Command.Fill(team.center.x - 4, team.center.y, team.center.z - 4, team.center.x + 4, team.center.y + 10, team.center.z + 4, `concrete ${team.colour} replace concrete 12`);
	}
	RespawnExtension(player) {
		Command.Teleport(player, player.team.spawn.x, player.team.spawn.y, player.team.spawn.z, 0, 70, 0);
		Command.Give(player, "iron_sword");
		player.carrying = false;
	}

	UpdateGameExtension() {

		this.teams.forEach(team => {
			this.players.forEach(player => {
				if (Coordinates.PositionsAreClose(player.position, team.goal, 2, false) && !this.GameIsComplete) {
					if (player.team === team) {
						if (player.carrying) {
							player.score++;
							// todo: remove score from opponent
							this.UpdateScore();
							Command.Clear(player, "diamond");
							Command.Title(player, "title", "Year earned a point");
							player.carrying = false;
						}
					} else {
						if (!player.carrying) {
							Command.Give(player, "diamond");
							Command.Title(player, "title", "Diamond stolen!");
							player.carrying = true;
						}
					}
				}
            })
		})

	}

	PlayerHasLeftStartArea(player) {
		return !Coordinates.PositionsAreClose(player.position, player.team.spawn, 3, false);
	}
}