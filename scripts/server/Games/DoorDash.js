DoorDash = class extends this.Race {

	constructor() {
		super();

		this.width = 6;
		this.depth = 8;
		this.rows = 8;
		this.doors = 4;
	}

	BuildWorld() {

		this.xStart = -this.doors * this.width / 2;
		this.zStart = -this.rows * this.depth / 2;

		for (let row = 0; row < this.rows; row++) {
			const clearDoor1 = Random.Int(this.doors);
			const clearDoor2 = Random.Int(this.doors);
			for (let door = 0; door < this.doors; door++) {
				const structureName = (door === clearDoor1 || door === clearDoor2) ? "doordash:clear" : "doordash:blocked";
				Command.Structure(structureName, door * this.width + this.xStart, 64, row * this.depth + this.zStart);
			}
		}
		Command.Fill(this.xStart, 64, this.zStart - 2 * this.depth, this.xStart + this.doors * this.width - 1, 64, this.zStart - 1, "concrete 1");
		Command.Fill(this.xStart, 64, this.rows * this.depth + this.zStart, this.xStart + this.doors * this.width - 1, 64, (this.rows + 2) * this.depth + this.zStart, "concrete 1");
	}

	RespawnExtension(player) {
		Command.Teleport(player, this.xStart + ((this.doors / 2 + Math.random(-1, 1)) * this.width), 66, this.zStart - this.depth, 0, 66, 0);
		Command.Effect(player, "speed", -1, 5);
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 60;
	}

	PlayerHasLeftStartArea(player) {
		return player.position.z >= this.zStart;
	}

	PlayerIsFinished(player) {
		return player.position.z >= this.rows * this.depth + this.zStart;
	}
}