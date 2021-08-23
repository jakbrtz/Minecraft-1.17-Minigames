const BaseInfo = {
    "bases:Temple": {
        spawn: { x: 0, y: 0, z: -9 },
        goal: { x: 0, y: 0, z: 0 }
    },
    "slot1": {
        spawn: { x: -1, y: -12, z: -12 },
        goal: { x: -4, y: 12, z: -8 },
    },
}

const AddWithRotation = function (point, rotation, offset) {
    switch (rotation) {
        case 0:
            return {
                x: point.x + offset.x,
                y: point.y + offset.y,
                z: point.z + offset.z,
            }
        case 90:
            return {
                x: point.x - offset.z,
                y: point.y + offset.y,
                z: point.z + offset.x,
            }
        case 180:
            return {
                x: point.x - offset.x,
                y: point.y + offset.y,
                z: point.z - offset.z,
            }
        case 270:
            return {
                x: point.x + offset.z,
                y: point.y + offset.y,
                z: point.z - offset.x,
            }
    }
}

StructureSpawn = function (name, center, rotation) {
    if (BaseInfo[name] == undefined || BaseInfo[name].spawn == undefined) {
        return center
    }
    return AddWithRotation(center, rotation, BaseInfo[name].spawn)
}

StructureGoal = function (name, center, rotation) {
    if (BaseInfo[name] == undefined || BaseInfo[name].goal == undefined) {
        return center
    }
    return AddWithRotation(center, rotation, BaseInfo[name].goal)
}