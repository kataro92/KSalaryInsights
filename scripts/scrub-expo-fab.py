#!/usr/bin/env python3
"""Remove Expo Go floating action button (blue gear) from simulator screenshots."""
from __future__ import annotations

import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


def _is_fab_blue(r: int, g: int, b: int) -> bool:
    return b >= 150 and r <= 140 and g <= 185 and (b - r) >= 35


def _median_color(samples: list[tuple[int, int, int]]) -> tuple[int, int, int]:
    if not samples:
        return (245, 248, 252)
    rs = sorted(s[0] for s in samples)
    gs = sorted(s[1] for s in samples)
    bs = sorted(s[2] for s in samples)
    mid = len(samples) // 2
    return (rs[mid], gs[mid], bs[mid])


def _cover_disc(rgb: Image.Image, cx: int, cy: int, radius: int) -> Image.Image:
    """Fill FAB disc with median background sampled just left of the disc."""
    w, h = rgb.size
    samples: list[tuple[int, int, int]] = []
    for ang in range(0, 360, 8):
        rad = math.radians(ang)
        # Prefer left hemisphere samples outside the FAB
        for dist in (radius + 10, radius + 22, radius + 36):
            x = int(cx + math.cos(rad) * dist)
            y = int(cy + math.sin(rad) * dist)
            if x < 0 or y < 0 or x >= w or y >= h:
                continue
            # Bias: only take samples clearly left of center
            if x > cx - 8:
                continue
            pix = rgb.getpixel((x, y))
            if not _is_fab_blue(*pix):
                samples.append(pix)

    # Fallback horizontal samples
    if len(samples) < 12:
        for dy in range(-radius, radius + 1, 3):
            yy = min(h - 1, max(0, cy + dy))
            for dx in (radius + 16, radius + 32, radius + 48):
                xx = max(0, cx - dx)
                pix = rgb.getpixel((xx, yy))
                if not _is_fab_blue(*pix):
                    samples.append(pix)

    fill = _median_color(samples)
    out = rgb.copy()
    draw = ImageDraw.Draw(out)
    # Soft edge: draw slightly larger then blur paste
    bbox = [cx - radius - 2, cy - radius - 2, cx + radius + 2, cy + radius + 2]
    draw.ellipse(bbox, fill=fill)

    box = (
        max(0, cx - radius - 8),
        max(0, cy - radius - 8),
        min(w, cx + radius + 8),
        min(h, cy + radius + 8),
    )
    region = out.crop(box).filter(ImageFilter.GaussianBlur(radius=1.6))
    out.paste(region, box)
    return out


def cover_expo_fab(im: Image.Image) -> Image.Image:
    rgb = im.convert("RGB")
    w, h = rgb.size

    x0, x1 = int(w * 0.90), w - 1
    y0, y1 = int(h * 0.10), int(h * 0.45)
    blues: list[tuple[int, int]] = []
    for y in range(y0, y1):
        for x in range(x0, x1):
            if _is_fab_blue(*rgb.getpixel((x, y))):
                blues.append((x, y))

    if len(blues) >= 25:
        xs = [p[0] for p in blues]
        ys = [p[1] for p in blues]
        cx = sum(xs) // len(blues)
        cy = sum(ys) // len(blues)
        cx = max(cx, int(w * 0.90))
        extent = max(max(xs) - min(xs), max(ys) - min(ys))
        radius = max(48, min(extent // 2 + 22, 88))
        return _cover_disc(rgb, cx, cy, radius)

    # Fallback anchor
    return _cover_disc(rgb, int(w * 0.925), int(h * 0.268), 56)


def main() -> None:
    if len(sys.argv) < 3:
        print("usage: scrub-expo-fab.py <in.png> <out.png>", file=sys.stderr)
        sys.exit(2)
    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    im = Image.open(src)
    cleaned = cover_expo_fab(im)
    dst.parent.mkdir(parents=True, exist_ok=True)
    cleaned.save(dst, optimize=True)
    print(f"wrote {dst} ({cleaned.size[0]}x{cleaned.size[1]})")


if __name__ == "__main__":
    main()
