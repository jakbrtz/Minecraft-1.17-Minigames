QuickRespawn = class extends this.ScoredGame {

	constructor(teams) {
		super()
		this.GroupScoreByTeam = teams
	}

	BuildWorld() {
		WorldBuilding.Clear()
		const platforms = ["arenas:desert", "arenas:house", "arenas:nether", "arenas:planks"]
		SlashCommand(`/structure load ${Random.Arr(platforms)} -16 63 -16   0_degrees`)
		SlashCommand(`/structure load ${Random.Arr(platforms)}   0 63 -16  90_degrees`)
		SlashCommand(`/structure load ${Random.Arr(platforms)}   0 63   0 180_degrees`)
		SlashCommand(`/structure load ${Random.Arr(platforms)} -16 63   0 270_degrees`)
	}

	RespawnExtension(player) {
		SlashCommand(`/give ${player.name} diamond_sword`)
		SlashCommand(`/spreadplayers 0 0 5 15 ${player.name}`)
	}

	PlayerDiedExtension(player, killer) {
		if (!this.GameIsComplete && killer !== undefined) {
			killer.score++
			this.UpdateScore()
		}
	}
}