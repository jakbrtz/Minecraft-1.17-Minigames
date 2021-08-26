DroppingBlocks = class extends this.BaseUntimedGame {

	constructor() {
		super()
		this.layerColours = [2, 1, 10, 4, 3]
		this.trackedBlocks = new ArrayMultiDimensional([21, 5, 21], [-30, 0, -10])
	}

	BuildWorld() {
		this.ClearWorld()
		for (var i = 0; i < this.layerColours.length; i++) {
			SlashCommand(`/fill -10 ${this.LayerIndexToY(i)} -10 -30 ${this.LayerIndexToY(i)} 10 concrete ${this.layerColours[i]}`)
		}
	}

	PlacePlayersAtStart() {
		SlashCommand(`/spreadplayers -20 0 3 6 @a`)
	}

	RespawnOverride(player) {
		SlashCommand(`/spreadplayers -20 0 3 6 ${player.name}`)
	}

	UpdateGameOverrideOverride() {

		GameController.Players.forEach(player => {
			if (player.finishTime == -1) {
				let blocksToChange = [{
					x: Math.floor(player.position.x),
					y: Math.floor(player.position.y - 1),
					z: Math.floor(player.position.z)
				}]
				let xfrac = (player.position.x % 1 + 1) % 1 + 0.00001
				if (xfrac >= 0.7) {
					blocksToChange = [...blocksToChange, ...blocksToChange.map(block => {
						return {
							x: block.x + 1,
							y: block.y,
							z: block.z,
						}
					})]
				}
				if (xfrac <= 0.3) {
					blocksToChange = [...blocksToChange, ...blocksToChange.map(block => {
						return {
							x: block.x - 1,
							y: block.y,
							z: block.z,
						}
					})]
				}
				let zfrac = (player.position.z % 1 + 1) % 1 + 0.00001
				if (zfrac >= 0.7) {
					blocksToChange = [...blocksToChange, ...blocksToChange.map(block => {
						return {
							x: block.x,
							y: block.y,
							z: block.z + 1,
						}
					})]
				}
				if (zfrac <= 0.3) {
					blocksToChange = [...blocksToChange, ...blocksToChange.map(block => {
						return {
							x: block.x,
							y: block.y,
							z: block.z - 1,
						}
					})]
				}

				blocksToChange.forEach(position => {
					if (this.trackedBlocks.IndicesInRange([position.x, this.YToLayerIndex(position.y), position.z])) {
						if (this.trackedBlocks.Get([position.x, this.YToLayerIndex(position.y), position.z]) == undefined) {
							SlashCommand(`/setblock ${position.x} ${position.y} ${position.z} stained_glass ${this.layerColours[this.YToLayerIndex(position.y)]}`)
							this.trackedBlocks.Set([position.x, this.YToLayerIndex(position.y), position.z], { remainingTime: 20, position: position })
                        }
                    }
				})

			}
		})

		this.trackedBlocks.forEach(trackedBlock => {
			trackedBlock.remainingTime--
			if (trackedBlock.remainingTime == 0) {
				SlashCommand(`/setblock ${trackedBlock.position.x} ${trackedBlock.position.y} ${trackedBlock.position.z} air`)
			}
		})

	}

	PlayerIsFinished(player) {
		return player.position.y < this.LayerIndexToY(0)
	}

	LayerIndexToY(i) {
		return 30 + i * 5
	}

	YToLayerIndex(y) {
		return Math.floor(y - 30) / 5
	}
}