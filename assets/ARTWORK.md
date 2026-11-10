# Character sprites and original scenery

## Free character art

Mika and Eli use **32-pixel Human Sprites** by **cyanowl** (2014), published on OpenGameArt under **CC0 1.0 Universal**.

- Source and author’s license declaration: https://opengameart.org/content/32-pixel-human-sprites
- Author: https://opengameart.org/users/cyanowl
- License: https://creativecommons.org/publicdomain/zero/1.0/

Downloaded on November 8, 2026. CC0 permits copying, modification, and redistribution, including the GitHub source package. Attribution is included here and in the site footer as a courtesy.

The included source files are unmodified downloads:

- `sprites/source/human_sprites.png`: https://opengameart.org/sites/default/files/human_sprites_0.png
- `sprites/source/human_sprites_hair.png`: https://opengameart.org/sites/default/files/human_sprites_hair.png
- `sprites/source/human_sprites_0_HOODIE.gif`: https://opengameart.org/sites/default/files/human_sprites_0_HOODIE.gif
- `sprites/source/human_sprites_0_JEANS.gif`: https://opengameart.org/sites/default/files/human_sprites_0_JEANS.gif
- `sprites/source/human_sprites_0_SHOES.gif`: https://opengameart.org/sites/default/files/human_sprites_0_SHOES.gif

`sprites/mika.png` and `sprites/eli.png` combine the author’s compatible body, hair, hoodie, jeans, and shoe layers into complete figures. Clothing palettes are tinted lavender and mint, frames are centered on a shared 32 × 40 pixel grid, and left-facing walking frames are mirrored. `sprites/build-sprites.py` reproduces these atlases with Pillow; it is optional and is not run by the website. No body parts are stretched or rotated during animation. Each scene uses a complete source pose; portraits crop the same figure and render it in monochrome.

Atlas layout: 8 columns × 3 rows. Row 0 contains front walking frames. Row 1 contains four right-facing walking frames followed by their left-facing mirrors. Row 2 contains the phone-compatible extended-arm pose, a conversational pose, and three held-object poses. Remaining cells are transparent. Props remain separate scenery.

Heads are centered using only their top 12 source rows, excluding the raised hand in the phone pose. Right-facing held-object poses use the matching profile hair. Phones are drawn behind the fingers, so the head, hair, and hand stay aligned in both facing directions.

## Original scenery and story

Mika and Eli’s names, fictional story, room layouts, transport, and props are created for Sa Iisang Bubong. Pastel lavender, mint, and pink scenery uses checkerboard floors, stepped silhouettes, and small pixel stars in `story-world.js`. Every room, commute, and separate-home background is rendered on a 120 × 75 pixel canvas, matching the eight-world-unit pixels of the character sprites. A fixed pastel palette removes antialias colors before nearest-neighbor scaling. Characters are composited from their intact source frames on the same grid; scenery contains no written labels; narrative captions and dialogue stay outside the artwork. The page texture is a repeating pixel pattern rather than paper grain. No OMORI characters, sprites, backgrounds, screenshots, or audio are used as website assets.

The canvas scenes retain pause, replay, visibility handling, and reduced-motion behavior. Image loads request a fresh frame even while motion is paused. All sprite assets are local, with relative paths suitable for GitHub Pages. The exact, labeled household-count diagram remains an SVG in `app.js`. The scenery’s notes use simple pixel rules and checkboxes, without tiny printed words.
