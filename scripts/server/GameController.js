GameController = {
	Game: null,
	Players: new Map(),
	ElapsedTime: 0,

	GameDuration: 0,
	Pause: false,

	Setup: function () {
		SlashCommand(`/gamerule doimmediaterespawn true`);
		SlashCommand(`/gamerule dodaylightcycle false`);
		SlashCommand(`/gamerule domobspawning false`);
		SlashCommand(`/gamerule doweathercycle false`);
		SlashCommand(`/time set noon`);
		SlashCommand(`/setmaxplayers 30`);
		SlashCommand(`/function debugging/off`);
	},

	Update: function (allEntities) {

		this.ElapsedTime++

		if (this.ElapsedTime === 50) { // todo: something more reliable than waiting 2.5 seconds
			this.Setup()
		}
		if (this.ElapsedTime <= 50) {
			return
        }

		// update player info or add new players
		allEntities.forEach(entity => {
			let player = this.Players.get(entity.id);
			if (!player) {
				player = new Player(entity);
				this.Players.set(entity.id, player);
			}
			player.entity = entity;
			player.position = Find(entity);
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
					SlashCommand(`/tag ${player.name} remove ${tag}`);
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

	EntityDestroyedBlock: function (entity, position) {
		const player = this.Players.get(entity.id)
		if (player && !this.Pause) {
			this.Game.PlayerDestroyedBlock(player, position)
		}
	},

	EntityAttack: function (attackerEntity, targetEntity) {
		const attacker = this.Players.get(attackerEntity.id)
		const target = this.Players.get(targetEntity.id)
		if (this.Game !== null && !this.Pause && attacker && target) {
			this.Game.PlayerAttack(attacker, target)
		}
	}

}