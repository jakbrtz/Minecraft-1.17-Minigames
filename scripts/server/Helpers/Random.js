this.Random = {

    Arr: function (arr) {
        return arr[this.Int(arr.length)];
    },

    Int: function (a, b) {
        return Math.floor(this.Float(a, b));
    },

    Float: function (a, b) {
        const min = Math.min(a || 0, b || 0);
        const max = Math.max(a || 0, b || 0);
        return Math.random() * (max - min) + min;
    },

    Bool: function () {
        return Math.random() < 0.5;
    },

    Shuffle: function (arr) {
        for (let i = 1; i < arr.length; i++) {
            const j = Random.Int(i);
            const tmp = arr[j];
            arr[j] = arr[i];
            arr[i] = tmp;
        }
    }

}