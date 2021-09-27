Match = class extends this.Survival {

	constructor() {
		super()
		this.EndWhenOneRemains = true

		this.platforms = [
			{ x: -3, z: 3, c: 4 },
			{ x: 1, z: 3, c: 6 },
			{ x: -5, z: -1, c: 14 },
			{ x: -1, z: -1, c: 1 },
			{ x: 3, z: -1, c: 5 },
			{ x: -3, z: -5, c: 9 },
			{ x: 1, z: -5, c: 11 },
		]
	}

	BuildWorld() {
		WorldBuilding.Clear()
		this.PutBackPlatforms()
		this.PickNextPlatform()
	}

	PutBackPlatforms() {
		this.platforms.forEach(platform => this.ReplacePlatform(platform, "concrete"))
	}

	PickNextPlatform() {
		this.nextPlatform = Random.Arr(this.platforms)
    }

	ReplacePlatform(platform, block) {
		SlashCommand(`/fill ${platform.x} 64 ${platform.z} ${platform.x + 3} 64 ${platform.z + 3} ${block} ${platform.c}`)
    }

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} 0 66 0`) // todo: wait for platform to respawn
	}

	UpdateGameExtension() {

		switch (this.elapsedGameTime % 100) {
			case 0:
				this.PutBackPlatforms()
				this.PickNextPlatform()
				SlashCommand(`/fill -20 66 -20  20 70 -20 concrete ${this.nextPlatform.c}`)
				SlashCommand(`/fill -20 66 -20 -20 70  20 concrete ${this.nextPlatform.c}`)
				SlashCommand(`/fill  20 66  20  20 70 -20 concrete ${this.nextPlatform.c}`)
				SlashCommand(`/fill  20 66  20 -20 70  20 concrete ${this.nextPlatform.c}`)
				break;
			case 70:
				this.platforms.filter(platform => platform !== this.nextPlatform).forEach(platform => {
					this.ReplacePlatform(platform, "stained_glass")
				})
				break;
			case 80:
				this.platforms.filter(platform => platform !== this.nextPlatform).forEach(platform => {
					this.ReplacePlatform(platform, "air")
				})
				break;
        }
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 40
	}
}