GameController = {
	GameDuration: 5 * 60 * 20,
	Editor: false,
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
					team: RandomTeam()
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
					}
				}
			})
		})

		if (this.Game != null) {
			this.Game.Update()
		} else if (this.Players.size > 0) {
			this.ChangeGame(new Lobby())
        }
	},

	ChangeGame: function (game) {
		this.Game = game
		this.Game.Setup()
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