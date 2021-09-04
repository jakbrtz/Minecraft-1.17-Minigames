this.Scoreboard = {

    NumberToColour: function (n) {
        switch (n) {
            case 0: return '\u00a7f'
            case 1: return '\u00a76'
            case 2: return '\u00a75'
            case 3: return '\u00a79'
            case 4: return '\u00a7e'
            case 5: return '\u00a7a'
            case 6: return '\u00a7d'
            case 7: return '\u00a78'
            case 8: return '\u00a77'
            case 9: return '\u00a73'
            case 10: return '\u00a75'
            case 11: return '\u00a71'
            case 12: return '\u00a74'
            case 13: return '\u00a72'
            case 14: return '\u00a7c'
            case 15: return '\u00a70'
        }
    },

    TicksToDuration: function (n) {
        const totalSeconds = Math.ceil(n / 20)
        const seconds = totalSeconds % 60
        const minutes = (totalSeconds - seconds) / 60
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },

    Create: function (title, lines, ascending) {
        this.Destroy()
        SlashCommand(`/scoreboard objectives add showtouser dummy "${title}"`)
        SlashCommand(`/scoreboard objectives setdisplay sidebar showtouser ${ascending ? "ascending" : "descending"}`)
        for (var i = 0; i < 16 && i < lines.length; i++) {
            let line = lines[i]
            let colourCharacter = (i < 10) ? i : String.fromCharCode(97 + i - 10)
            SlashCommand(`/scoreboard players set "\u00a7${colourCharacter}\u00a7r ${line.text || line}  " showtouser ${line.value || 0}`)
        }
    },

    Destroy: function () {
        SlashCommand(`/scoreboard objectives remove showtouser`)
    }

}