# Games

There are 4 types of games

* Scored - get more points than anyone else
* Race - get to the end faster than anyone else
* Survival - survive longer than anyone else
* Selection - not really a game, it's more like a lobby

Each game must fall into one of those categories.

## Examples

The easiest examples to follow are

* BombsAway.js
* Hurdles.js
* Parkour.js
* QuickRespawnArena.js
* Spleef.js

## Parameters

These parameters are set in the constructor. They are all optional. 

### DeathCoolDown

When a player dies, how many ticks should pass before they respawn? 

There are 20 ticks in a second.

If left out, players will respawn immediately.

### GameMode

Should players of this game be in `adventure`, `survival`, or `creative`?

If left out then players will be put in `adventure`.

### minimumNumberOfTeams

What is the minimum number of teams that this game can handle? 

If the game starts and the minimum isn't met then a new team will be added with 0 players.

If left out then there is no minimum.

### maximumNumberOfTeams

What is the maximum number of teams that this game can handle?

If the maximum has been reached and a player tries to enter a new team, the player will be moved to an existing team.

If left out then the maximum is 8.

### PvPgroupedByTeams

Should players in the same team be stopped from hurting each other?

If left out, the answer is no (`false`).

### ShowPreGameTimer

Should players see a countdown before the game starts?

If left out then the answer is yes (true).

### TeamsCanBeAddedAfterStart

Should it be possible for new teams to be added once the game has already started? 

If left out then the answer is yes (true)

### EndWhenOneRemains

*Only applies to race and survival games*

Should the game finish when only one player is left?

If left out, the answer is no (false).

### DefaultGameDuration

*Only applies to scored games*

What is the duration of the game in ticks? This value can be overridden 

If left out, the answer is 1200 ticks (1 minute)

### GroupScoreByTeam

*Only applies to scored games*

FALSE = each player is scored individually

TRUE = each player's score is counted towards the team score

The default is TRUE

## Inherited Functions that you can Override

These are all the functions that you have access to when creating a new game. 
They are all optional, but some are very important and have been marked with a ⚠ emoji.
 
You can find an example of how they're used by looking through the other files in this folder.

### AddPlayerExtension(player)

Modifies data when a player joins the game. For example in parkour:
```javascript
	AddPlayerExtension(player) {
		player.checkPoint = 0
	}
```
Note that things like `player.score = 0` is done in the base class, so you don't need to do that manually. 

Do not teleport the player to the spawn point in this function. That is handled in a `Respawn(player)`. 

### AddTeamExtension(team)
Modifies data when a new team is added to the game.
For example in `Bridges` and `Thieves` a new base is constructed for each team when the team is created.

### BuildWorld() ⚠

Place blocks to build the game. For example in Spleef:
```javascript
	BuildWorld() {
		WorldBuilding.Clear()
		SlashCommand(`/fill -15 64 -15 15 64 15 snow`)
	}
```
This function runs before teams and players are added to the game, so only build the parts of the world that are definitely in the game.

In `Bridges` and `Thieves` the layout depends on the teams, so the world is partially built in the `AddTeamExtension(team)` method. 

In Selection games the world is partially build in the `GetChoices()` method.

### EndGameExtension()

Performs actions when the game has ended.

If this is not overriden on a scored game then a message will appear displaying the winner. 

### PlayerAttack(attacker, target)

Performs actions when a player attacks another player.

For example in InverseTag we need to detect when a player tags another player:

```javascript
	PlayerAttack(attacker, target) {
		if (target === this.HighlightedPlayer) {
			this.SetHighlightedPlayer(attacker)
        }
	}
```

### PlayerDestroyedBlock(player, position)

Performs actions after a player has destroyed a block.

This is used in Bridges to give the player the block they just destroyed:

```javascript
	PlayerDestroyedBlock(player, position) {
		// This was set up in PlayerTriedToDestroyBlock
		SlashCommand(`/give ${player.name} concrete 1 ${player.concreteColourBeingDestroyed} ${AdventureTags.CanPlaceOn()}`)
		SlashCommand(`/kill @e[type=item,x=${position.x},y=${position.y},z=${position.z},rm=0,r=15]`)
	}
```

### PlayerDiedExtension(player, killer)

*Applies to all games, but you shouldn't override this in survival games*

Performs actions when a player dies. For example in QuickRespawnArena:

