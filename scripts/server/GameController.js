GameController = {
	GameDuration: 5 * 60 * 20,
	Editor: false,
	Game: null,
	Players: new Map(),

	Update: function () {

		allEntities.forEach(entity => {
			if (this.Players.has(entity.id)) {
				let player = this.Players.get(entity.id)
				player.entity = entity
				player.position = Find(entity)
			} else {
				this.Players.set(entity.id, {
					entity: entity,
					position: Find(entity),
					name: GetName(entity)
				})
			}
		})

		allEntities.forEach(entity => {
			GetTags(entity).forEach(tag => {
				if (tag.startsWith("JakesGames-")) {
					SlashCommand(`/tag ${GetName(entity)} remove ${tag}`)
					tag = tag.substr(11)
					if (tag == "wantsEnd") {
						if (this.Game == null) {
							Chat("No game is running")
						} else {
							this.Game = null
							Chat("Game has been Terminated")
						}
					} else if (tag == "isEditor") {
						this.Editor = true
					} else if (tag.startsWith("duration")) {
						this.GameDuration = tag.substr(8) * 20
					} else if (this.Game != null) {
						this.Game.ReceivedTag(entity, tag)
					} else {
						if (tag == "wantsBridges") {
							this.Game = new Bridges()
						} else if (tag == "wantsDropper") {
							this.Game = new DroppingBlocks()
						} else if (tag == "wantsDoorDash") {
							this.Game = new DoorDash()
						} else if (tag == "wantsQuickRespawn") {
							this.Game = new QuickRespawn()
						} else if (tag == "wantsPaint") {
							this.Game = new Paint()
						} else if (tag == "wantsSteppingStones") {
							this.Game = new SteppingStones()
						}
						if (this.Game != null) {
							this.Game.Setup()
						}
					}
				}
			})
		})

		if (this.Game != null) {
			this.Game.Update()
			if (!this.Game.IsGameInProgress()) {
				this.Game.EndGame()
				this.Game = null
			}
		}
	},

	EntityDied: function (entity, killer) {
		if (this.Game != null) {
			this.Game.PlayerDied(entity, killer)
		}
	},

	EntityPlacedBlock: function (entity, position) {
		if (this.Game != null) {
			this.Game.PlayerPlacedBlock(entity, position)
		}
	}

}