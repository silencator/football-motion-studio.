"""Owner-edited photos on a white background → transparent PNG for the paper canvas.
The light background region (low saturation, connected to the image border) becomes black with
alpha = darkness, so baked-in grey shadows stay as real soft shadows; the subject stays opaque.
Usage: python scripts/whitebg-to-alpha.py in.jpg out.png"""
import sys, numpy as np
from PIL import Image
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
rgb = np.asarray(Image.open(src).convert('RGB')).astype(np.float32) / 255
L = rgb.mean(-1); sat = rgb.max(-1) - rgb.min(-1)
light = (L > 0.78) & (sat < 0.10)
lab, _ = ndimage.label(light)
edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
bg = np.isin(lab, edge[edge > 0])
bg = ndimage.binary_opening(bg, iterations=1)
soft = ndimage.gaussian_filter(bg.astype(np.float32), 1.0)          # feathered edge
a_bg = np.clip(1 - L, 0, 1)                                         # multiply-equivalent shadow alpha
alpha = soft * a_bg + (1 - soft) * 1.0
col = rgb * (1 - soft[..., None])                                   # background pixels → black
col = np.where(alpha[..., None] > 1e-3, col / np.maximum(alpha[..., None], 1e-3), 0)
img = np.concatenate([np.clip(col, 0, 1), alpha[..., None]], -1)
Image.fromarray((img * 255).round().astype(np.uint8), 'RGBA').save(out, optimize=True)
print('✔', out, img.shape[1], 'x', img.shape[0])
