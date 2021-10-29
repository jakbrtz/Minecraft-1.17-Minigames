this.Command = {

    Teleport: function (player, x, y, z, facingX, facingY, facingZ) {
        [x, y, z] = Command.FixCoordinates(x, y, z);
        let commandline = `/tp ${player.name} ${x} ${y} ${z}`;
        if (facingX !== undefined && facingY !== undefined && facingZ !== undefined) {
            [facingX, facingY, facingZ] = Command.FixCoordinates(facingX, facingY, facingZ);
            commandline += ` facing ${facingX} ${facingY} ${facingZ}`;
        }
        System.SlashCommand(commandline);
    },

    SetBlock: function (x, y, z, block) {
        [x, y, z] = Command.FixCoordinates(x, y, z);
        System.SlashCommand(`/setblock ${x} ${y} ${z} ${block}`);
    },

    Fill: function (xStart, yStart, zStart, xEnd, yEnd, zEnd, block) {
        [xStart, yStart, zStart] = Command.FixCoordinates(xStart, yStart, zStart);
        [xEnd, yEnd, zEnd] = Command.FixCoordinates(xEnd, yEnd, zEnd);
        System.SlashCommand(`/fill ${xStart} ${yStart} ${zStart} ${xEnd} ${yEnd} ${zEnd} ${block}`);
    },

    Structure: function (name, x, y, z, angle) {
        [x, y, z] = Command.FixCoordinates(x, y, z);
        System.SlashCommand(`/structure load ${name} ${x} ${y} ${z} ${angle || 0}_degrees`);
    },

    Effect: function (player, effectName, duration, intensity, hideParticles) {
        if (hideParticles === undefined) {
            hideParticles = true;
        }
        if (duration === undefined || duration < 0 || duration > 1000000) {
            duration = 1000000;
        }
        System.SlashCommand(`/effect ${player.name} ${effectName} ${duration} ${intensity || 1} ${hideParticles}`);
    },

    EffectClear: function (player) {
        System.SlashCommand(`/effect ${player.name} clear`);
    },

    Give: function (player, item, count, itemData) {
        System.SlashCommand(`/give ${player.name} ${item} ${count || 1} ${itemData || 0}`);
    },

    Clear: function (player, itemToClear) {
        System.SlashCommand(`/clear ${player.name} ${itemToClear || ""}`);
    },

    ReplaceItem: function (player, slot, slotIndex, item, quantity, itemData) {
        System.SlashCommand(`/replaceItem entity, ${player.name} ${slot} ${slotIndex}, ${item} ${quantity || 1} ${itemData || 0}`);
    },

    Say: function (message) {
        System.SlashCommand(`/say ${message}`);
    },

    Tell: function (player, message) {
        // todo: how to I add comments that appear in autocomplete? I want to tell the programmer to use Title instead
        System.SlashCommand(`/msg ${player.name} ${message}`);
    },

    Title: function (player, location, message) {
        System.SlashCommand(`/title ${player.name} ${location || "title"} ${message || ""}`);
    },

    SpreadPlayers: function (x, z, distanceBetweenPlayers, radius, players) {
        [x, y, z] = Command.FixCoordinates(x, null, z);
        System.SlashCommand(`/spreadplayers ${x} ${z} ${distanceBetweenPlayers} ${radius} ${players.map(player => player.name).join(',')}`);
    },

    Summon: function (entityName, x, y, z) {
        [x, y, z] = Command.FixCoordinates(x, y, z);
        System.SlashCommand(`/summon ${entityName} ${x} ${y} ${z}`);
    },

    Tag: function (player, adding, tagName) {
        System.SlashCommand(`/tag ${player.name} ${adding ? "add" : "remove"} ${tagName}`);
    },

    XP: function (levels, player) {
        System.SlashCommand(`/xp ${levels}L ${player.name}`);
    },

    GameMode: function (mode, player) {
        System.SlashCommand(`/gamemode ${mode} ${player.name}`);
    },

    SummonRide: function (player, entityName) {
        System.SlashCommand(`/ride ${player.name} summon_ride ${entityName}`);
    },

    RemoveItemEntities: function (x, y, z, radius) {
        [x, y, z] = Command.FixCoordinates(x, y, z);
        System.SlashCommand(`/kill @e[type=item,x=${x},y=${y},z=${z},rm=0,r=${radius || 1}]`);
    },

    RemoveNonPlayerEntities: function (x, y, z, dx, dy, dz) {
        [x, y, z] = Command.FixCoordinates(x, y, z);
        System.SlashCommand(`/kill @e[type=!player,x=${x},dx=${dx},y=${y},dy=${dy},z=${z},dz=${dz}]`);
    },

    StructureSave: function (name, xStart, yStart, zStart, xEnd, yEnd, zEnd, mode) {
        [xStart, yStart, zStart] = Command.FixCoordinates(xStart, yStart, zStart);
        [xEnd, yEnd, zEnd] = Command.FixCoordinates(xEnd, yEnd, zEnd);
        System.SlashCommand(`/structure save ${name} ${xStart} ${yStart} ${zStart} ${xEnd} ${yEnd} ${zEnd} ${mode || ""}`);
    },

    FixCoordinates: function (x, y, z) {
        const Round5dp = num => Math.round(num * 100000) / 100000;
        return [
            Round5dp(x || 0),
            Round5dp(y || 0),
            Round5dp(z || 0)
        ];
    }
    
}