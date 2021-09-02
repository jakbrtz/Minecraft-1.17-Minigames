BaseGame = class {

    constructor() {

        this.teams = []
        this.players = []
        this.GameIsComplete = false

        this.elapsedGameTime = -60
        this.DeathCoolDown = 0
        this.PvPgroupedByTeams = false
        this.GameMode = 'adventure'
        this.ShowPreGameTimer = true
    }

    Setup() {
        GameController.Players.forEach(player => {
            this.players.push(player)
            if (!this.teams.includes(player.team)) {
                this.teams.push(player.team)
            }
        })
        // todo: randomize order of this.teams
        this.EnableTeamsPvP(this.PvPgroupedByTeams)
        this.BuildWorld()
        SlashCommand(`/gamemode ${this.GameMode} @a`)
        this.players.forEach(player => {
            this.Respawn(player)
        })
        if (this.ShowPreGameTimer && Math.random() < 0.05) {
            SlashCommand(`/title @a actionbar ⚠ cross-teaming is bannable or whatever`)
        }
        this.SetupOverride()
        this.UpdateScore()
    }

    EnableTeamsPvP(enabled) {
        this.players.forEach(player => {
            SlashCommand(`/tag @a remove team-${player.team.name}`)
        })
        this.players.forEach(player => ClearNullifiedDamage(player.entity))
        if (enabled) {
            this.players.forEach(player => {
                SlashCommand(`/tag ${player.name} add team-${player.team.name}`)
                NullifyDamageFromTag(player.entity, `team-${player.team.name}`)
            })
        }
    }

    BuildWorld() {

    }

    SetupOverride() {

    }

    UpdateSetup() {
        if (this.elapsedGameTime % 20 == 0 && this.ShowPreGameTimer) {
            SlashCommand(`/title @a title ${-this.elapsedGameTime / 20}...`);
        }
        this.players.forEach(player => {
            if (this.PlayerIsOutOfBounds(player) || this.PlayerHasLeftStartArea(player)) {
                this.Respawn(player)
            }
        })
        this.UpdateSetupOverride()
    }

    UpdateSetupOverride() {

    }

    StartGame() {
        if (this.ShowPreGameTimer) {
            SlashCommand(`/title @a clear`);
        }
        this.StartGameOverride()
    }

    StartGameOverride() {

    }

    Update() {

        if (this.elapsedGameTime < 0) {
            this.UpdateSetup()
        } else if (this.elapsedGameTime == 0) {
            this.StartGame()
        } else {
            this.UpdateGame()
        }

        this.players.forEach(player => {
            if (player.needsReviving) {
                this.AttemptRevivePlayer(player) // todo: could this go in GameController?
            }
            if (player.deathTimer >= this.DeathCoolDown) {
                this.Respawn(player)
            }
            if (player.deathTimer >= 0) {
                player.deathTimer++
            }
        })

        this.elapsedGameTime++
    }

    UpdateGame() {
        this.players.forEach(player => {
            if (this.PlayerIsOutOfBounds(player)) {
                this.PlayerDied(player.entity)
            }
        })
        this.UpdateGameOverride()
        if (!this.IsGameInProgress()) {
            this.EndGame()
        }
    }

    UpdateGameOverride() {

    }

    ReceivedTag(player, tag) {
        if (tag == "recentlyRevived") {
            player.needsReviving = false
        } else {
            this.ReceivedTagOverride(player, tag)
        }
    }

    ReceivedTagOverride(player, tag) {

    }

    Respawn(player) {

        SlashCommand(`/clear ${player.name}`)
        SlashCommand(`/effect ${player.name} clear`)
        SlashCommand(`/effect ${player.name} instant_health 1 15 true`)
        SlashCommand(`/effect ${player.name} fire_resistance 1 15 true`)
        SlashCommand(`/effect ${player.name} saturation 1 15 true`)
        player.deathTimer = -1
        this.RespawnOverride(player)
    }

    RespawnOverride(player) {

    }

    PlayerDied(player, killer) {
        player.deathTimer = 0
        player.needsReviving = true
        if (killer == undefined) return
        this.PlayerKilled(player, killer)
    }

    PlayerKilled(player, killer) {

    }

    AttemptRevivePlayer(player) {
        SlashCommand(`/tag ${player.name} add JakesGames-recentlyRevived`)
        this.AppearDead(player)
        this.AttemptRevivePlayerOverride(player)
    }

    AttemptRevivePlayerOverride(player) {
        // todo: rewrite this nicer so it can handle edge cases like DeathCoolDown==1
        if (this.DeathCoolDown == 0) {
            this.Respawn(player)
        }
    }

    PlayerPlacedBlock(player, position) {
        this.PlayerPlacedBlockOverride(player, position)
    }

    PlayerPlacedBlockOverride(player, position) {

    }

    PlayerTriedToDestroyBlock(player, position) {
        this.PlayerTriedToDestroyBlockOverride(player, position)
    }

    PlayerTriedToDestroyBlockOverride(player, position) {

    }

    EntityAttack(attacker, target) {
        this.EntityAttackOverride(attacker, target)
    }

    EntityAttackOverride(attacker, target) {

    }

    IsGameInProgress() {
        return true
    }

    PlayerIsOutOfBounds(player) {
        return false
    }

    PlayerHasLeftStartArea(player) {
        return false    
    }

    EndGame() {
        if (this.GameIsComplete) return
        this.GameIsComplete = true
        this.EndGameOverride()
    }

    EndGameOverride() {
        Chat("Game Completed")
    }

    NextGame() {
        return null
    }

    AppearDead(player) {
        let time = this.DeathCoolDown / 20 + 10
        SlashCommand(`/clear ${player.name}`)
        SlashCommand(`/effect ${player.name} slow_falling ${time} 15 true`)
        SlashCommand(`/effect ${player.name} night_vision ${time} 1 true`)
        SlashCommand(`/effect ${player.name} speed ${time} 1 true`)
        SlashCommand(`/effect ${player.name} fire_resistance ${time} 100 true`)
        SlashCommand(`/effect ${player.name} conduit_power ${time} 1 true`)
        SlashCommand(`/effect ${player.name} invisibility ${time} 1 true`)
        SlashCommand(`/effect ${player.name} resistance ${time} 100 true`)
        SlashCommand(`/effect ${player.name} weakness ${time} 100 true`)
        SlashCommand(`/effect ${player.name} saturation ${time} 100 true`)
    }

    ClearWorld() {
        SlashCommand(`/fill -128 3 -128  -1 3 127 grass`)
        SlashCommand(`/fill    0 3 -128 127 3 127 grass`)
        for (var layer = 4; layer < 128; layer++) {
            SlashCommand(`/fill -128 ${layer} -128  -1 ${layer} 127 air`)
            SlashCommand(`/fill    0 ${layer} -128 127 ${layer} 127 air`)
        }
        SlashCommand(`/kill @e[type=!player]`)
    }

    UpdateScore() {
        this.DestroyScoreboard()
    }

    CreateScoreboard(title, lines, ascending) {
        this.DestroyScoreboard()
        SlashCommand(`/scoreboard objectives add showtouser dummy "${title}"`)
        SlashCommand(`/scoreboard objectives setdisplay sidebar showtouser ${ascending ? "ascending" : "descending"}`)
        for (var i = 0; i < 16 && i < lines.length; i++) {
            let line = lines[i]
            let colourCharacter = (i < 10) ? i : String.fromCharCode(97 + i - 10)
            SlashCommand(`/scoreboard players set "\u00a7${colourCharacter}\u00a7r ${line.text || line}  " showtouser ${line.value || 0}`)
        }
    }

    DestroyScoreboard() {
        SlashCommand(`/scoreboard objectives remove showtouser`)
    }

}