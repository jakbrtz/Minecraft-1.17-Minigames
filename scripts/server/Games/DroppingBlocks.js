DroppingBlocks = class extends this.Survival {

	constructor() {
		super();
	}

	BuildWorld() {
		this.layerColours = [2, 1, 10, 4, 3]
		this.trackedBlocks = new ArrayMultiDimensional([21, 5, 21], [-10, 0, -10])
		for (let i = 0; i < this.layerColours.length; i++) {
			Command.Fill(-10, this.LayerIndexToY(i), -10, 10, this.LayerIndexToY(i), 10, `concrete ${this.layerColours[i]}`);
		}
	}

	RespawnExtension(player) {
		Command.SpreadPlayers(0, 0, 3, 6, [player]);
		Command.Effect(player, "regeneration", 60);
	}

	UpdateGameExtension() {
		this.players.filter(player => !this.FinishedPlayers.includes(player)).forEach(player => {
			let blocksToChange = [{
				x: Math.floor(player.position.x),
				y: Math.floor(player.position.y - 1),
				z: Math.floor(player.position.z)
			}];
			const xfrac = (player.position.x % 1 + 1) % 1 + 0.00001
			if (xfrac >= 0.7) {
				blocksToChange = [...blocksToChange, ...blocksToChange.map(block => {
					return {
						x: block.x + 1,
						y: block.y,
						z: block.z,
					}
				})];
			}
			if (xfrac <= 0.3) {
				blocksToChange = [...blocksToChange, ...blocksToChange.map(block => {
					return {
						x: block.x - 1,
						y: block.y,
						z: block.z,
					}
				})];
			}
			const zfrac = (player.position.z % 1 + 1) % 1 + 0.00001
			if (zfrac >= 0.7) {
				blocksToChange = [...blocksToChange, ...blocksToChange.map(block => {
					return {
						x: block.x,
						y: block.y,
						z: block.z + 1,
					}
				})];
			}
			if (zfrac <= 0.3) {
				blocksToChange = [...blocksToChange, ...blocksToChange.map(block => {
					return {
						x: block.x,
						y: block.y,
						z: block.z - 1,
					}
				})];
			}

			blocksToChange.forEach(position => {
				if (this.trackedBlocks.IndicesInRange([position.x, this.YToLayerIndex(position.y), position.z])) {
					if (this.trackedBlocks.Get([position.x, this.YToLayerIndex(position.y), position.z]) === undefined) {
						Command.SetBlock(position.x, position.y, position.z, `stained_glass ${this.layerColours[this.YToLayerIndex(position.y)]}`);
						this.trackedBlocks.Set([position.x, this.YToLayerIndex(position.y), position.z], { remainingTime: 20, position: position });
					}
				}
			})
		})

		this.trackedBlocks.forEach(trackedBlock => {
			trackedBlock.remainingTime--;
			if (trackedBlock.remainingTime === 0) {
				Command.SetBlock(trackedBlock.position.x, trackedBlock.position.y, trackedBlock.position.z, "air");
			}
		})

	}

	PlayerIsFinished(player) {
		return player.position.y < this.LayerIndexToY(-1);
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y <= 5;
    }

	LayerIndexToY(i) {
		return 30 + i * 5;
	}

	YToLayerIndex(y) {
		return Math.floor(y - 30) / 5;
	}
}