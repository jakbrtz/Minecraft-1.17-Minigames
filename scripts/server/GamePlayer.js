GamePlayer = class {
	constructor() {
		this.game = null
		this.editor = false
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
					}
					else {
						switch (tag) {
							case "wantsBridges":
								this.game = new Bridges()
								this.game.includeTestBases = this.editor
								break;
							case "wantsDropper":
								this.game = new DroppingBlocks()
								break;
							case "wantsDoorDash":
								this.game = new DoorDash()
								break;
							case "isEditor":
								this.editor = true
								break;
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