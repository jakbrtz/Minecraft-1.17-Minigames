Parkour = class extends this.RaceOrSurvival {

	constructor() {
		super()
		this.IsRace = true

		this.checkPoints = [
			{ x: -16, z: -16 },
			{ x:  16, z: -16 },
			{ x:  16, z:  16 },
			{ x: -16, z:  16 },
		]
	}

	BuildWorld() {
		WorldBuilding.Clear()

		let order = []
		for (var i = 0; i < 8; i++) {
			order.push(`parkour:parkour${i}`)
		}
		Random.Shuffle(order)

		SlashCommand(`/fill -22 64 -22 -11 64 -11 concrete 1`)
		SlashCommand(`/fill  21 64 -22  10 64 -11 concrete 1`)
		SlashCommand(`/fill -22 64  21 -11 64  10 concrete 1`)
		SlashCommand(`/fill  21 64  21  10 64  10 concrete 1`)

		SlashCommand(`/structure load ${order[0]} -10 61 -21   0_degrees`)
		SlashCommand(`/structure load ${order[1]}  11 61 -10  90_degrees`)
		SlashCommand(`/structure load ${order[2]} -10 61  11 180_degrees`)
		SlashCommand(`/structure load ${order[3]} -21 61 -10 270_degrees`)

		this.players.forEach(player => player.checkPoint = 0) // todo: is this the right place to put it?
	}

	RespawnExtension(player) {
		const x = this.checkPoints[player.checkPoint % 4].x + Random.Float(-3, 3)
		const z = this.checkPoints[player.checkPoint % 4].z + Random.Float(-3, 3)
		const facingX = this.checkPoints[(player.checkPoint + 1) % 4].x
		const facingZ = this.checkPoints[(player.checkPoint + 1) % 4].z
		SlashCommand(`/tp ${player.name} ${x} 66 ${z} facing ${facingX} 66 ${facingZ}`)
	}

	PlayerIsOutOfBounds(player) {
		return player.position.y < 50
	}

	PlayerHasLeftStartArea(player) {
		return !Coordinates.PositionsAreClose(player.position, this.checkPoints[0], 6, true)
	}

	PlayerIsFinished(player) {
		return player.checkPoint >= 4
	}

	UpdateGameExtension() {

		this.players.forEach(player => {
			if (player.position.y > 64 && Coordinates.PositionsAreClose(player.position, this.checkPoints[(player.checkPoint + 1) % 4], 6, true)) {
				player.checkPoint++
				Chat(`${player.name} has reached \u00a7bcheckpoint ${player.checkPoint}!`)
            }
		})

	}
}