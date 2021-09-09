SteppingStones = class extends this.RaceOrSurvival {

	constructor() {
		super()
		this.IsRace = true

		this.size = 3
		this.gap = 1
		this.rows = 7
		this.columns = 5

		this.xOffset = -Math.floor(this.columns * (this.size + this.gap) / 2)
		this.zOffset = -Math.floor(this.rows * (this.size + this.gap) / 2)
		this.trackedPlatforms = new ArrayMultiDimensional([this.columns, this.rows])
	}

	UnknownMaterial(column, row) { return (row + column) % 2 ? "deepslate_bricks" : "polished_blackstone_bricks" }
	SafeMaterial(column, row) { return "end_bricks" }
	DangerMaterial(column, row) { return "lava" }
	StartMaterial() { return "stone" }
	EndMaterial() { return "stone" }
	GapMaterial() { return "lava" }
	HideMaterialOnceDone(platformIsSafe) { return !platformIsSafe }

	BuildWorld() {
		WorldBuilding.Clear()

		for (var row = 0; row < this.rows; row++) {
			const z = this.zOffset + row * (this.size + this.gap)
			const y = 64 // - row
			SlashCommand(`/fill ${this.xOffset - 1} ${y-1} ${z-1} ${this.xOffset + this.columns * (this.size + this.gap) - this.gap} ${y} ${z+2} ${this.GapMaterial()}`)
			for (var column = 0; column < this.columns; column++) {
				const x = this.xOffset + column * (this.size + this.gap)
				SlashCommand(`/fill ${x} ${y} ${z} ${x + this.size - 1} ${y} ${z + this.size - 1} ${this.UnknownMaterial(column, row)}`)
				this.trackedPlatforms.Set([column, row], { safe: false, nearbyPlayer: false, previousNearbyPlayer: false, position: { x: x, y: y, z: z } })
			}
		}
		SlashCommand(`/fill ${this.xOffset} 64 ${this.zOffset - 10} ${this.xOffset + this.columns * (this.size + this.gap) - 1 - this.gap} 64 ${this.zOffset - 1} ${this.StartMaterial()}`)
		const endHeight = 64 // - this.rows
		SlashCommand(`/fill ${this.xOffset} ${endHeight} ${this.rows * (this.size + this.gap) + this.zOffset - this.gap} ${this.xOffset + this.columns * (this.size + this.gap) - 1 - this.gap}  ${endHeight} ${(this.rows + 2) * (this.size + this.gap) + this.zOffset} ${this.StartMaterial()}`)

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
		SlashCommand(`/tp ${player.name} ${this.xOffset + ((this.columns / 2 + Math.random(-1, 1)) * (this.size + this.gap))} 66 ${this.zOffset - 5} facing 0 66 0`)
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
					SlashCommand(`/fill ${trackedPlatform.position.x} ${trackedPlatform.position.y} ${trackedPlatform.position.z} ${trackedPlatform.position.x + this.size - 1} ${trackedPlatform.position.y} ${trackedPlatform.position.z + this.size - 1}  ${material}`)
				} else if (this.HideMaterialOnceDone(trackedPlatform.safe)) {
					SlashCommand(`/fill ${trackedPlatform.position.x} ${trackedPlatform.position.y} ${trackedPlatform.position.z} ${trackedPlatform.position.x + this.size - 1} ${trackedPlatform.position.y} ${trackedPlatform.position.z + this.size - 1} ${this.UnknownMaterial(column, row)}`)
                }
            }
		})

	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 40
	}

	PlayerHasLeftStartArea(player) {
		return player.position.z >= this.zOffset
	}

	PlayerIsFinished(player) {
		return player.position.z >= this.rows * (this.size + this.gap) + this.zOffset
	}

	IndexFromPosition(position) {
		return [
			Math.floor((position.x - this.xOffset + (this.gap / 2)) / (this.size + this.gap)),
			Math.floor((position.z - this.zOffset + (this.gap / 2)) / (this.size + this.gap))
		]
	}
}