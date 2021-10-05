# Troubleshooting

When I get stuck on a problem and it takes a long time to fix it I'll put my solution here:

* **fill/setblock/structure isn't loading**
  * Make sure that it is being loaded in a ticking areas. A game's ticking area is a square (160 blocks wide) centered around `game.center`
  * Make sure that the positions are valid numbers. Sometimes when I use `Math.sin` or `Math.cos` I end up with numbers like `-1e-15` which is practically 0 but minecraft can't handle it. Fix it by rounding the number.