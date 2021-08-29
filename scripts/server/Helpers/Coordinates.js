AddWithRotation = function (point, rotation, offset) {
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

SuggestedRotation = function (point) {
    let x = point.x
    let z = point.z

    if (Math.abs(x) < z || (x == -z && x < 0)) {
        return 0
    }
    if (Math.abs(x) < -z || (x == -z && x > 0)) {
        return 180
    }
    if (Math.abs(z) < x || (x == z && x > 0)) {
        return 270
    }
    return 90
}