Shooters = class extends this.BaseRaceOrSurvival {

	constructor() {
		super()
		this.IsRace = false
	}

	BuildWorld() {
		this.ClearWorld()

		SlashCommand(`/structure load shooters:barracks -9 64 -16 0_degrees`)
		SlashCommand(`/structure load shooters:barracks 14 64 -9 90_degrees`)
		SlashCommand(`/structure load shooters:barracks -9 64 14 180_degrees`)
		SlashCommand(`/structure load shooters:barracks -16 64 -9 270_degrees`)

		for (var i = -10; i <= 10; i+=5) {
			SlashCommand(`/fill ${i} 64 -10 ${i} 64 10 bone_block`)
			SlashCommand(`/fill -10 64 ${i} 10 64 ${i} bone_block`)
		}

		for (var i = -6; i <= 6; i += 6) {
			SlashCommand(`/summon skeleton ${i} 65 15`)
			SlashCommand(`/summon skeleton ${i} 65 -15`)
			SlashCommand(`/summon skeleton 15 65 ${i}`)
			SlashCommand(`/summon skeleton -15 65 ${i}`)
        }
	}

	RespawnExtension(player) {
		if (RandomBool()) {
			SlashCommand(`/tp ${player.name} ${(RandomInt(3) - 1) * 5} 66 ${RandomFloat(-10, 10)}`)
		} else {
			SlashCommand(`/tp ${player.name} ${RandomFloat(-10, 10)} 66 ${(RandomInt(3) - 1) * 5}`)
		}
		SlashCommand(`/effect ${player.name} resistance 3 15 true`)
		SlashCommand(`/effect ${player.name} invisibility 3 15 false`)
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 40
	}
}