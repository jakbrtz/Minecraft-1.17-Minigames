Spleef = class extends this.Survival {

	constructor() {
		super()
		this.GameMode = 'survival'
		this.EndWhenOneRemains = true
	}

	BuildWorld() {
		Command.Fill(-15, 64, -15, 15, 64, 15, "snow");
	}

	RespawnExtension(player) {
		Command.Teleport(player, Random.Float(-13, 13), 66, Random.Float(-13, 13));
		Command.Give(player, "diamond_shovel");
		Command.Give(player, "snowball", 8);
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 40
	}
}