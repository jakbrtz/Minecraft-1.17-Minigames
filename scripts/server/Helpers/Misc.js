GetRandomItem = function (arr) {
    return arr[RandomInt(arr.length)]
}

RandomInt = function (max) {
    return Math.floor(Math.random() * max)
}

RandomFloat = function(min, max) {
    return Math.random() * (max-min) + min
}

NumberToColour = function(n) {
    switch (n) {
        case 0: return '\u00a7f'
        case 1: return '\u00a76'
        case 2: return '\u00a75'
        case 3: return '\u00a79'
        case 4: return '\u00a7e'
        case 5: return '\u00a7a'
        case 6: return '\u00a7d'
        case 7: return '\u00a78'
        case 8: return '\u00a77'
        case 9: return '\u00a73'
        case 10: return '\u00a75'
        case 11: return '\u00a71'
        case 12: return '\u00a74'
        case 13: return '\u00a72'
        case 14: return '\u00a7c'
        case 15: return '\u00a70'
    }
}

TicksToDuration = function(n) {
    let totalSeconds = Math.ceil(n / 20)
    let seconds = totalSeconds % 60
    let minutes = (totalSeconds - seconds) / 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

PositionsAreClose = function(position1, position2, distance) {
    return (
        position1.x >= position2.x - distance &&
        position1.x <= position2.x + distance &&
        position1.y >= position2.y - distance &&
        position1.y <= position2.y + distance &&
        position1.z >= position2.z - distance &&
        position1.z <= position2.z + distance)
}