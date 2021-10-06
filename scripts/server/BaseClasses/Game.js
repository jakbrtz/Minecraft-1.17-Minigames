Game = class {

    constructor() {
        this.DeathCoolDown = 0
        this.PvPMode = 'on'
        this.GameMode = 'adventure'
        this.ShowPreGameTimer = true
        this.TeamsCanBeAddedAfterStart = true
        this.minimumNumberOfTeams = 0
        this.maximumNumberOfTeams = 8
        this.shouldClearExistingGameBeforeBuilding = true
    }

    Setup() {
        this.teams = []
        this.players = []
        this.elapsedGameTime = -60
        this.GameIsComplete = false
        this.SetupGeneral()
        if (this.shouldClearExistingGameBeforeBuilding) {
            WorldBuilding.Clear()
        }
        this.BuildWorld()
        this.BuildWorldGeneral()
    }

    SetupGeneral() {

    }

    BuildWorld() {

    }

    BuildWorldGeneral() {

    }

    AddPlayer(player) {
        this.players.push(player)

        if (this.teams.some(team => team.name === player.team.name)) {
            player.team = this.teams.find(team => team.name === player.team.name)
        } else if ((this.elapsedGameTime < 0 || this.TeamsCanBeAddedAfterStart) && this.teams.length < this.maximumNumberOfTeams) {
            player.team = Teams.Get(player.team.name)
        } else {
            const sizeOfTeam = team => this.players.filter(player => player.team === team).length
            this.teams.sort((a, b) => sizeOfTeam(a) - sizeOfTeam(b))
            player.team = this.teams[0]
        }
        this.AddTeam(player.team)

        this.AddPlayerGeneral(player)
        this.AddPlayerExtension(player)
        this.Respawn(player)
        if (this.ShowPreGameTimer && Math.random() < 0.01) {
            const name = Random.Arr(["Kobi", "Oscar"])
            SlashCommand(`/title ${player.name} actionbar ⚠ ${name} will be banned for no reason`)
        }
        this.UpdateScore()

        Teams.All.forEach(team => SlashCommand(`/tag ${player.name} remove team-${team.name}`))
        SlashCommand(`/tag ${player.name} add team-${player.team.name}`)
        ClearNullifiedDamage(player.entity)
        if (this.PvPMode === 'teams') {
            NullifyDamageFromTag(player.entity, `team-${player.team.name}`)
        } else if (this.PvPMode === 'off') {
            NullifyDamageFromOtherPlayers(player.entity)
        }
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

    Update() {

        if (this.elapsedGameTime < 0) {
            this.UpdateSetup()
        } else {
            this.UpdateGameBase()
        }

        this.players.forEach(player => {
            if (player.needsReviving) {
                this.AttemptRevivePlayer(player)
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

    StartGame() {
        if (this.ShowPreGameTimer) {
            this.players.forEach(player => SlashCommand(`/title ${player.name} clear`))
        }
        this.players.forEach(player => {
            SlashCommand(`/effect ${player.name} instant_health 1 15 true`)
        })
        while (this.teams.length < this.minimumNumberOfTeams) {
            this.AddTeam(Teams.Random())
        }
    }

    UpdateGameBase() {
        if (this.elapsedGameTime === 0) {
            this.StartGame()
        }
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

    PlayerDestroyedBlock(player, position) {
    }

    PlayerAttack(attacker, target) {
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