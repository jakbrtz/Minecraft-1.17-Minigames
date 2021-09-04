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
    }

}