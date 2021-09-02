BaseSelection = class extends this.BaseGame {

	constructor() {
		super()
		this.choices = []
		this.ShowPreGameTimer = false
	}

	BuildWorld() {
		this.choices = this.GetChoices()
		this.BuildWorldWithoutOptions()
		this.choices.forEach(choice => {
			choice.options.forEach(option => {
				choice.construct(option)
			})
		})
	}

	BuildWorldWithoutOptions() {
		this.ClearWorld()
	}

	GetChoices() {
		return []
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