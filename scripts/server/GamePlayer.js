GamePlayer = class {
	constructor() {
		this.game = null
	}

	Update() {
		allEntities.forEach(entity => {
			GetTags(entity).forEach(tag => {
				if (tag.startsWith("JakesGames-")) {
					SlashCommand(`/tag ${GetName(entity)} remove ${tag}`)
					tag = tag.substr(11)
					if (tag == "wantsEnd") {
						this.game = null
						Chat("Game has been Terminated")
					} else if (this.game != null) {
						this.game.ReceivedTag(entity, tag)
					} else {
						if (tag == "wantsBridges") {
							this.game = new Bridges()
						} else if (tag == "wantsBridges") {
							this.game = new DroppingBlocks()
						} else if (tag == "wantsBridges") {
							this.game = new DoorDash()
						} else if (tag == "isEditor") {
							Globals.Editor = true
						} else if (tag.startsWith("duration")) {
							Globals.GameDuration = tag.substr(8) * 20
                        }

						if (this.game != null) {
							this.game.Setup()
						}
					}
				}
			})
		})

		if (this.game != null) {

			this.game.Update()
			if (!this.game.IsGameInProgress()) {
				this.game.EndGame()
				this.game = null
			}

		}
	}

	EntityDied(entity, killer) {
		if (this.game != null) {
			this.game.PlayerDied(entity, killer)
		}
	}
}