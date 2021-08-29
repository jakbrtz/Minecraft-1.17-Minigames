BaseSelection = class extends this.BaseGame {

	constructor() {
		super()
		this.choices = []
	}

	SetupOverride() {
		this.BuildWorldWithoutOptions()
		this.choices.forEach(choice => {
			choice.options.forEach(option => {
				choice.construct(option)
            })
		})
		GameController.Players.forEach(player => {
			this.Respawn(player)
        })
	}

	BuildWorldWithoutOptions() {
		this.ClearWorld()
    }

	UpdateSetupOverride() {
		if (this.elapsedGameTime >= 5) this.StartGame()
    }

	UpdateGameOverride() {
		GameController.Players.forEach(player => {
			this.choices.forEach(choice => {
				choice.options.forEach(option => {
					if (choice.additionalCheck(player, option) && PositionsAreCloseIgnoreY(player.position, option, choice.radius)) {
						choice.onSelect(player, option)
                    }
                })
            })
		})
	}
}