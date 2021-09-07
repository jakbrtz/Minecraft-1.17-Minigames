BombsAway = class extends this.BaseRaceOrSurvival {

	constructor() {
		super()
		this.IsRace = false
	}

	BuildWorld() {
		WorldBuilding.Clear()
		SlashCommand(`/fill -15 64 -15 15 64 15 bedrock`)
	}

	RespawnExtensionExtension(player) {
		SlashCommand(`/tp ${player.name} ${Random.Float(-13, 13)} 66 ${Random.Float(-13, 13)}`)
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 40
	}

	UpdateGameExtensionExtension() {
		if (this.elapsedGameTime % 10 === 0) {
			SlashCommand(`/summon tnt ${Random.Float(-15, 15)} 70 ${Random.Float(-15, 15)}`)
        }
	}
}