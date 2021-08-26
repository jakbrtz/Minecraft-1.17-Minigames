SteppingStones = class extends this.BaseUntimedGame {

	constructor() {
		super()

		this.size = 3
		this.gap = 1
		this.rows = 8
		this.columns = 6

		this.xOffset = -Math.floor(this.columns * (this.size + this.gap) / 2)
		this.zOffset = -Math.floor(this.rows * (this.size + this.gap) / 2)
		this.trackedBlocks = new ArrayMultiDimensional([this.columns, this.rows])
	}

	UnknownMaterial(column, row) { return (row + column) % 2 ? "deepslate_bricks" : "polished_blackstone_bricks" }
	SafeMaterial(column, row) { return "concrete 5" }
	DangerMaterial(column, row) { return "lava" }
	StartMaterial() { return "stone" }
	EndMaterial() { return "stone" }
	GapMaterial() { return "lava" }
	HideMaterialOnceDone() { return true }

	BuildWorld() {
		this.ClearWorld()

		SlashCommand(`/fill ${this.xOffset - 1} 63 ${this.zOffset - 11} ${this.xOffset + this.columns * (this.size + this.gap) - this.gap} 64 ${(this.rows + 2) * (this.size + this.gap) + this.zOffset + 1} ${this.GapMaterial()}`)

		for (var row = 0; row < this.rows; row++) {
			for (var column = 0; column < this.columns; column++) {
				let x = this.xOffset + column * (this.size + this.gap)
				let z = this.zOffset + row * (this.size + this.gap)
				SlashCommand(`/fill ${x} 64 ${z} ${x + this.size - 1} 64 ${z + this.size - 1} ${this.UnknownMaterial(column, row)}`)
				this.trackedBlocks.Set([column, row], { safe: false, nearbyPlayer: false, previousNearbyPlayer: false, position: { x: x, z: z } })
			}
		}
		SlashCommand(`/fill ${this.xOffset} 64 ${this.zOffset - 10} ${this.xOffset + this.columns * (this.size + this.gap) - 1 - this.gap} 64 ${this.zOffset - 1} ${this.StartMaterial()}`)
		SlashCommand(`/fill ${this.xOffset} 64 ${this.rows * (this.size + this.gap) + this.zOffset - this.gap} ${this.xOffset + this.columns * (this.size + this.gap) - 1 - this.gap} 64 ${(this.rows + 2) * (this.size + this.gap) + this.zOffset} ${this.StartMaterial()}`)

		let headingRight = true
		let horizontalDistance = 0
		let x = RandomInt(this.columns)
		for (var row = 0; row < this.rows; row++) {
			this.trackedBlocks.Get([x, row]).safe = true
			let AllowedRight = (x < this.columns - 1) && (headingRight || horizontalDistance < 2)
			let AllowedLeft = (x > 0) && (!headingRight || horizontalDistance < 2)
			horizontalDistance = 0
			if (AllowedRight && (!AllowedLeft || Math.random() < 0.5)) {
				headingRight = true
				while (x < this.columns - 1 && Math.random() < 0.7) {
					x++
					horizontalDistance++
					this.trackedBlocks.Get([x,row]).safe=true
                }
			} else if (AllowedLeft) {
				headingRight = false
				while (x > 0 && Math.random() < 0.7) {
					x--
					horizontalDistance++
					this.trackedBlocks.Get([x, row]).safe = true
                }
            }
        }

		// todo: use different word instead of block
	}

	PlacePlayersAtStart() {
		SlashCommand(`/spreadplayers ${this.xOffset + Math.floor(this.columns * (this.size + this.gap) / 2)} ${this.zOffset - 5} 3 4 @a`)
	}

	RespawnOverride(player) {
		SlashCommand(`/spreadplayers ${this.xOffset + Math.floor(this.columns * (this.size + this.gap) / 2)} ${this.zOffset - 5} 3 4 ${player.name}`)
	}

	UpdateGameOverrideOverride() {

		this.trackedBlocks.forEach(trackedBlock => {
			trackedBlock.previousNearbyPlayer = trackedBlock.nearbyPlayer
			trackedBlock.nearbyPlayer = false
		})

		GameController.Players.forEach(player => {
			if (player.position.y > 60) {
				let index = this.IndexFromPosition(player.position)
				if (this.trackedBlocks.IndicesInRange(index)) {
					this.trackedBlocks.Get(index).nearbyPlayer = true
				}
			}
		})

		this.trackedBlocks.forEach((trackedBlock) => {
			let [column, row] = this.IndexFromPosition(trackedBlock.position)
			if (trackedBlock.previousNearbyPlayer != trackedBlock.nearbyPlayer) {
				if (trackedBlock.nearbyPlayer) {
					if (trackedBlock.safe) {
						SlashCommand(`/fill ${trackedBlock.position.x} 64 ${trackedBlock.position.z} ${trackedBlock.position.x + this.size - 1} 64 ${trackedBlock.position.z + this.size - 1}  ${this.SafeMaterial(column, row)}`)
					}
					else {
						SlashCommand(`/fill ${trackedBlock.position.x} 64 ${trackedBlock.position.z} ${trackedBlock.position.x + this.size - 1} 64 ${trackedBlock.position.z + this.size - 1} ${this.DangerMaterial(column, row)}`)
                    }
				} else if (this.HideMaterialOnceDone()) {
					SlashCommand(`/fill ${trackedBlock.position.x} 64 ${trackedBlock.position.z} ${trackedBlock.position.x + this.size - 1} 64 ${trackedBlock.position.z + this.size - 1} ${this.UnknownMaterial(column, row)}`)
                }
            }
		})

	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 60 || (!this.gameHasStarted && player.position.z >= this.zOffset)
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