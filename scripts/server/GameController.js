GameController = {
	Game: null,
	Players: new Map(),

	GameDuration: 0,
	Pause: false,

	Update: function (allEntities) {

		// update player info or add new players
		allEntities.forEach(entity => {
			if (this.Players.has(entity.id)) {
				this.Players.get(entity.id).Update(entity)
			} else {
				const player = new Player(entity)
				this.Players.set(entity.id, player)
			}
		})

		// delete players that have left
		for (let [id, player] of this.Players) {
			if (!allEntities.some(entity => entity === player.entity)) {
				if (this.Game) {
					this.Game.RemovePlayer(player)
				}
				this.Players.delete(id)
			}
		}

		// check if any player has a tag
		allEntities.forEach(entity => {
			GetTags(entity).forEach(tag => {
				if (tag.startsWith("JakesGames-")) {
					const player = this.Players.get(entity.id)
					SlashCommand(`/tag ${player.name} remove ${tag}`)
					tag = tag.substr(11)
					if (tag === "togglePause") {
						this.Pause = !this.Pause
					} else if (tag === "wantsEnd") {
						this.Game.EndGame()
						this.ChangeGame(this.Game.NextGame())
					} else if (tag.startsWith("duration")) {
						this.GameDuration = tag.substr(8) * 20
					} else if (this.Game !== null && !this.Pause && player) {
						this.Game.ReceivedTag(player, tag)
					}
				}
			})
		})

		if (this.Game) {
			if (!this.Pause) {
				this.Game.Update()
            }
		} else if (this.Players.size > 0) {
			this.ChangeGame(new Lobby())
        }
	},

	ChangeGame: function (game) {
		this.Game = game
		if (this.Game !== null) {
			this.Game.Setup()
			this.Players.forEach(player => this.Game.AddPlayer(player))
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