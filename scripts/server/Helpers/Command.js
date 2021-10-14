this.Command = {

    Teleport: function (player, x, y, z, facingX, facingY, facingZ) {
        if (facingX === undefined || facingY === undefined || facingZ === undefined) {
            SlashCommand(`/tp ${player.name} ${x} ${y} ${z}`);
        } else {
            SlashCommand(`/tp ${player.name} ${x} ${y} ${z} facing ${facingX} ${facingY} ${facingZ}`);
        }
    },

    SetBlock: function (x, y, z, block) {
        SlashCommand(`/setblock ${x} ${y} ${z} ${block}`);
    },

    Fill: function (xStart, yStart, zStart, xEnd, yEnd, zEnd, block) {
        SlashCommand(`/fill ${xStart} ${yStart} ${zStart} ${xEnd} ${yEnd} ${zEnd} ${block}`);
    },

    Structure: function (name, x, y, z, angle) {
        SlashCommand(`/structure load ${name} ${x} ${y} ${z} ${angle || 0}_degrees`);
    },

    Effect: function (player, effectName, duration, intensity, hideParticles) {
        if (hideParticles === undefined) {
            hideParticles = true;
        }
        if (duration === undefined || duration < 0 || duration > 1000000) {
            duration = 1000000;
        }
        SlashCommand(`/effect ${player.name} ${effectName} ${duration} ${intensity || 1} ${hideParticles}`);
    },

    EffectClear: function (player) {
        SlashCommand(`/effect ${player.name} clear`);
    },

    Give: function (player, item, count, itemData) {
        SlashCommand(`/give ${player.name} ${item} ${count || 1} ${itemData || 0}`);
    },

    Clear: function (player, itemToClear) {
        SlashCommand(`/clear ${player.name} ${itemToClear || ""}`);
    },

    ReplaceItem: function (player, slot, slotIndex, item, quantity, itemData) {
        SlashCommand(`/replaceItem entity, ${player.name} ${slot} ${slotIndex}, ${item} ${quantity || 1} ${itemData || 0}`);
    },

    Say: function (message) {
        SlashCommand(`/say ${message}`);
    },

    Tell: function (player, message) {
        // todo: how to I add comments that appear in autocomplete? I want to tell the programmer to use Title instead
        SlashCommand(`/msg ${player.name} ${message}`);
    },

    Title: function (player, location, message) {
        SlashCommand(`/title ${player.name} ${location || "title"} ${message || ""}`);
    },

    SpreadPlayers: function (x, z, distanceBetweenPlayers, radius, players) {
        SlashCommand(`/spreadplayers ${x} ${z} ${distanceBetweenPlayers} ${radius} ${players.map(player => player.name).join(',')}`);
    },

    Summon: function (entityName, x, y, z) {
        SlashCommand(`/summon ${entityName} ${x} ${y} ${z}`);
    },

    Tag: function (player, adding, tagName) {
        SlashCommand(`/tag ${player.name} ${adding ? "add" : "remove"} ${tagName}`);
    },

    XP: function (levels, player) {
        SlashCommand(`/xp ${levels}L ${player.name}`);
    },

    GameMode: function (mode, player) {
        SlashCommand(`/gamemode ${mode} ${player.name}`);
    },

    SummonRide: function (player, entityName) {
        SlashCommand(`/ride ${player.name} summon_ride ${entityName}`);
    },

    RemoveItemEntity: function (x, y, z, radius) {
        SlashCommand(`/kill @e[type=item,x=${x},y=${y},z=${z},rm=0,r=${radius || 1}]`);
    },

    StructureSave: function (name, xStart, yStart, zStart, xEnd, yEnd, zEnd, mode) {
        SlashCommand(`/structure save ${name} ${xStart} ${yStart} ${zStart} ${xEnd} ${yEnd} ${zEnd} ${mode || ""}`);
    }
    
}