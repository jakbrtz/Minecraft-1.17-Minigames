BombsAway = class extends this.RaceOrSurvival {

	constructor() {
		super()
		this.IsRace = false
	}

	BuildWorld() {
		WorldBuilding.Clear()
		SlashCommand(`/fill -15 64 -15 15 64 15 bedrock`)
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${Random.Float(-13, 13)} 66 ${Random.Float(-13, 13)}`)
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 40
	}

	UpdateGameExtension() {
		if (this.elapsedGameTime % 10 === 0) {
			SlashCommand(`/summon tnt ${Random.Float(-15, 15)} 70 ${Random.Float(-15, 15)}`)
        }
	}
}