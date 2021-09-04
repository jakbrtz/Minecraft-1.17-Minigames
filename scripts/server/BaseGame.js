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
        this.SetupExtension()
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

    SetupExtension() {

    }

    UpdateSetup() {
        if (this.elapsedGameTime % 20 === 0 && this.ShowPreGameTimer) {
            SlashCommand(`/title @a title ${-this.elapsedGameTime / 20}...`);
        }
        this.players.forEach(player => {
            if (this.PlayerIsOutOfBounds(player) || this.PlayerHasLeftStartArea(player)) {
                this.Respawn(player)
            }
        })
        this.UpdateSetupExtension()
    }

    UpdateSetupExtension() {

    }

    StartGame() {
        if (this.ShowPreGameTimer) {
            SlashCommand(`/title @a clear`);
        }
        this.StartGameExtension()
    }

    StartGameExtension() {

    }

    Update() {

        if (this.elapsedGameTime < 0) {
            this.UpdateSetup()
        } else if (this.elapsedGameTime === 0) {
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
                this.PlayerDied(player)
            }
        })
        this.UpdateGameExtension()
        if (!this.IsGameInProgress()) {
            this.EndGame()
        }
    }

    UpdateGameExtension() {

    }

    ReceivedTag(player, tag) {
        if (tag === "recentlyRevived") {
            player.needsReviving = false
        } else {
            this.ReceivedTagExtension(player, tag)
        }
    }

    ReceivedTagExtension(player, tag) {

    }

    Respawn(player) {
        SlashCommand(`/clear ${player.name}`)
        SlashCommand(`/effect ${player.name} clear`)
        SlashCommand(`/effect ${player.name} instant_health 1 15 true`)
        SlashCommand(`/effect ${player.name} saturation 1 15 true`)
        if (this.GameIsComplete) {
            SlashCommand(`/give ${player.name} potion`)
        }
        player.deathTimer = -1
        this.RespawnExtension(player)
    }

    RespawnExtension(player) {

    }

    PlayerDied(player, killer) {
        player.deathTimer = 0
        player.needsReviving = true
        this.PlayerDiedExtension(player, killer)
    }

    PlayerDiedExtension(player, killer) {

    }

    AttemptRevivePlayer(player) {
        SlashCommand(`/tag ${player.name} add JakesGames-recentlyRevived`)
        player.AppearDead(this.DeathCoolDown / 20 + 10)
        this.AttemptRevivePlayerExtension(player)
    }

    AttemptRevivePlayerExtension(player) {
        // todo: rewrite this nicer so it can handle edge cases like DeathCoolDown===1
        if (this.DeathCoolDown === 0) {
            this.Respawn(player)
        }
    }

    UseItem(player, item) {
        if (this.GameIsComplete && item === "minecraft:potion") {
            GameController.ChangeGame(this.NextGame())
        } else {
            this.UseItemExtension(player, item)
        }
    }

    UseItemExtension(player, item) {
    }

    PlayerPlacedBlock(player, position) {
    }

    PlayerTriedToDestroyBlock(player, position) {
    }

    EntityAttack(attacker, target) {
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
        SlashCommand(`/give @a potion`)
        this.EndGameExtension()
    }

    EndGameExtension() {
        Chat("Game Completed")
    }

    NextGame() {
        return null
    }

    UpdateScore() {
        Scoreboard.Destroy()
    }

}