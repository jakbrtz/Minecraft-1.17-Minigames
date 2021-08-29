BridgesBaseBuilder = class extends this.BaseSelection {

	constructor() {
		super()

		this.choices = [
			{
				construct: slot => SlashCommand(`/structure load ${slot.structure} ${slot.x - 14} 50 ${slot.z - 14} ${SuggestedRotation(slot)}_degrees`),
				radius: 0,
				additionalCheck: (player, slot) => true,
				onSelect: (player, slot) => { },
				options: []
			}
		]
	}

	BuildWorldWithoutOptions() {
		this.ClearWorld()
		SlashCommand(`/fill -64 64 -64 63 64 63 glass`)
		let slots = [
			{ x: 32, z: 0 },
			{ x: -32, z: 0 },
			{ x: 0, z: 32 },
			{ x: 0, z: -32 },
			{ x: 32, z: 32 },
			{ x: -32, z: -32 },
			{ x: 32, z: -32 },
			{ x: -32, z: 32 },
		]
		for (var i = 0; i < this.teams.length; i++) {
			slots[i].structure = `bases:Basic`
			this.choices[0].construct(slots[i])
			slots[i].structure = `slot${i}`
			this.choices[0].options.push(slots[i])
			this.teams[i].baseBuilderSlot = slots[i]
		}
		SlashCommand(`/gamemode creative @a`)
	}

	RespawnOverride(player) {
		SlashCommand(`/tp ${player.name} ${RandomFloat(-10, 10)} 66 ${RandomFloat(-10, 10)}`)
	}

	EndGameOverride() {
		this.teams.forEach(team => {
			SlashCommand(`/structure save ${team.baseBuilderSlot.structure} ${team.baseBuilderSlot.x - 14} 50 ${team.baseBuilderSlot.z - 14} ${team.baseBuilderSlot.x + 14} 110 ${team.baseBuilderSlot.z + 14} memory`)
		})
		GameController.Players.forEach(player => {
			player.requestedBase = player.team.baseBuilderSlot.structure
		})
    }
}