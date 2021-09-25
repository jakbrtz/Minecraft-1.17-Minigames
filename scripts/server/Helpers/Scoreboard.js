this.Scoreboard = {

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
            const line = lines[i]
            const colourCharacter = (i < 10) ? i : String.fromCharCode(97 + i - 10)
            SlashCommand(`/scoreboard players set "\u00a7${colourCharacter}\u00a7r ${line.text || line}  " showtouser ${line.value || 0}`)
        }
    },

    Destroy: function () {
        SlashCommand(`/scoreboard objectives remove showtouser`)
    }

}