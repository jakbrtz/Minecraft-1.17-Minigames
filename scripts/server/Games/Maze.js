Maze = class extends this.Race {

	constructor() {
		super();
		this.mazeSize = [5, 2, 5];
		this.cellSize = 5;
	}

	BuildWorld() {

		const mazeNodes = new ArrayMultiDimensional(this.mazeSize);

		let current = [this.mazeSize[0] - 1, 0, this.mazeSize[2] - 1];
		mazeNodes.Set(current, []);
		const stack = [current];

		while (stack.length > 0) {
			current = stack[stack.length - 1];

			const options = []
			const AddIfAllowed = indices => {
				if (mazeNodes.IndicesInRange(indices) && !mazeNodes.Get(indices)) {
					options.push(indices);
				}
			}
			AddIfAllowed([current[0] - 1, current[1], current[2]]);
			AddIfAllowed([current[0] + 1, current[1], current[2]]);
			AddIfAllowed([current[0], current[1] - 1, current[2]]);
			AddIfAllowed([current[0], current[1] + 1, current[2]]);
			AddIfAllowed([current[0], current[1], current[2] - 1]);
			AddIfAllowed([current[0], current[1], current[2] + 1]);

			if (options.length > 0) {
				const next = Random.Arr(options);
				mazeNodes.Set(next, [mazeNodes.Get(current)]);
				mazeNodes.Get(current).push(mazeNodes.Get(next));
				stack.push(next);
			} else {
				stack.pop();
			}
		}

		for (let x = 0; x <= mazeNodes.sizes[0]; x++) {
			for (let y = 0; y <= mazeNodes.sizes[1]; y++) {
				for (let z = 0; z <= mazeNodes.sizes[2]; z++) {
					current = [x, y, z];

					const currentInRange = mazeNodes.IndicesInRange(current);
					const NeighbourIsClear = indices => {
						const indicesInRange = mazeNodes.IndicesInRange(indices);

						if (!currentInRange && !indicesInRange) return true;
						return currentInRange && indicesInRange &&
							mazeNodes.Get(current).includes(mazeNodes.Get(indices));
					}

					const x1 = this.XIndexToPosition(current[0]);
					const y1 = this.YIndexToPosition(current[1]);
					const z1 = this.ZIndexToPosition(current[2]);
					const x2 = this.XIndexToPosition(current[0] + 1);
					const y2 = this.YIndexToPosition(current[1] + 1);
					const z2 = this.ZIndexToPosition(current[2] + 1);

					if (!NeighbourIsClear([current[0] - 1, current[1], current[2]])) {
						Command.Fill(x1, y1, z1, x1, y2, z2, "stained_glass");
					}
					if (!NeighbourIsClear([current[0], current[1] - 1, current[2]])) {
						Command.Fill(x1, y1, z1, x2, y1, z2, "stained_glass");
					}
					if (!NeighbourIsClear([current[0], current[1], current[2] - 1])) {
						Command.Fill(x1, y1, z1, x2, y2, z1, "stained_glass");
					}
				}
			}
		}

		this.start = {
			x: this.XIndexToPosition(0) + this.cellSize / 2,
			y: this.YIndexToPosition(0) + 1,
			z: this.ZIndexToPosition(0) + this.cellSize / 2,
		};

		this.goal = {
			x: this.XIndexToPosition(this.mazeSize[0] - 1) + this.cellSize / 2,
			y: this.YIndexToPosition(0) + 1,
			z: this.ZIndexToPosition(this.mazeSize[2] - 1) + this.cellSize / 2,
		};

		Command.Fill(this.goal.x - this.cellSize / 2 + 1, this.goal.y - 1, this.goal.z - this.cellSize / 2 + 1, this.goal.x + this.cellSize / 2 - 1, this.goal.y - 1, this.goal.z + this.cellSize / 2 - 1, "concrete 1");
	}

	RespawnExtension(player) {
		Command.Teleport(player, this.start.x, this.start.y, this.start.z);
		Command.Effect(player, "jump_boost", -1, 5);
	}

	XIndexToPosition(index) {
		return (index - this.mazeSize[0] / 2) * this.cellSize;
	}

	YIndexToPosition(index) {
		return index * this.cellSize + 64;
	}

	ZIndexToPosition(index) {
		return (index - this.mazeSize[2] / 2) * this.cellSize;
	}

	PlayerHasLeftStartArea(player) {
		return !Coordinates.PositionsAreClose(player.position, this.start, this.cellSize / 2, false);
	}

	PlayerIsFinished(player) {
		return Coordinates.PositionsAreClose(player.position, this.goal, this.cellSize / 2, false);
	}
}