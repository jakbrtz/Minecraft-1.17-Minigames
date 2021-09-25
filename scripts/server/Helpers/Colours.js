this.Colours = {

    NameArray: [
        'white',
        'orange',
        'magenta',
        'lightblue',
        'yellow',
        'lime',
        'pink',
        'gray',
        'lightgray',
        'cyan',
        'purple',
        'blue',
        'brown',
        'green',
        'red',
        'black'],

    NumberToName: function (number) {
        return this.NameArray[number]
    },

    NameToNumber: function (name) {
        return this.NameArray.indexOf(name)
    }

}