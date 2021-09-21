Maze = class extends this.RaceOrSurvival {

	constructor() {
		super(true)
		this.mazeSize = [5, 2, 5]
		this.cellSize = 5
	}

	BuildWorld() {
		WorldBuilding.Clear()

		const mazeNodes = new ArrayMultiDimensional(this.mazeSize)

		var current = [this.mazeSize[0] - 1, 0, this.mazeSize[2] - 1]
		mazeNodes.Set(current, [])
		const stack = [current]

		while (stack.length > 0) {
			current = stack[stack.length - 1]

			const options = []
			const AddIfAllowed = indices => {
				if (mazeNodes.IndicesInRange(indices) && !mazeNodes.Get(indices)) {
					options.push(indices)
				}
			}
			AddIfAllowed([current[0] - 1, current[1], current[2]])
			AddIfAllowed([current[0] + 1, current[1], current[2]])
			AddIfAllowed([current[0], current[1] - 1, current[2]])
			AddIfAllowed([current[0], current[1] + 1, current[2]])
			AddIfAllowed([current[0], current[1], current[2] - 1])
			AddIfAllowed([current[0], current[1], current[2] + 1])

			if (options.length > 0) {
				const next = Random.Arr(options)
				mazeNodes.Set(next, [mazeNodes.Get(current)])
				mazeNodes.Get(current).push(mazeNodes.Get(next))
				stack.push(next)
			} else {
				stack.pop()
			}
		}

		for (var x = 0; x <= mazeNodes.sizes[0]; x++) {
			for (var y = 0; y <= mazeNodes.sizes[1]; y++) {
				for (var z = 0; z <= mazeNodes.sizes[2]; z++) {
					current = [x, y, z]

					const currentInRange = mazeNodes.IndicesInRange(current)
					const NeighbourIsClear = indices => {
						const indicesInRange = mazeNodes.IndicesInRange(indices)

						if (!currentInRange && !indicesInRange) return true
						return currentInRange && indicesInRange &&
							mazeNodes.Get(current).includes(mazeNodes.Get(indices))
					}

					const x1 = this.XIndexToPosition(current[0])
					const y1 = this.YIndexToPosition(current[1])
					const z1 = this.ZIndexToPosition(current[2])
					const x2 = this.XIndexToPosition(current[0] + 1)
					const y2 = this.YIndexToPosition(current[1] + 1)
					const z2 = this.ZIndexToPosition(current[2] + 1)

					if (!NeighbourIsClear([current[0] - 1, current[1], current[2]])) {
						SlashCommand(`/fill ${x1} ${y1} ${z1} ${x1} ${y2} ${z2} stained_glass`)
					}
					if (!NeighbourIsClear([current[0], current[1] - 1, current[2]])) {
						SlashCommand(`/fill ${x1} ${y1} ${z1} ${x2} ${y1} ${z2} stained_glass`)
					}
					if (!NeighbourIsClear([current[0], current[1], current[2] - 1])) {
						SlashCommand(`/fill ${x1} ${y1} ${z1} ${x2} ${y2} ${z1} stained_glass`)
					}
				}
			}
		}

		this.start = {
			x: this.XIndexToPosition(0) + this.cellSize / 2,
			y: this.YIndexToPosition(0) + 1,
			z: this.ZIndexToPosition(0) + this.cellSize / 2,
		}

		this.goal = {
			x: this.XIndexToPosition(this.mazeSize[0] - 1) + this.cellSize / 2,
			y: this.YIndexToPosition(0) + 1,
			z: this.ZIndexToPosition(this.mazeSize[2] - 1) + this.cellSize / 2,
		}

		SlashCommand(`/fill ${this.goal.x - this.cellSize / 2 + 1} ${this.goal.y - 1} ${this.goal.z - this.cellSize / 2 + 1} ${this.goal.x + this.cellSize / 2 - 1} ${this.goal.y - 1} ${this.goal.z + this.cellSize / 2 - 1} concrete 1`)
	}

	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${this.start.x} ${this.start.y} ${this.start.z}`)
		SlashCommand(`/effect ${player.name} jump_boost 100000000 5 true`)
	}

	XIndexToPosition(index) {
		return (index - this.mazeSize[0] / 2) * this.cellSize
	}

	YIndexToPosition(index) {
		return index * this.cellSize + 64
	}

	ZIndexToPosition(index) {
		return (index - this.mazeSize[2] / 2) * this.cellSize
	}

	PlayerHasLeftStartArea(player) {
		return !Coordinates.PositionsAreClose(player.position, this.start, this.cellSize / 2, false)
	}

	PlayerIsFinished(player) {
		return Coordinates.PositionsAreClose(player.position, this.goal, this.cellSize / 2, false)
	}
}