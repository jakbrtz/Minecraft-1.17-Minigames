BaseGame = class {

    constructor() {

        this.gameHasStarted = false
        this.elapsedGameTime = 0

        this.DeathCoolDown = 0

    }

    Setup() {
        this.DestroyScoreboard()
        this.elapsedGameTime = 0
        this.gameHasStarted = false
        GameController.Players.forEach(player => {
            player.deathTimer = -1
            player.needsReviving= false
            player.needsDialogue = undefined
            // todo: a bunch of other generic variables
        })
        this.SetupOverride()
    }

    SetupOverride() {
        this.StartGame()
    }

    StartGame() {
        this.elapsedGameTime = 0
        this.gameHasStarted = true
        this.StartGameOverride()
    }

    StartGameOverride() {

    }

    ReceivedTag(entity, tag) {
        if (!GameController.Players.has(entity.id)) return
        let player = GameController.Players.get(entity.id)

        if (tag == "recentlyOpenedDialogue") {
            player.needsDialogue = undefined
        } else if (tag == "recentlyRevived") {
            player.needsReviving = false
        } else {
            this.ReceivedTagOverride(player, tag)
        }
    }

    ReceivedTagOverride(player, tag) {

    }

    Respawn(entity) {

        let player = GameController.Players.get(entity.id)
        SlashCommand(`/clear ${player.name}`)
        SlashCommand(`/effect ${player.name} clear`)
        SlashCommand(`/effect ${player.name} instant_health 1 15 true`)
        SlashCommand(`/effect ${player.name} fire_resistance 1 15 true`)
        player.deathTimer = -1
        this.RespawnOverride(player)
    }

    RespawnOverride(player) {

    }

    Update() {

        if (this.gameHasStarted) {
            this.UpdateGame()
        } else {
            this.UpdateSetup()
        }

        if (this.elapsedGameTime % 5 == 0) {
            GameController.Players.forEach(player => {
                if (player.needsDialogue) {
                    SlashCommand(`/dialogue open @e[type=npc,c=1] ${player.name} ${player.needsDialogue}`)
                }
            })
        }

        this.elapsedGameTime++
    }

    UpdateSetup() {
        this.UpdateSetupOverride()
    }

    UpdateSetupOverride() {

    }

    UpdateGame() {

        GameController.Players.forEach(player => {
            if (player.needsReviving) {
                this.AttemptRevivePlayer(player)
            }
            if (player.deathTimer >= this.DeathCoolDown) {
                this.Respawn(player.entity)
            } 
            if (player.deathTimer >= 0) {
                player.deathTimer++
            }
        })

        this.UpdateGameOverride()

    }

    UpdateGameOverride() {

    }

    PlayerDied(entity, killer) {
        if (!GameController.Players.has(entity.id)) return
        let player = GameController.Players.get(entity.id)
        player.deathTimer = 0
        player.needsReviving = true

        if (killer == undefined) return
        if (!GameController.Players.has(killer.id)) return
        this.PlayerKilled(player, GameController.Players.get(killer.id))
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
            this.Respawn(player.entity)
        }
    }

    PlayerPlacedBlock(entity, position) {
        if (!GameController.Players.has(entity.id)) return
        let player = GameController.Players.get(entity.id)
        this.PlayerPlacedBlockOverride(player, position)
    }

    PlayerPlacedBlockOverride(player, position) {

    }

    IsGameInProgress() {
        return !this.gameHasStarted || this.IsGameInProgressOverride()
    }

    IsGameInProgressOverride() {
        return true
    }

    EndGame() {
        this.EndGameOverride()
    }

    EndGameOverride() {
        Chat("Game Completed")
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
        SlashCommand(`/kill @e[type=!player,type=!npc]`)
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

    AnyPlayerIs(condition) {
        let result = false
        GameController.Players.forEach(player => {
            if (condition(player)) {
                result = true
            }
        })
        return result
    }

    AllPlayersAre(condition) {
        let result = true
        GameController.Players.forEach(player => {
            if (!condition(player)) {
                result = false
            }
        })
        return result
    }

    OpenDialogue(player, dialogue) {
        player.needsDialogue = dialogue
    }

}