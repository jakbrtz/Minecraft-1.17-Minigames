this.Teams = {
    All: [
        { name: "Red", colour: 14 },
        { name: "Orange", colour: 1 },
        { name: "Yellow", colour: 4 },
        { name: "Green", colour: 13 },
        { name: "Blue", colour: 11 },
        { name: "Purple", colour: 10 },
        { name: "Pink", colour: 6 },
        { name: "Black", colour: 7 },
    ],
    Get: function (name) {
        return this.All.find(team => team.name === name)
    },
    Random: function () {
        return Random.Arr(this.All)
    }
}