```javascript
	PlayerDiedExtension(player, killer) {
		if (!this.GameIsComplete && killer !== undefined) {
			killer.score++
			this.UpdateScore()
		}
	}
```

### PlayerHasLeftStartArea(player)

*Applies to all games* ⚠ *Important in race games*

Check if the player has moved too far from their spawn point. When this returns true before the game has started then player will respawn.

### PlayerIsOutOfBounds(player)

Check if the player should be considered 'dead'. In most games we check if the player has fallen like this:

```javascript
	PlayerIsOutOfBounds(player) {
		return player.position.y < 40
	}
```

### PlayerPlacedBlock(player, position)

Performs actions when a player places a block.

This can be used to prevent a player from placing blocks, for example in Bridges:
```javascript
	PlayerPlacedBlock(player, position) {
		this.teams.forEach(team => {
			if (Coordinates.PositionsAreClose(position, team.goal, 1, false)) {
				SlashCommand(`/msg ${player.name} You cannot build here`)
				SlashCommand(`/setblock ${position.x} ${position.y} ${position.z} air`)
            }
		})
	}
```

### PlayerTriedToDestroyBlock(player, position)

Performs actions when a player starts destroying a block.

This is used in Bridges to get information about the block the player is destroying:

```javascript
	PlayerTriedToDestroyBlock(player, position) {
		const block = GetBlockData(player.entity, position)
		player.concreteColourBeingDestroyed = Colours.NameToNumber(block.color)
		// This is used in PlayerDestroyedBlock
	}
```

### ReceivedTagExtension(player, tag)

Honestly I can't be bothered to write an explanation for this because I haven't found this useful at all. 
This was supposed to be a way for command blocks and NPCs to send information to the game. 

### RespawnExtension(player) ⚠

What happens when the player respawns. For example in Spleef:

```javascript
	RespawnExtension(player) {
		SlashCommand(`/tp ${player.name} ${Random.Float(-13, 13)} 66 ${Random.Float(-13, 13)}`)
		SlashCommand(`/give ${player.name} diamond_shovel`)
		SlashCommand(`/give ${player.name} snowball 8`)
	}
```

In almost every situation this function should teleport the player to the start.

### UpdateGameExtension()

Performs actions once per tick. 

For example in Bridges, we need to constantly check if a player is in an opponents base. If they are then they must earn a point and respawn.

```javascript
	UpdateGameExtension() {

		this.teams.forEach(team => {
			this.players.forEach(player => {
				if (player.team !== team && Coordinates.PositionsAreClose(player.position, team.goal, 2, false)) {
					if (!this.GameIsComplete) {
						player.score++
						this.UpdateScore()
						SlashCommand("/title " + player.name + " title You earned a point");
                    }
					this.Respawn(player)
                }
            })
		})

	}
```

Another shorter example is BombsAway, where we summon a TNT randomly every 10 ticks:

```javascript
	UpdateGameExtension() {
		if (this.elapsedGameTime % 10 === 0) {
			SlashCommand(`/summon tnt ${Random.Float(-15, 15)} 70 ${Random.Float(-15, 15)}`)
        }
	}
```

### UpdateScore()

*Applies to all games, but only useful in Selection games*

Create a custom scoreboard.

### UseItemExtension(player, item)

Performs actions when a player uses an item.

### PlayerIsFinished(player) ⚠

*Only applies to race games*

Has a player reached the end of the race?

```javascript
	PlayerIsFinished(player) {
		return player.checkPoint >= 4
	}
```

### GetChoices() ⚠

*Only applies to Selection games*

I don't want to write out all the documentation for this. 
It's not like anyone's ever going to read it, and even if you are, you're probably not going to make a Selection game. 
At least I'm willing to admit that there isn't any documentation and I'm not pretending that it's hidden in some other file.

## Read-Only variables and functions

These variables and function in the base game might come in handy.

### elapsedGameTime

How many ticks have passed since the game has started?

This can be negative if the game hasn't started yet.

There are 20 ticks in a second.

### GameIsComplete

Has the game finished yet?

### players

A list of players that are playing this game. 

The player object is defined in `Helpers/player.js` 

In scored games, an extra `score` field is added for the player.

### Respawn(player)

Sends a player back to the start of the game

### teams

A list of teams that are playing this game. 

It is possible for a team to not have any players.

The team object is defined in `Helpers/team.js`

### UpdateScore()

Refresh the Scoreboard.