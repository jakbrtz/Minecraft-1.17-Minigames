this.Random = {

    Arr: function (arr) {
        return arr[this.Int(arr.length)]
    },

    Int: function (max) {
        return Math.floor(Math.random() * max)
    },

    Float: function (min, max) {
        return Math.random() * (max - min) + min
    },

    Bool: function () {
        return Math.random() < 0.5
    },

    Shuffle: function (arr) {
        for (var i = 1; i < arr.length; i++) {
            const j = Random.Int(i)
            const tmp = arr[j]
            arr[j] = arr[i]
            arr[i] = tmp
        }
    }

}