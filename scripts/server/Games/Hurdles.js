Hurdles = class extends this.Race {

	constructor() {
		super()
	}

	BuildWorld() {

		this.xStart = -12
		this.zStart = -32
		this.xEnd = 12
		this.zEnd = 32
		this.distanceBetweenHurdles = 8

		Command.Fill(this.xStart, 64, this.zStart, this.xEnd, 64, this.zEnd, "magenta_glazed_terracotta 2");
		for (let hurdle = this.zStart; hurdle <= this.zEnd; hurdle += this.distanceBetweenHurdles) {
			Command.Fill(this.xStart, 65, hurdle, this.xEnd, 67, hurdle, "purpur_block");
		}
		Command.Fill(this.xStart, 64, this.zStart - 10, this.xEnd, 64, this.zStart - 1, "concrete 1");
		Command.Fill(this.xStart, 64, this.zEnd + 1, this.xEnd, 64, this.zEnd + 10, "concrete 1");
	}

	RespawnExtension(player) {
		Command.Teleport(player, Random.Float(this.xStart, this.xEnd), 66, this.zStart - 5, 0, 66, 0);
		Command.Effect(player, "speed", -1, 5);
		Command.Effect(player, "jump_boost", -1, 5);
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 60
	}

	PlayerHasLeftStartArea(player) {
		return player.position.z >= this.zStart
	}

	PlayerIsFinished(player) {
		return player.position.z >= this.zEnd
	}
}