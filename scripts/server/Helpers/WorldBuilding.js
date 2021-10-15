this.WorldBuilding = {

    Clear: function () {
        Command.Fill(-128, 3, -128,  -1, 3, 127, "grass");
        Command.Fill(   0, 3, -128, 127, 3, 127, "grass");
        for (let layer = 4; layer < 128; layer++) {
            Command.Fill(-128, layer, -128,  -1, layer, 127, "air");
            Command.Fill(   0, layer, -128, 127, layer, 127, "air");
        }
        SlashCommand(`/kill @e[type=!player]`)
    },

    Sphere: function (center, radius, block) {
        for (let x = 0; x <= radius; x++) {
            for (let y = 0; y <= radius; y++) {
                const z = Math.floor(Math.sqrt(radius ** 2 - x ** 2 - y ** 2))
                if (((x + 1) ** 2 + y ** 2 + z ** 2 <= radius ** 2) ||
                    (x ** 2 + (y + 1) ** 2 + z ** 2 <= radius ** 2)) {
                    continue;
                }
                Command.Fill(center.x - x, center.y - y, center.z - z, center.x + x, center.y + y, center.z + z, block || "stone");
            }
        }
    },

    Circle: function (center, radius, block) {
        for (let x = 0; x < radius; x++) {
            const z = Math.floor(Math.sqrt(radius ** 2 - x ** 2))
            if (((x + 1) ** 2 + z ** 2 <= radius ** 2)) {
                continue
            }
            Command.Fill(center.x - x, center.y, center.z - z, center.x + x, center.y, center.z + z, block || "stone");
        }
    },

    BottomSphere: function (center, radius, block) {
        for (let x = 0; x <= radius; x++) {
            for (let y = 0; y <= radius; y++) {
                const z = Math.floor(Math.sqrt(radius ** 2 - x ** 2 - y ** 2))
                if (((x + 1) ** 2 + y ** 2 + z ** 2 <= radius ** 2) ||
                    (x ** 2 + (y + 1) ** 2 + z ** 2 <= radius ** 2)) {
                    continue;
                }
                Command.Fill(center.x - x, center.y - y, center.z - z, center.x + x, center.y, center.z + z, block || "stone");
            }
        }
    }

}