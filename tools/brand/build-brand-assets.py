# tools/brand/build-brand-assets.py
# Generate VUB brand assets from the official seal (Python 3 + Pillow + numpy).
import base64, io, os
from PIL import Image, ImageDraw
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC  = os.path.join(ROOT, "VUB Logo.png")
OUT  = os.path.join(ROOT, "assets")
os.makedirs(OUT, exist_ok=True)

src = Image.open(SRC).convert("RGBA")
n = min(src.size); src = src.crop((0, 0, n, n)).resize((1200, 1200), Image.LANCZOS)
W = 1200

def circular_alpha(size):
    s = size * 4
    m = Image.new("L", (s, s), 0)
    ImageDraw.Draw(m).ellipse((0, 0, s - 1, s - 1), fill=255)
    return m.resize((size, size), Image.LANCZOS)

def quantize_rgba(img, colors=256):
    a = img.split()[3]
    q = img.convert("RGB").quantize(colors=colors, method=Image.FASTOCTREE).convert("RGBA")
    q.putalpha(a)
    return q

# 1) Circular badge (quantized master -> much smaller, visually identical)
badge = src.copy(); badge.putalpha(circular_alpha(W))
badge = quantize_rgba(badge, 256)
badge.save(os.path.join(OUT, "vub-seal-badge.png"), optimize=True)

# 2) White-knockout
rgb = np.asarray(src.convert("RGB")).astype(np.float32)
lum = 0.299*rgb[...,0] + 0.587*rgb[...,1] + 0.114*rgb[...,2]
ink = lum < 140
wi = np.zeros((W, W, 4), np.uint8); wi[...,0:3] = 255
wi[...,3] = np.where(ink, 255, 0).astype(np.uint8)
white = Image.fromarray(wi, "RGBA")
ca = np.asarray(circular_alpha(W)); wa = np.asarray(white.split()[3])
white.putalpha(Image.fromarray(np.minimum(wa, ca)))
white.save(os.path.join(OUT, "vub-seal-white.png"), optimize=True)

# 3) Favicons / app icons from the badge
for px in (512, 192, 180, 48, 32, 16):
    name = {512:"icon-512.png",192:"icon-192.png",180:"apple-touch-icon-180.png",
            48:"favicon-48.png",32:"favicon-32.png",16:"favicon-16.png"}[px]
    badge.resize((px, px), Image.LANCZOS).save(os.path.join(OUT, name), optimize=True)
badge.save(os.path.join(OUT, "favicon.ico"), sizes=[(16,16),(32,32),(48,48)])

# 4) SVG wrapper embedding a WEB-OPTIMIZED 320px badge (keeps the SVG light for per-page nav)
web = quantize_rgba(badge.resize((320,320), Image.LANCZOS), 128)
buf = io.BytesIO(); web.save(buf, format="PNG", optimize=True)
b64 = base64.b64encode(buf.getvalue()).decode()
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" '
       f'role="img" aria-label="Veterans Upward Bound seal">'
       f'<image width="320" height="320" href="data:image/png;base64,{b64}"/></svg>')
open(os.path.join(OUT, "vub-seal.svg"), "w", encoding="utf-8").write(svg)
print("OK badge:", os.path.getsize(os.path.join(OUT,"vub-seal-badge.png")),
      "svg:", os.path.getsize(os.path.join(OUT,"vub-seal.svg")))
