const BaseInfo = {
    "bases:Temple": {
        goal: { x: 0, y: 0, z: 0 }
    },
    "bases:GoldBlocks": {
        goal: { x: 0, y: 0, z: 0 },
    },
    "slot2": {
        goal: { x: 0, y: 0, z: 0 }
    },
    "slot3": {
        goal: { x: 0, y: 0, z: 0 }
    },
}

this.Bases = {

    StructureSpawn: function (name, center, rotation) {
        return Coordinates.Offset(center, rotation, { x: 0, y: 1, z: -8 })
    },

    StructureGoal: function (name, center, rotation) {
        if (BaseInfo[name] === undefined || BaseInfo[name].goal === undefined) {
            return Coordinates.Offset(center, rotation, { x: 0, y: 1, z: 8 })
        }
        return Coordinates.Offset(center, rotation, BaseInfo[name].goal)
    }
}