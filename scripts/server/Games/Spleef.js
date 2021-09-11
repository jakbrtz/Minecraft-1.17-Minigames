Spleef = class extends this.RaceOrSurvival {

	constructor() {
		super(false, true)
		this.GameMode = 'survival'
	}

	BuildWorld() {
		WorldBuilding.Clear()
		SlashCommand(`/fill -15 64 -15 15 64 15 snow`)
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${Random.Float(-13, 13)} 66 ${Random.Float(-13, 13)}`)
		SlashCommand(`/give ${player.name} diamond_shovel`)
		SlashCommand(`/give ${player.name} snowball 8`)
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 40
	}
}