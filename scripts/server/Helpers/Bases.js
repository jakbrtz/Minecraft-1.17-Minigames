const BaseInfo = {
    "bases:Temple": {
        spawn: { x: 0, y: 0, z: -9 }
    },
    "bases:EndIslands": {
        spawn: { x: -1, y: -12, z: -12 },
        goal: { x: -4, y: 12, z: -8 },
    },
    "bases:Amethyst": {
        spawn: { x: 0, y: 0, z: -11 }
    },
    "bases:Mud": {
        spawn: { x: 0, y: 0, z: 0 }
    },
    "bases:GoldBlocks": {
        spawn: { x: 0, y: 0, z: 0 }
    }
}

StructureSpawn = function (name, center, rotation) {
    if (BaseInfo[name] == undefined || BaseInfo[name].spawn == undefined) {
        return AddWithRotation(center, rotation, { x: 0, y: 1, z: -8 })
    }
    return AddWithRotation(center, rotation, BaseInfo[name].spawn)
}

StructureGoal = function (name, center, rotation) {
    if (BaseInfo[name] == undefined || BaseInfo[name].goal == undefined) {
        return center
    }
    return AddWithRotation(center, rotation, BaseInfo[name].goal)
}

SetStructureSpawn = function (name, position) {
    if (name in BaseInfo) {
        BaseInfo[name].spawn = position
    } else {
        BaseInfo[name] = { spawn: position }
    }
}

SetStructureGoal = function (name, position) {
    if (name in BaseInfo) {
        BaseInfo[name].goal = position
    } else {
        BaseInfo[name] = { goal: position }
    }
}