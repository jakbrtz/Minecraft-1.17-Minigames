Selection = class extends this.Game {

	constructor() {
		super()
		this.choices = []
		this.ShowPreGameTimer = false
	}

	SetupGeneral() {
		this.choices = this.GetChoices()
	}

	BuildWorldGeneral() {
		this.choices.forEach(choice => {
			if (choice.construct) {
				choice.options.forEach(choice.construct)
			}
		})
	}

	GetChoices() {
		return []
    }

	UpdateGameGeneral() {
		this.players.forEach(player => {
			this.choices.forEach(choice => {
				choice.options.forEach(option => {
					if ((choice.additionalCheck === undefined || choice.additionalCheck(option, player)) &&
						(choice.radius !== undefined
							? Coordinates.PositionsAreClose(player.position, option, choice.radius, true)
							: (Math.floor(player.position.x) === Math.floor(option.x) && Math.floor(player.position.z) === Math.floor(option.z)))) {
						choice.onSelect(option, player)
					}
                })
            })
		})
	}
}