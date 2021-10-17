this.Coordinates = {

    Offset: function (point, rotation, offset) {
        switch (rotation) {
            case 0:
                return {
                    x: point.x + offset.x,
                    y: point.y + (offset.y || 0),
                    z: point.z + offset.z,
                };
            case 90:
                return {
                    x: point.x - offset.z,
                    y: point.y + (offset.y || 0),
                    z: point.z + offset.x,
                };
            case 180:
                return {
                    x: point.x - offset.x,
                    y: point.y + (offset.y || 0),
                    z: point.z - offset.z,
                };
            case 270:
                return {
                    x: point.x + offset.z,
                    y: point.y + (offset.y || 0),
                    z: point.z - offset.x,
                };
        }
    },

    SuggestRotation: function (point) {
        if (Math.abs(point.x) < point.z || (point.x === -point.z && point.x < 0)) {
            return 0;
        }
        if (Math.abs(point.x) < -point.z || (point.x === -point.z && point.x > 0)) {
            return 180;
        }
        if (Math.abs(point.z) < point.x || (point.x === point.z && point.x > 0)) {
            return 270;
        }
        return 90;
    },

    PositionsAreClose: function (position1, position2, distance, ignoreY) {
        return (
            position1.x >= position2.x - distance &&
            position1.x <= position2.x + distance &&
            (ignoreY || (position1.y >= position2.y - distance &&
            position1.y <= position2.y + distance)) &&
            position1.z >= position2.z - distance &&
            position1.z <= position2.z + distance);
    }

}