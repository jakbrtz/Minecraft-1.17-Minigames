const TeamInfo = {
    "red": {
        name: "Red",
        colour: 14,
        score: 0
    },
    "orange": {
        name: "Orange",
        colour: 1,
        score: 0
    },
    "yellow": {
        name: "Yellow",
        colour: 4,
        score: 0
    },
    "green": {
        name: "Green",
        colour: 13,
        score: 0
    },
    "blue": {
        name: "Blue",
        colour: 11,
        score: 0
    },
    "purple": {
        name: "Purple",
        colour: 10,
        score: 0
    },
    "brown": {
        name: "Brown",
        colour: 12,
        score: 0
    },
    "black": {
        name: "Black",
        colour: 7,
        score: 0
    }
}

const TeamNames = ["red", "orange", "yellow", "green", "blue", "purple", "brown", "black"]

GetTeam = function(name) {
    return TeamInfo[name]
}

RandomTeam = function () {
    return GetRandomItem(AllTeams())
}

AllTeams = function () {
    return TeamNames.map(name=>GetTeam(name))
}

ResetAllTeamScores = function () {
    AllTeams().forEach(team => team.score = 0)
}