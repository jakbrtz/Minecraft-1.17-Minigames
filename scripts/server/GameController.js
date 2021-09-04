GameController = {
	Game: null,
	Players: new Map(),

	GameDuration: 0,
	Pause: false,

	Update: function (allEntities) {

		allEntities.forEach(entity => {
			if (this.Players.has(entity.id)) {
				this.Players.get(entity.id).Update(entity)
			} else {
				this.Players.set(entity.id, new Player(entity))
			}
		})

		allEntities.forEach(entity => {
			GetTags(entity).forEach(tag => {
				if (tag.startsWith("JakesGames-")) {
					SlashCommand(`/tag ${GetName(entity)} remove ${tag}`)
					tag = tag.substr(11)
					if (tag === "togglePause") {
						this.Pause = !this.Pause
					} else if (tag === "wantsEnd") {
						this.Game.EndGame()
						this.ChangeGame(this.Game.NextGame())
					} else if (tag.startsWith("duration")) {
						this.GameDuration = tag.substr(8) * 20
					} else if (this.Game !== null && !this.Pause && this.Players.has(entity.id)) {
						this.Game.ReceivedTag(this.Players.get(entity.id), tag)
					}
				}
			})
		})

		if (this.Pause) return

		if (this.Game !== null) {
			this.Game.Update()
		} else if (this.Players.size > 0) {
			this.ChangeGame(new Lobby())
		}
	},

	ChangeGame: function (game) {
		this.Game = game
		if (this.Game !== null) {
			this.Game.Setup()
		}
	},

	EntityDied: function (entity, killer) {
		if (this.Game !== null && !this.Pause) {
			if (this.Players.has(entity.id)) {
				this.Game.PlayerDied(this.Players.get(entity.id), killer !== undefined ? this.Players.get(killer.id) : undefined)
			}
		}
	},


	UseItem: function (entity, item) {
		if (this.Game !== null && !this.Pause) {
			if (this.Players.has(entity.id)) {
				this.Game.UseItem(this.Players.get(entity.id), item)
			}
        }
	},

	EntityPlacedBlock: function (entity, position) {
		if (this.Game !== null && !this.Pause && this.Players.has(entity.id)) {
			this.Game.PlayerPlacedBlock(this.Players.get(entity.id), position)
		}
	},

	EntityTriedToDestroyBlock: function (entity, position) {
		if (this.Game !== null && !this.Pause && this.Players.has(entity.id)) {
			this.Game.PlayerTriedToDestroyBlock(this.Players.get(entity.id), position)
		}
	},

	EntityAttack: function (attacker, target) {
		if (this.Game !== null && !this.Pause && this.Players.has(attacker.id) && this.Players.has(target.id)) {
			this.Game.EntityAttack(this.Players.get(attacker.id), this.Players.get(target.id))
		}
	}

}