Shooters = class extends this.BaseRaceOrSurvival {

	constructor() {
		super()
		this.IsRace = false
	}

	BuildWorld() {
		WorldBuilding.Clear()

		SlashCommand(`/structure load shooters:barracks -9 64 -16 0_degrees`)
		SlashCommand(`/structure load shooters:barracks -9 64 14 180_degrees`)

		for (var i = -9; i <= 9; i += 6) {
			SlashCommand(`/fill ${i} 64 -9 ${i} 64 9 bone_block`)
			SlashCommand(`/fill -9 64 ${i} 9 64 ${i} bone_block`)
		}

		for (var i = -6; i <= 6; i += 6) {
			SlashCommand(`/summon skeleton ${i} 65 15`)
			SlashCommand(`/summon skeleton ${i} 65 -15`)
        }
	}

	RespawnExtensionExtension(player) {
		if (Random.Bool()) {
			SlashCommand(`/tp ${player.name} ${(Random.Int(4) - 1.5) * 6} 66 ${Random.Float(-9, 9)}`)
		} else {
			SlashCommand(`/tp ${player.name} ${Random.Float(-9, 9)} 66 ${(Random.Int(4) - 1.5) * 6}`)
		}
		SlashCommand(`/effect ${player.name} resistance 3 15 true`)
		SlashCommand(`/effect ${player.name} invisibility 3 15 false`)
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 40
	}
}