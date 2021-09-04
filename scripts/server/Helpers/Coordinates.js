this.Coordinates = {

    Offset: function (point, rotation, offset) {
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
    },

    SuggestRotation: function (point) {
        let x = point.x
        let z = point.z

        if (Math.abs(x) < z || (x === -z && x < 0)) {
            return 0
        }
        if (Math.abs(x) < -z || (x === -z && x > 0)) {
            return 180
        }
        if (Math.abs(z) < x || (x === z && x > 0)) {
            return 270
        }
        return 90
    },

    PositionsAreClose: function (position1, position2, distance, ignoreY) {
        return (
            position1.x >= position2.x - distance &&
            position1.x <= position2.x + distance &&
            (ignoreY || (position1.y >= position2.y - distance &&
            position1.y <= position2.y + distance)) &&
            position1.z >= position2.z - distance &&
            position1.z <= position2.z + distance)
    }

}