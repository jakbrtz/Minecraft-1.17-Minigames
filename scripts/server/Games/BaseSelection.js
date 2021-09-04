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
		WorldBuilding.Clear()
	}

	GetChoices() {
		return []
    }

	UpdateGameExtension() {
		this.players.forEach(player => {
			this.choices.forEach(choice => {
				choice.options.forEach(option => {
					if ((choice.additionalCheck === undefined || choice.additionalCheck(option, player)) && Coordinates.PositionsAreClose(player.position, option, choice.radius, true)) {
						choice.onSelect(option, player)
                    }
                })
            })
		})
	}
}