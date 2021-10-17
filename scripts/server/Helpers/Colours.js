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
        return this.NameArray[number];
    },

    NameToNumber: function (name) {
        return this.NameArray.indexOf(name);
    },

    CharacterArray: [
        '\u00a7f',
        '\u00a76',
        '\u00a75',
        '\u00a79',
        '\u00a7e',
        '\u00a7a',
        '\u00a7d',
        '\u00a78',
        '\u00a77',
        '\u00a73',
        '\u00a75',
        '\u00a71',
        '\u00a74',
        '\u00a72',
        '\u00a7c',
        '\u00a70'
    ],

    NumberToCharacter: function (number) {
        return this.CharacterArray[number];
    },

    CharacterToNumber: function (character) {
        return this.CharacterArray.indexOf(character);
    }
}