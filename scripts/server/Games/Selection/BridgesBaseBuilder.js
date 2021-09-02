BridgesBaseBuilder = class extends this.BaseSelection {

	constructor() {
		super()
		this.GameMode = 'creative'
	}

	GetChoices() {
		return [
			{
				construct: slot => SlashCommand(`/structure load ${slot.structure} ${slot.x - 14} 50 ${slot.z - 14}`),
				radius: 14,
				additionalCheck: (slot, player) => player.requestedBase != slot.structure,
				onSelect: (slot, player) => {
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
		}
	}

	SetupOverride() {
		SlashCommand(`/give @a concrete 1 14`)
		GameController.Players.forEach(player => {
			player.requestedBase = undefined
		})
	}

	RespawnOverride(player) {
		SlashCommand(`/tp ${player.name} ${RandomFloat(-10, 10)} 66 ${RandomFloat(-10, 10)}`)
	}

	EndGameOverride() {
		this.choices[0].options.forEach(option => {
			SlashCommand(`/structure save ${option.structure} ${option.x - 14} 50 ${option.z - 14} ${option.x + 14} 110 ${option.z + 14} disk`)
		})
	}

	NextGame() {
		return new BridgesBaseSelection()
    }
}