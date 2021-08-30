const TeamInfo = {
    "red": {
        name: "Red",
        colour: 14
    },
    "orange": {
        name: "Orange",
        colour: 1
    },
    "yellow": {
        name: "Yellow",
        colour: 4
    },
    "green": {
        name: "Green",
        colour: 13
    },
    "blue": {
        name: "Blue",
        colour: 11
    },
    "purple": {
        name: "Purple",
        colour: 10
    },
    "pink": {
        name: "Pink",
        colour: 6
    },
    "black": {
        name: "Black",
        colour: 7
    }
}

const TeamNames = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "black"]

GetTeam = function(name) {
    return TeamInfo[name]
}

RandomTeam = function () {
    return GetRandomItem(TeamNames.map(name => GetTeam(name)))
}