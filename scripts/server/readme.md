# Scripts

### System.js

This is the only file that uses Minecraft's API. It contains functions that is accessed by the GameController and helper functions (eg `SlashCommand`) but it should never directly communicate with games. 

### GameController.js

This file keeps track of which games are in progress, and which players are in the world. 

### Helpers

A folder containing various functions that are helpful to multiple games, such as controlling the scoreboard.

### BaseClasses

Contains all the code that is common between games. By editing these files you are editing multiple games at once.

### Games

Contains each game in the behaviour pack. You can add games to this folder, instructions inside.

## Additional Notes

The lobby is a type of game, and is found in the `Games` folder.

Files are run in alphabetical order. They have been intentionally named so that `BaseClasses` comes first and `System.js` comes last. 
If you want to create a new non-game file then it probably belongs in `Helpers`. 
If you want to create a new type of Base Class then make sure it's name comes alphabetically after `Game`, or you could restructure the `BaseClasses` folder.