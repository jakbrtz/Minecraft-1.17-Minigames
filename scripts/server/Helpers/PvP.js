this.PvP = {

    Set: function (mode, player) {
        System.ClearNullifiedDamage(player.entity);
        if (mode === 'teams') {
            System.NullifyDamageFromTag(player.entity, `team-${player.team.name}`);
        } else if (mode === 'off') {
            System.NullifyDamageFromOtherPlayers(player.entity);
        }
    }

}