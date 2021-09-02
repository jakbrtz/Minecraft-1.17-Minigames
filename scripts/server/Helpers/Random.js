GetRandomItem = function (arr) {
    return arr[RandomInt(arr.length)]
}

RandomInt = function (max) {
    return Math.floor(Math.random() * max)
}

RandomFloat = function (min, max) {
    return Math.random() * (max - min) + min
}