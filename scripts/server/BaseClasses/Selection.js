Selection = class extends this.Game {

	constructor() {
		super()
		this.choices = []
		this.ShowPreGameTimer = false
	}

	BuildWorld() {
		this.choices = this.GetChoices()
		this.BuildWorldWithoutOptions()
		this.choices.forEach(choice => {
			choice.options.forEach(choice.construct)
		})
	}

	BuildWorldWithoutOptions() {
		WorldBuilding.Clear()
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