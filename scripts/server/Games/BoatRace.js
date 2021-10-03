BoatRace = class extends this.Race {

	constructor() {
		super()
	}

	BuildWorld() {

		WorldBuilding.Clear()

		SlashCommand(`/structure load boatrace:boatrace -13 60 -30`)
		for (var z = -25; z < 25; z++) {
			for (var i = 0; i < 3; i++) {
				var x = Random.Int(-12, 12)
				var y = Random.Int(61, 67)
				SlashCommand(`/fill ${x} 61 ${z} ${x} ${y} ${z} packed_ice`)
			}
		}
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${Random.Float(-10, 10)} 66 -28 facing 0 64 0`)
		SlashCommand(`/ride ${player.name} summon_ride boat`)
	}

	PlayerHasLeftStartArea(player) {
		return player.position.z >= -25
	}

	PlayerIsFinished(player) {
		return player.position.z >= 25
	}
}