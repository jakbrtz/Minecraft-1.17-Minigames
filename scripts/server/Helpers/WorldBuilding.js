this.WorldBuilding = {

    Clear: function () {
        SlashCommand(`/fill -128 3 -128  -1 3 127 grass`)
        SlashCommand(`/fill    0 3 -128 127 3 127 grass`)
        for (var layer = 4; layer < 128; layer++) {
            SlashCommand(`/fill -128 ${layer} -128  -1 ${layer} 127 air`)
            SlashCommand(`/fill    0 ${layer} -128 127 ${layer} 127 air`)
        }
        SlashCommand(`/kill @e[type=!player]`)
    },

    Sphere: function (center, radius, block) {
        for (var x = 0; x <= radius; x++) {
            for (var y = 0; y <= radius; y++) {
                const z = Math.floor(Math.sqrt(radius ** 2 - x ** 2 - y ** 2))
                if (((x + 1) ** 2 + y ** 2 + z ** 2 <= radius ** 2) ||
                    (x ** 2 + (y + 1) ** 2 + z ** 2 <= radius ** 2)) {
                    continue;
                }
                SlashCommand(`/fill ${center.x - x} ${center.y - y} ${center.z - z} ${center.x + x} ${center.y + y} ${center.z + z} ${block || "stone"}`)
            }
        }
    }

}