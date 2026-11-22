"""Photo-reference grade for cut-outs (owner's Messi reference):
skin & hair → monochrome, kit colours kept (saturation-gated), gentle contrast, fine grain,
soft offset drop shadow baked in. Usage: python scripts/grade-photos.py in1.png [in2.png ...] --out public/images/messi [--choke 0.003]
Needs: numpy, pillow, scipy."""
import sys, os, numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

args = sys.argv[1:]; out = 'public/images'
if '--out' in args: i = args.index('--out'); out = args[i + 1]; del args[i:i + 2]
choke = 0.0  # --choke F: shrink the matte by F × image height (removes coloured halos from app cut-outs)
skin_sat = 0.64  # --skin-sat S: raise (≈0.8) for warm, saturated photos whose skin stays coloured
if '--skin-sat' in args: i = args.index('--skin-sat'); skin_sat = float(args[i + 1]); del args[i:i + 2]
if '--choke' in args: i = args.index('--choke'); choke = float(args[i + 1]); del args[i:i + 2]
os.makedirs(out, exist_ok=True)

def rgb_to_hsv(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx = rgb.max(-1); mn = rgb.min(-1); d = mx - mn + 1e-6
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) / 6
    s = np.where(mx > 0, (mx - mn) / (mx + 1e-6), 0)
    return h, s, mx

def smooth(x, a, b):  # smoothstep a→b
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

for f in args:
    im = Image.open(f).convert('RGBA')
    if choke > 0:
        from scipy.ndimage import grey_erosion
        a = np.array(im); r = max(1, round(choke * im.height))
        al = grey_erosion(a[..., 3], size=(2 * r + 1, 2 * r + 1))
        a[..., 3] = (gaussian_filter(al.astype(np.float32), r * 0.5)).clip(0, 255).astype(np.uint8)
        im = Image.fromarray(a, 'RGBA')
    # trim to subject + margin, cap height
    a0 = np.array(im)[..., 3]; ys, xs = np.where(a0 > 8)
    pad = int(0.06 * (ys.max() - ys.min()))
    im = im.crop((max(0, xs.min() - pad), max(0, ys.min() - pad), min(im.width, xs.max() + pad), ys.max() + 1))
    if im.height > 2200: im = im.resize((round(im.width * 2200 / im.height), 2200), Image.LANCZOS)
    arr = np.asarray(im).astype(np.float32) / 255; rgb = arr[..., :3]; alpha = arr[..., 3]
    h, s, v = rgb_to_hsv(rgb)
    hue_skin = np.maximum(1 - smooth(h, 0.11, 0.15), smooth(h, 0.94, 0.97))      # reds→oranges (0–45°, 340°+)
    sat_skin = 1 - smooth(s, skin_sat, skin_sat + 0.16)                                          # kits are far more saturated
    skin = hue_skin * sat_skin * smooth(v, 0.12, 0.25)
    dark = (1 - smooth(v, 0.22, 0.38)) * (1 - smooth(s, 0.45, 0.7))               # hair / shadows
    m = gaussian_filter(np.clip(np.maximum(skin, dark), 0, 1), 1.2)
    lum = (rgb @ np.array([0.299, 0.587, 0.114], np.float32))[..., None]
    mono = np.clip((lum - 0.5) * 1.18 + 0.52, 0, 1)                                # punchy B&W
    col = np.clip(lum + (rgb - lum) * 1.12, 0, 1)                                  # kit +12% saturation
    col = np.clip((col - 0.5) * 1.08 + 0.5, 0, 1)
    rgb2 = col * (1 - m[..., None] * 0.92) + mono * (m[..., None] * 0.92)
    rng = np.random.default_rng(11)
    grain = gaussian_filter(rng.standard_normal(alpha.shape).astype(np.float32), 0.55) * 0.045
    rgb2 = np.clip(rgb2 + grain[..., None], 0, 1)
    # unsharp mask for crisp detail
    blur = np.stack([gaussian_filter(rgb2[..., c], 1.4) for c in range(3)], -1)
    rgb2 = np.clip(rgb2 + (rgb2 - blur) * 0.6, 0, 1)
    # offset shadow, baked onto an expanded canvas
    H, W = alpha.shape; ox, oy = int(-0.022 * H), int(0.008 * H); M = int(0.05 * H)
    canvas = np.zeros((H + M, W + 2 * M, 4), np.float32)
    sh = gaussian_filter(np.pad(alpha, ((0, M), (M, M))), 0.006 * H)
    sh = np.roll(np.roll(sh, oy, 0), ox, 1) * 0.30
    canvas[..., 3] = sh  # black shadow
    sub = np.zeros_like(canvas); sub[:H, M:M + W, :3] = rgb2; sub[:H, M:M + W, 3] = alpha
    A = sub[..., 3:4]; outA = A + canvas[..., 3:4] * (1 - A)
    outRGB = (sub[..., :3] * A + canvas[..., :3] * canvas[..., 3:4] * (1 - A)) / np.maximum(outA, 1e-6)
    res = Image.fromarray((np.concatenate([outRGB, outA], -1) * 255).round().astype(np.uint8), 'RGBA')
    name = os.path.basename(f).split('.')[0]
    res.save(f'{out}/{name}.png', optimize=True); print('✔', f'{out}/{name}.png', res.size)
