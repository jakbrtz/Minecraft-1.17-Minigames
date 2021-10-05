BoatRace = class extends this.Race {

	constructor() {
		super()
	}

	BuildWorld() {

		WorldBuilding.Clear()

		SlashCommand(`/structure load boatrace:boatrace -30 60 -13`)
		for (var x = -25; x < 25; x++) {
			for (var i = 0; i < 3; i++) {
				var z = Random.Int(-12, 12)
				var y = Random.Int(61, 67)
				SlashCommand(`/fill ${x} 61 ${z} ${x} ${y} ${z} packed_ice`)
			}
		}
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} -28 66 ${Random.Float(-10, 10)} facing 0 64 0`)
		SlashCommand(`/ride ${player.name} summon_ride boat`)
	}

	PlayerHasLeftStartArea(player) {
		return player.position.x >= -25
	}

	PlayerIsFinished(player) {
		return player.position.x >= 25
	}
}