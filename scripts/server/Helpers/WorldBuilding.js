ClearWorld = function() {
    SlashCommand(`/fill -128 3 -128  -1 3 127 grass`)
    SlashCommand(`/fill    0 3 -128 127 3 127 grass`)
    for (var layer = 4; layer < 128; layer++) {
        SlashCommand(`/fill -128 ${layer} -128  -1 ${layer} 127 air`)
        SlashCommand(`/fill    0 ${layer} -128 127 ${layer} 127 air`)
    }
    SlashCommand(`/kill @e[type=!player]`)
}