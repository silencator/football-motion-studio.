"""Synthesises the studio's restrained SFX palette (48 kHz, 24-bit WAV) into public/sfx/.
Run: python scripts/make-sfx.py   (needs numpy, scipy, soundfile)"""
import numpy as np, soundfile as sf, os
from scipy.signal import butter, sosfilt
SR = 48000
rng = np.random.default_rng(7)
out = 'public/sfx'; os.makedirs(out, exist_ok=True)
t = lambda d: np.arange(int(d * SR)) / SR

def bp_sweep(noise, f0, f1, q=1.2, steps=48):
    """Band-pass noise with a centre frequency sweeping f0→f1 (overlap-add blocks)."""
    n = len(noise); y = np.zeros(n); blk = n // steps; win = np.hanning(blk * 2)
    for i in range(steps):
        fc = f0 * (f1 / f0) ** (i / (steps - 1)); bw = fc / q
        sos = butter(2, [max(30, fc - bw / 2), min(SR / 2 - 100, fc + bw / 2)], 'band', fs=SR, output='sos')
        a = max(0, i * blk - blk // 2); seg = noise[a:a + blk * 2]
        y[a:a + len(seg)] += sosfilt(sos, seg) * win[:len(seg)]
    return y

def env(n, attack, release_curve=3.0):
    k = int(n * attack); e = np.ones(n)
    e[:k] = np.sin(np.linspace(0, np.pi / 2, k)) ** 2
    e[k:] = (1 - np.linspace(0, 1, n - k)) ** release_curve
    return e

def norm(x, peak_db):
    return x / (np.max(np.abs(x)) + 1e-9) * 10 ** (peak_db / 20)

def fade(x, in_ms=0.3, out_ms=4):
    a = max(2, int(SR * in_ms / 1000)); b = int(SR * out_ms / 1000)
    x[:a] *= np.linspace(0, 1, a); x[-b:] *= np.linspace(1, 0, b); return x

def save(name, x): sf.write(f'{out}/{name}.wav', fade(x.astype(np.float64)), SR, subtype='PCM_24'); print('✔', name, f'{len(x)/SR:.2f}s')

# Whooshes: airy band-passed noise, rising then falling, slight stereo-free so they sit under VO.
for name, d, f0, f1, att, pk in [('whoosh-soft', .55, 350, 2600, .62, -9), ('whoosh-fast', .32, 500, 3800, .55, -9), ('whoosh-low', .7, 180, 900, .6, -8)]:
    n = rng.standard_normal(int(d * SR)); y = bp_sweep(n, f0, f1) * env(len(n), att, 2.2)
    save(name, norm(y, pk))

# UI click: crisp transient + tiny resonant body.
x = t(.05); y = np.sin(2 * np.pi * 2300 * x) * np.exp(-x * 220) + 0.5 * np.sin(2 * np.pi * 5200 * x) * np.exp(-x * 600)
y += sosfilt(butter(2, 3000, 'high', fs=SR, output='sos'), rng.standard_normal(len(x))) * np.exp(-x * 900) * 0.6
save('click', norm(y, -6))

# Picker tick: lighter, shorter click for rolling numbers.
x = t(.025); y = np.sin(2 * np.pi * 3400 * x) * np.exp(-x * 500) + sosfilt(butter(2, 4000, 'high', fs=SR, output='sos'), rng.standard_normal(len(x))) * np.exp(-x * 1400) * .5
save('tick', norm(y, -8))

# Bubble pop (capsules / chat bubbles appearing).
x = t(.09); f = 520 + 520 * (1 - np.exp(-x * 60)); ph = 2 * np.pi * np.cumsum(f) / SR
save('pop', norm(np.sin(ph) * np.exp(-x * 45) * (1 - np.exp(-x * 2000)), -7))

# Impact for big numbers: sub drop + soft body + filtered transient, gently saturated.
x = t(1.1); f = 38 + 50 * np.exp(-x * 18); ph = 2 * np.pi * np.cumsum(f) / SR
y = np.sin(ph) * np.exp(-x * 4.2) + 0.35 * np.sin(2 * np.pi * 140 * x) * np.exp(-x * 14)
y += sosfilt(butter(2, [200, 2500], 'band', fs=SR, output='sos'), rng.standard_normal(len(x))) * np.exp(-x * 45) * .9
save('impact', norm(np.tanh(y * 1.6), -3))

# Softer hit for secondary numbers.
save('impact-soft', norm(np.tanh(y[: int(.6 * SR)] * np.exp(-t(.6) * 3) * 1.2), -7))

# Ball strike: short leather thump.
x = t(.22); f = 70 + 160 * np.exp(-x * 60); ph = 2 * np.pi * np.cumsum(f) / SR
y = np.sin(ph) * np.exp(-x * 26) + sosfilt(butter(2, [900, 4500], 'band', fs=SR, output='sos'), rng.standard_normal(len(x))) * np.exp(-x * 160) * 1.3
save('kick', norm(np.tanh(y * 1.4), -4))

# Net ripple: high noise with fast flutter, decaying.
x = t(.7); n = sosfilt(butter(2, [1800, 9000], 'band', fs=SR, output='sos'), rng.standard_normal(len(x)))
y = n * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * x)) * env(len(x), .06, 2.5)
save('net', norm(y, -12))

# Referee whistle: pea-whistle tone (~2.9 kHz) with fast warble, short burst.
x = t(.42); f = 2900 + 90 * np.sin(2 * np.pi * 34 * x); ph = 2 * np.pi * np.cumsum(f) / SR
y = (np.sin(ph) + 0.25 * np.sin(2 * ph)) * env(len(x), .04, 1.2) * (1 - np.exp(-x * 300))
y += sosfilt(butter(2, [2500, 6000], 'band', fs=SR, output='sos'), rng.standard_normal(len(x))) * env(len(x), .04, 1.2) * .08
save('whistle', norm(y, -10))

# Body hit (tackle / shoulder): dull low thud with a cloth-y noise burst.
x = t(.35); f = 55 + 90 * np.exp(-x * 40); ph = 2 * np.pi * np.cumsum(f) / SR
y = np.sin(ph) * np.exp(-x * 16) + sosfilt(butter(2, [300, 1800], 'band', fs=SR, output='sos'), rng.standard_normal(len(x))) * np.exp(-x * 60) * .7
save('thud', norm(np.tanh(y * 2), -5))

# Cloth pull: short rising band-noise rip.
x = t(.22); n = rng.standard_normal(len(x)); y = bp_sweep(n, 900, 3200, q=2.5) * env(len(x), .7, 1.5) * (0.7 + 0.3 * np.sign(np.sin(2 * np.pi * 70 * x)))
save('rip', norm(y, -10))
