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
		if (this.elapsedGameTime >= 20) this.StartGame()
    }

	UpdateGameOverride() {
		GameController.Players.forEach(player => {
			this.choices.forEach(choice => {
				choice.options.forEach(option => {
					if ((choice.additionalCheck == undefined || choice.additionalCheck(option, player)) && PositionsAreCloseIgnoreY(player.position, option, choice.radius)) {
						choice.onSelect(option, player)
                    }
                })
            })
		})
	}
}