Game = class {

    constructor() {
        this.DeathCoolDown = 0
        this.PvPgroupedByTeams = false
        this.GameMode = 'adventure'
        this.ShowPreGameTimer = true
        this.TeamsCanBeAddedAfterStart = true
    }

    Setup() {
        this.teams = []
        this.players = []
        this.elapsedGameTime = -60
        this.GameIsComplete = false
        this.BuildWorld()
    }

    AddPlayer(player) {
        this.players.push(player)

        if (this.teams.some(team => team.name === player.team.name)) {
            player.team = this.teams.find(team => team.name === player.team.name)
        } else if (this.elapsedGameTime > 0 && !this.TeamsCanBeAddedAfterStart) {
            player.team = Random.Arr(this.teams) // todo: pick team with least number of players
        } else {
            player.team = Teams.Get(player.team.name)
        }
        this.AddTeam(player.team)

        this.AddPlayerGeneral(player)
        this.AddPlayerExtension(player)
        this.Respawn(player)
        if (this.ShowPreGameTimer && Math.random() < 0.05) {
            SlashCommand(`/title ${player.name} actionbar ⚠ cross-teaming is bannable or whatever`)
        }
        this.UpdateScore()
        this.EnableTeamsPvP(this.PvPgroupedByTeams) // todo: this needs to take the game as a parameter too
    }

    AddPlayerGeneral(player) {

    }

    AddPlayerExtension(player) {

    }

    AddTeam(team) {
        if (this.teams.includes(team)) return
        this.teams.push(team)
        this.AddTeamExtension(team)
    }

    AddTeamExtension(team) {

    }

    RemovePlayer(player) {
        this.players = this.players.filter(p => p !== player)
    }

    EnableTeamsPvP(enabled) {
        this.players.forEach(player => {
            SlashCommand(`/tag ${player.name} remove team-${player.team.name}`)
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

    Update() {

        if (this.elapsedGameTime < 0) {
            this.UpdateSetup()
        } else if (this.elapsedGameTime === 0) {
            this.StartGameBase()
        } else {
            this.UpdateGameBase()
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

    UpdateSetup() {
        this.players.forEach(player => {
            if (this.elapsedGameTime % 20 === 0 && this.ShowPreGameTimer) {
                SlashCommand(`/title ${player.name} title ${-this.elapsedGameTime / 20}...`);
            }
            if (this.PlayerIsOutOfBounds(player) || this.PlayerHasLeftStartArea(player)) {
                this.Respawn(player)
            }
        })
    }

    StartGameBase() {
        if (this.ShowPreGameTimer) {
            this.players.forEach(player => SlashCommand(`/title ${player.name} clear`))
        }
        this.StartGameExtension()
    }

    StartGameExtension() {

    }

    UpdateGameBase() {
        this.players.forEach(player => {
            if (this.PlayerIsOutOfBounds(player)) {
                this.PlayerDied(player)
            }
        })
        this.UpdateGameExtension()
        this.UpdateGameGeneral()
        if (!this.IsGameInProgress()) {
            this.EndGame()
        }
    }

    UpdateGameExtension() {

    }

    UpdateGameGeneral() {

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
        SlashCommand(`/xp -2147483648L ${player.name}`)
        SlashCommand(`/gamemode ${this.GameMode} ${player.name}`)
        player.deathTimer = -1
        this.RespawnExtension(player)
        if (this.GameIsComplete) {
            SlashCommand(`/give ${player.name} potion`)
        }
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
        if (this.GameIsComplete) {
            SlashCommand(`/give ${player.name} potion`)
        }
        this.AttemptRevivePlayerExtension(player)
    }

    AttemptRevivePlayerExtension(player) {
        // todo: rewrite this nicer so it can handle edge cases like DeathCoolDown===1
        if (this.DeathCoolDown === 0) {
            this.Respawn(player)
        } else {
            SlashCommand(`/tp ${player.name} 0 80 0`)
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
        this.players.forEach(player => SlashCommand(`/give ${player.name} potion`))
        this.EndGameExtension()
    }

    EndGameExtension() {
    }

    NextGame() {
        return null
    }

    UpdateScore() {
        Scoreboard.Destroy()
    }

}