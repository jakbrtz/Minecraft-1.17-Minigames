BaseSurvivalGame = class extends this.BaseGame {

	constructor() {
		super()
		this.losers = []
	}

	SetupOverride() {

		this.BuildWorld()
		this.PlacePlayersAtStart()

		SlashCommand(`/gamemode adventure @a`)
		SlashCommand(`/effect @a regeneration 60 1 true`)
		SlashCommand(`/clear @a`)
	}

	BuildWorld() {

	}

	PlacePlayersAtStart() {
		
    }

	UpdateSetupOverride() {
		switch (this.elapsedGameTime) {
			case 0:
				Chat("3...");
				break;
			case 20:
				Chat("2...");
				break;
			case 40:
				Chat("1...");
				break;
			case 60:
				Chat("Start!");
				this.StartGame()
				break;
        }
    }

	UpdateGameOverride() {
		this.players.forEach(player => {
			if (this.elapsedGameTime > 20 && player.position.y < 20 && !this.losers.includes(player)) {
				this.losers.push(player)
				this.UpdateScore()
			}
		})
		this.UpdateGameOverrideOverride()
	}

	UpdateGameOverrideOverride() {
	}

	IsGameInProgressOverride() {
		return this.losers.length < this.players.size
	}

	UpdateScore() {
		let lines = []
		for (var i = 0; i < this.losers.length; i++) {
			lines.push({ text: this.losers[i].name, value: this.players.size - i })
		}
		this.CreateScoreboard("Results", lines)
	}
}