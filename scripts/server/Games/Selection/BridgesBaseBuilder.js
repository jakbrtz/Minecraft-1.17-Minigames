BridgesBaseBuilder = class extends this.BaseSelection {

	constructor() {
		super()

		this.choices = [
			{
				construct: slot => SlashCommand(`/structure load ${slot.structure} ${slot.x - 14} 50 ${slot.z - 14} ${SuggestedRotation(slot)}_degrees`),
				radius: 14,
				additionalCheck: (player, slot) => player.requestedBase != slot.structure && slot.needsSaving,
				onSelect: (player, slot) => {
					player.requestedBase = slot.structure
					SlashCommand(`/tell ${player.name} you are working in ${slot.structure}`)
				},
				options: [
					{ x: 32, z: 0 },
					{ x: -32, z: 0 },
					{ x: 0, z: 32 },
					{ x: 0, z: -32 },
					{ x: 32, z: 32 },
					{ x: -32, z: -32 },
					{ x: 32, z: -32 },
					{ x: -32, z: 32 },
				]
			}
		]
	}

	BuildWorldWithoutOptions() {
		this.ClearWorld()
		SlashCommand(`/fill -64 64 -64 63 64 63 glass`)
		let slots = this.choices[0].options
		for (var i = 0; i < slots.length; i++) {
			slots[i].structure = `bases:Basic`
			this.choices[0].construct(slots[i])
			slots[i].structure = `slot${i}`
			slots[i].needsSaving = false
		}
		SlashCommand(`/gamemode creative @a`)
	}

	RespawnOverride(player) {
		SlashCommand(`/tp ${player.name} ${RandomFloat(-10, 10)} 66 ${RandomFloat(-10, 10)}`)
	}

	PlayerPlacedBlockOverride(player, position) {
		this.choices[0].options.forEach(slot => {
			if (PositionsAreCloseIgnoreY(position, slot, 14)) {
				slot.needsSaving = true
			}
		})
	}

	EndGameOverride() {
		this.choices[0].options.forEach(option => {
			if (option.needsSaving) {
				SlashCommand(`/structure save ${option.structure} ${option.x - 14} 50 ${option.z - 14} ${option.x + 14} 110 ${option.z + 14} disk`)
			}
		})
    }
}