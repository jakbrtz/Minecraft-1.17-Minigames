DroppingBlocks = class extends this.BaseGame {

	constructor() {
		super()
		this.trackedBlocks = []
		this.layerColours = [2,1,10,4,3]
	}

	SetupOverride() {

		this.ClearWorld()

		for (var i = 0; i < this.layerColours.length; i++) {
			SlashCommand(`/fill -10 ${this.LayerIndexToY(i)} -10 -30 ${this.LayerIndexToY(i)} 10 concrete ${this.layerColours[i]}`)
        }

		SlashCommand(`/spreadplayers -20 0 3 6 @a`)
		SlashCommand(`/gamemode adventure @a`)

		SlashCommand(`/effect @a regeneration 60 1 true`)
		SlashCommand(`/clear @a`)
	}

	UpdateSetupOverride() {
		switch (this.elapsedGameTime) {
			case 0:
				Chat("3...");
				break;
			case 20:
				Chat("2...");
				break;
			case 40:
				Chat("1...");
				break;
			case 60:
				Chat("Start!");
				this.StartGame()
				break;
        }
    }

	UpdateGameOverride() {

		this.players.forEach(player => {
			if (player.deathTimer == -1) {
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
					if (!this.trackedBlocks.some(block => block.position.x == position.x && block.position.y == position.y && block.position.z == position.z) &&
						GetBlock(player.entity, position).__identifier__ == "minecraft:concrete") {
						SlashCommand(`/setblock ${position.x} ${position.y} ${position.z} stained_glass ${this.layerColours[this.YToLayerIndex(position.y)]}`)
						this.trackedBlocks.push({ position: position, remainingTime: 20 })
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

		this.trackedBlocks = this.trackedBlocks.filter(trackedBlock => trackedBlock.remainingTime > 0)

	}

	RespawnOverride(player) {
		SlashCommand(`/spreadplayers -20 0 3 6 ${player.name}`)
	}

	IsGameInProgressOverride() {
		let result = false
		this.players.forEach(player => {
			if (player.position.y > 20) {
				result = true
            }
		})
		return result
	}

	LayerIndexToY(i) {
		return 30 + i * 5
	}

	YToLayerIndex(y) {
		return Math.floor((y - 30) / 5)
    }
}