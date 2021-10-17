this.Command = {

    Teleport: function (player, x, y, z, facingX, facingY, facingZ) {
        if (facingX === undefined || facingY === undefined || facingZ === undefined) {
            System.SlashCommand(`/tp ${player.name} ${x} ${y} ${z}`);
        } else {
            System.SlashCommand(`/tp ${player.name} ${x} ${y} ${z} facing ${facingX} ${facingY} ${facingZ}`);
        }
    },

    SetBlock: function (x, y, z, block) {
        System.SlashCommand(`/setblock ${x} ${y} ${z} ${block}`);
    },

    Fill: function (xStart, yStart, zStart, xEnd, yEnd, zEnd, block) {
        System.SlashCommand(`/fill ${xStart} ${yStart} ${zStart} ${xEnd} ${yEnd} ${zEnd} ${block}`);
    },

    Structure: function (name, x, y, z, angle) {
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
        System.SlashCommand(`/spreadplayers ${x} ${z} ${distanceBetweenPlayers} ${radius} ${players.map(player => player.name).join(',')}`);
    },

    Summon: function (entityName, x, y, z) {
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

    RemoveItemEntity: function (x, y, z, radius) {
        System.SlashCommand(`/kill @e[type=item,x=${x},y=${y},z=${z},rm=0,r=${radius || 1}]`);
    },

    StructureSave: function (name, xStart, yStart, zStart, xEnd, yEnd, zEnd, mode) {
        System.SlashCommand(`/structure save ${name} ${xStart} ${yStart} ${zStart} ${xEnd} ${yEnd} ${zEnd} ${mode || ""}`);
    }
    
}