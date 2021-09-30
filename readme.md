# # Not Quite Server Games

This is a Behaviour Pack for Minecraft Bedrock edition that runs mini-games in a multiplayer world.

My goal is to make it easy to create new games in javascript without needing to understand Minecraft's scripting language. Unfortunately that back-fired and now you need to understand my scripting language, which is arguably easier but more limiting.

## Installation

Download this project and copy it into

```
%localappdata%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs
```

That is the location described in the ['Getting started' documentation for add-ons](https://docs.microsoft.com/en-us/minecraft/creator/documents/gettingstarted).

Next, create a new world in Minecraft with these settings:

* Add this behaviour pack
* World type: Flat
* Additional Modding Capabilities
* Activate Cheats

## Project Structure

### functions

Contains simple actions that can be run as commands.

### scripts

This folder contains all the code that runs the games.

### structures

This folder contains pre-built structures that can loaded into games.

## Games that come in this Pack:

### Skirmishes
Grab as many points as you can in:
* Arena - kill everyone else
* Rule the Hill - just like 'King of the Hill' but gender-neutral
* Paint - Not Quite an .io game
* Inverse Tag - Not Quite 'tail tag' from Fall Guys
* Bridges - The classic server game, but with your own custom bases
* Spleef - The classic server game where... hey why have I never seen this on a server?
* Thieves - Not Quite the classic server game 'capture the flag'

### Last one standing
Survive the longest in:
* Archery - except you're the target
* Bombs Away - Dodge the falling TNT
* Droppers - Not Quite 'Hex-a-gone' from Fall Guys
* Match - Not Quite 'Mushroom Mixup' from Mario party

### Race
Get to the end as fast as you can in:
* Stepping stones - Not Quite 'Tip-Toe' from Fall Guys
* Door dash - Not Quite 'Door Dash' from Fall Guys
* Parkour - but it sucks
* Glass Maze - literally the only original idea I had


## Creating new Games

Look in the scripts folder to find out more.