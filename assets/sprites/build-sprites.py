"""Prepare local sprite atlases from cyanowl's CC0 32-pixel Human Sprites.

Optional asset-maintenance script: requires Pillow. The website needs no Python.
Source URLs and license are documented in ../ARTWORK.md.
"""
from pathlib import Path
from math import floor
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'source'
CELL = (32, 40)

def load(name):
    return Image.open(SOURCE / name).convert('RGBA')

def tint(image, low, high):
    # Recolor only the author's clothing layer; preserve its alpha and geometry.
    gray = ImageOps.grayscale(image)
    colored = ImageOps.colorize(gray, low, high).convert('RGBA')
    colored.putalpha(image.getchannel('A'))
    return colored

HAIR = load('human_sprites_hair.png')
HAIRCUTS = {
    'mika': {'front': (191, 37, 210, 58), 'side': (194, 73, 208, 94)},
    'eli': {'front': (112, 171, 126, 182), 'side': (114, 190, 126, 201)},
}

def character(name, colors):
    body = load('human_sprites.png')
    for filename in ['human_sprites_0_JEANS.gif', 'human_sprites_0_SHOES.gif', 'human_sprites_0_HOODIE.gif']:
        layer = load(filename)
        if 'HOODIE' in filename:
            layer = tint(layer, *colors)
        aligned = Image.new('RGBA', body.size)
        aligned.paste(layer, (-7, -7))
        body = Image.alpha_composite(body, aligned)

    def frame(rect, hair='front', top=0):
        piece = body.crop(rect)
        # Only the top 12 rows belong to the head. Row 13 of the phone pose
        # also contains the raised hand: including it shifts the body sideways
        # underneath its hair. Keep the intact body anchored to its head alone.
        head_box = piece.crop((0, 0, piece.width, min(12, piece.height))).getbbox()
        center = (head_box[0] + head_box[2]) / 2
        x = floor(16 - center + .5)
        canvas = Image.new('RGBA', CELL)
        canvas.alpha_composite(piece, (x, top))
        cut = HAIR.crop(HAIRCUTS[name][hair])
        canvas.alpha_composite(cut, (floor(16 - cut.width / 2 + .5), 2))
        return canvas

    sheet = Image.new('RGBA', (CELL[0] * 8, CELL[1] * 3))
    for i in range(8):
        f = frame((12 + i * 16, 8, 28 + i * 16, 45))
        sheet.alpha_composite(f, (i * 32, 0))
    for i in range(4):
        f = frame((13 + i * 14, 44, 28 + i * 14, 78), 'side', 2)
        sheet.alpha_composite(f, (i * 32, 40))
        sheet.alpha_composite(ImageOps.mirror(f), ((i + 4) * 32, 40))
    poses = [
        ((207, 44, 229, 78), 'side', 2),  # extended arm for phone
        ((230, 44, 254, 78), 'front', 2), # conversational gesture
        # These source heads face right, so use the matching profile haircut.
        ((272, 44, 287, 78), 'side', 2), # held object / three walking frames
        ((287, 44, 303, 78), 'side', 2),
        ((302, 44, 319, 78), 'side', 2),
    ]
    for i, (rect, hair, top) in enumerate(poses):
        sheet.alpha_composite(frame(rect, hair, top), (i * 32, 80))
    sheet.save(ROOT / f'{name}.png', optimize=True)

character('mika', ('#65476e', '#efcde7'))
character('eli', ('#3e6c68', '#d2e8d9'))
