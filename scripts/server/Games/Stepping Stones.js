SteppingStones = class extends this.Race {

	constructor() {
		super()
		this.PvPMode = `off`

		this.size = 3
		this.gap = 1
		this.rows = 7
		this.columns = 5
	}

	UnknownMaterial(column, row) { return (row + column) % 2 ? "deepslate_bricks" : "polished_blackstone_bricks" }
	SafeMaterial(column, row) { return "end_bricks" }
	DangerMaterial(column, row) { return "lava" }
	StartMaterial() { return "stone" }
	EndMaterial() { return "stone" }
	GapMaterial() { return "lava" }
	HideMaterialOnceDone(platformIsSafe) { return !platformIsSafe }

	BuildWorld() {

		this.trackedPlatforms = new ArrayMultiDimensional([this.columns, this.rows])

		this.xStart = -Math.floor(this.columns * (this.size + this.gap) / 2)
		this.zStart = -Math.floor(this.rows * (this.size + this.gap) / 2)

		for (var row = 0; row < this.rows; row++) {
			const z = this.zStart + row * (this.size + this.gap)
			const y = 64 // - row
			Command.Fill(this.xStart - 1, y - 1, z - 1, this.xStart + this.columns * (this.size + this.gap) - this.gap, y, z + 2, this.GapMaterial());
			for (var column = 0; column < this.columns; column++) {
				const x = this.xStart + column * (this.size + this.gap)
				Command.Fill(x, y, z, x + this.size - 1, y, z + this.size - 1, this.UnknownMaterial(column, row));
				this.trackedPlatforms.Set([column, row], { safe: false, nearbyPlayer: false, previousNearbyPlayer: false, position: { x: x, y: y, z: z } })
			}
		}
		Command.Fill(this.xStart, 64, this.zStart - 10, this.xStart + this.columns * (this.size + this.gap) - 1 - this.gap, 64, this.zStart - 1, this.StartMaterial());
		const endHeight = 64 // - this.rows
		Command.Fill(this.xStart, endHeight, this.rows * (this.size + this.gap) + this.zStart - this.gap, this.xStart + this.columns * (this.size + this.gap) - 1 - this.gap, endHeight, (this.rows + 2) * (this.size + this.gap) + this.zStart, this.StartMaterial());

		let headingRight = true
		let horizontalDistance = 0
		let x = Random.Int(this.columns)
		for (var row = 0; row < this.rows; row++) {
			this.trackedPlatforms.Get([x, row]).safe = true
			const AllowedRight = (x < this.columns - 1) && (headingRight || horizontalDistance < 2)
			const AllowedLeft = (x > 0) && (!headingRight || horizontalDistance < 2)
			horizontalDistance = 0
			if (AllowedRight && (!AllowedLeft || Math.random() < 0.5)) {
				headingRight = true
				while (x < this.columns - 1 && Math.random() < 0.7) {
					x++
					horizontalDistance++
					this.trackedPlatforms.Get([x,row]).safe=true
                }
			} else if (AllowedLeft) {
				headingRight = false
				while (x > 0 && Math.random() < 0.7) {
					x--
					horizontalDistance++
					this.trackedPlatforms.Get([x, row]).safe = true
                }
            }
        }
	}

	RespawnExtension(player) {
		Command.Teleport(player, this.xStart + ((this.columns / 2 + Math.random(-1, 1)) * (this.size + this.gap)), 66, this.zStart - 5, 0, 66, 0);
	}

	UpdateGameExtension() {

		this.trackedPlatforms.forEach(trackedPlatform => {
			trackedPlatform.previousNearbyPlayer = trackedPlatform.nearbyPlayer
			trackedPlatform.nearbyPlayer = false
		})

		this.players.forEach(player => {
			const index = this.IndexFromPosition(player.position)
			if (this.trackedPlatforms.IndicesInRange(index)) {
				this.trackedPlatforms.Get(index).nearbyPlayer = true
			}
		})

		this.trackedPlatforms.forEach((trackedPlatform) => {
			const [column, row] = this.IndexFromPosition(trackedPlatform.position)
			if (trackedPlatform.previousNearbyPlayer !== trackedPlatform.nearbyPlayer) {
				if (trackedPlatform.nearbyPlayer) {
					const material = trackedPlatform.safe ? this.SafeMaterial(column, row) : this.DangerMaterial(column, row)
					Command.Fill(trackedPlatform.position.x, trackedPlatform.position.y, trackedPlatform.position.z, trackedPlatform.position.x + this.size - 1, trackedPlatform.position.y, trackedPlatform.position.z + this.size - 1, material);
				} else if (this.HideMaterialOnceDone(trackedPlatform.safe)) {
					Command.Fill(trackedPlatform.position.x, trackedPlatform.position.y, trackedPlatform.position.z, trackedPlatform.position.x + this.size - 1, trackedPlatform.position.y, trackedPlatform.position.z + this.size - 1, this.UnknownMaterial(column, row));
                }
            }
		})

	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 40
	}

	PlayerHasLeftStartArea(player) {
		return player.position.z >= this.zStart
	}

	PlayerIsFinished(player) {
		return player.position.z >= this.rows * (this.size + this.gap) + this.zStart
	}

	IndexFromPosition(position) {
		return [
			Math.floor((position.x - this.xStart + (this.gap / 2)) / (this.size + this.gap)),
			Math.floor((position.z - this.zStart + (this.gap / 2)) / (this.size + this.gap))
		]
	}
}