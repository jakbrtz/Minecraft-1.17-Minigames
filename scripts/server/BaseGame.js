BaseGame = class {

    constructor() {

        this.gameHasStarted = false
        this.elapsedGameTime = 0
        this.players = new Map()

        this.DeathCoolDown = 0

    }

    Setup() {
        this.DestroyScoreboard()
        this.elapsedGameTime = 0
        this.gameHasStarted = false
        allEntities.forEach(entity => {
            this.players.set(entity.id, {
                entity: entity,
                name: GetName(entity),
                deathTimer: -1,
                position: { x: 0, y: 0, z: 0 },
                needsReviving: false
                // todo: a bunch of other generic variables
            })
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
        let player = this.players.get(entity.id)
        this.ReceivedTagOverride(player, tag)
    }

    ReceivedTagOverride(player, tag) {

    }

    Respawn(entity) {

        let player = this.players.get(entity.id)
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

        allEntities.filter((entity) => this.players.has(entity.id)).forEach(entity => {
            let player = this.players.get(entity.id)
            player.entity = entity
            player.position = Find(entity)
        })

        if (this.gameHasStarted) {
            this.UpdateGame()
        } else {
            this.UpdateSetup()
        }
        this.elapsedGameTime++
    }

    UpdateSetup() {
        this.UpdateSetupOverride()
    }

    UpdateSetupOverride() {

    }

    UpdateGame() {

        this.players.forEach(player => {
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
        if (!this.players.has(entity.id)) return
        let player = this.players.get(entity.id)
        player.deathTimer = 0
        player.needsReviving = true
        this.PlayerDiedOverride(player, killer)
    }

    PlayerDiedOverride(player, killer) {

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

    ReviveWasSuccessful(entity) {
        if (!this.players.has(entity.id)) return
        let player = this.players.get(entity.id)
        SlashCommand(`/tag ${player.name} remove JakesGames-recentlyRevived`)
        player.needsReviving = false
    }

    PlayerPlacedBlock(entity, position) {
        if (!this.players.has(entity.id)) return
        let player = this.players.get(entity.id)
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
        SlashCommand(`/scoreboard objectives setdisplay sidebar showtouser ${(ascending || false) ? "ascending" : "descending"}`)
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
        this.players.forEach(player => {
            if (condition(player)) {
                result = true
            }
        })
        return result
    }

    AllPlayersAre(condition) {
        let result = true
        this.players.forEach(player => {
            if (!condition(player)) {
                result = false
            }
        })
        return result
    }

}