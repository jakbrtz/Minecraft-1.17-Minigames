GameController = {
	GameDuration: 5 * 60 * 20,
	Pause: false,
	Game: null,
	Players: new Map(),

	Update: function (allEntities) {

		allEntities.forEach(entity => {
			if (this.Players.has(entity.id)) {
				let player = this.Players.get(entity.id)
				player.entity = entity
				player.position = Find(entity)
			} else {
				this.Players.set(entity.id, {
					entity: entity,
					position: Find(entity),
					name: GetName(entity),
					team: RandomTeam(),
					deathTimer: -1,
				})
			}
		})

		allEntities.forEach(entity => {
			GetTags(entity).forEach(tag => {
				if (tag.startsWith("JakesGames-")) {
					SlashCommand(`/tag ${GetName(entity)} remove ${tag}`)
					tag = tag.substr(11)
					if (tag == "togglePause") {
						this.Pause = !this.Pause
                    } else if (tag == "wantsEnd") {
						this.Game.EndGame()
						this.ChangeGame(this.Game.NextGame)
					} else if (tag.startsWith("duration")) {
						this.GameDuration = tag.substr(8) * 20
					} else if (this.Game != null && !this.Pause) {
						this.Game.ReceivedTag(entity, tag)
					}
				}
			})
		})

		if (this.Pause) return

		if (this.Game != null) {
			this.Game.Update()
		} else if (this.Players.size > 0) {
			this.ChangeGame(new Lobby())
			this.EnableTeamsPvP(false)
        }
	},

	ChangeGame: function (game) {
		this.Game = game
		if (this.Game != null) {
			this.Game.Setup()
		}
	},

	EntityDied: function (entity, killer) {
		if (this.Game != null && !this.Pause) {
			this.Game.PlayerDied(entity, killer)
		}
	},

	EntityPlacedBlock: function (entity, position) {
		if (this.Game != null && !this.Pause) {
			this.Game.PlayerPlacedBlock(entity, position)
		}
	},

	EntityTriedToDestroyBlock: function (entity, position) {
		if (this.Game != null && !this.Pause) {
			this.Game.PlayerTriedToDestroyBlock(entity, position)
		}
	},

	EntityAttack: function (attacker, target) {
		if (this.Game != null && !this.Pause) {
			this.Game.EntityAttack(attacker, target)
		}
	},

	EnableTeamsPvP: function (enabled) {
		this.Players.forEach(player => {
			SlashCommand(`/tag @a remove team-${player.team.name}`)
		})
		this.Players.forEach(player => ClearNullifiedDamage(player.entity))
		if (enabled) {
			this.Players.forEach(player => {
				SlashCommand(`/tag ${player.name} add team-${player.team.name}`)
				NullifyDamageFromTag(player.entity, `team-${player.team.name}`)
            })
        }
    }

}