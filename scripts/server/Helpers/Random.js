GetRandomItem = function (arr) {
    return arr[RandomInt(arr.length)]
}

RandomInt = function (max) {
    return Math.floor(Math.random() * max)
}

RandomFloat = function (min, max) {
    return Math.random() * (max - min) + min
}

RandomBool = function () {
    return Math.random() < 0.5
}