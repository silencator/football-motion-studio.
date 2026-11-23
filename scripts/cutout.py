"""Background removal for player photos (CPU), one photo per process to stay within memory.
  python scripts/cutout.py photo1.jpg photo2.jpg ...   → photoN.cutout.png (transparent)
Then grade: python scripts/grade-photos.py *.cutout.png --out public/images/<project>
Model: rembg 'birefnet-portrait' (~1 GB, from GitHub releases, cached in ~/.u2net). ~20 s/photo.
Needs: pip install "rembg[cpu]" pillow"""
import sys, subprocess
if len(sys.argv) > 2:  # fan out: one child process per photo (BiRefNet needs ~5 GB RAM)
    for f in sys.argv[1:]:
        subprocess.run([sys.executable, __file__, f], check=True)
    sys.exit()
from rembg import remove, new_session
from PIL import Image
f = sys.argv[1]
out = remove(Image.open(f).convert('RGB'), session=new_session('birefnet-portrait'), post_process_mask=True)
dst = f.rsplit('.', 1)[0] + '.cutout.png'
out.save(dst); print('✔', dst, out.size, flush=True)
