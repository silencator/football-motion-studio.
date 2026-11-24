#!/usr/bin/env python3
"""
Synthesised signature underscore for the analytics series: minimal tension pulse, 86 BPM, A minor.
Deterministic (seeded). Sections are placed on a timeline in seconds so the full film can sync
the silence and the drop to narration.  Usage: python3 scripts/make-music.py out.wav [--demo]
"""
import sys, wave
import numpy as np

SR = 44100
BPM = 86
BEAT = 60 / BPM
rng = np.random.default_rng(7)

def t_(d): return np.arange(int(d * SR)) / SR

def spec_filter(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); g = np.ones_like(f)
    if hi: g *= 1 / np.sqrt(1 + (f / hi) ** 4)
    if lo: g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X * g, len(x))

def add(buf, x, at):
    i = int(at * SR); j = min(len(buf), i + len(x))
    if i < len(buf): buf[i:j] += x[: j - i]

def heartbeat(v=1.0):
    t = t_(0.5); f = 42 + 38 * np.exp(-t * 18)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return v * np.sin(ph) * np.exp(-t * 7) * (1 - np.exp(-t * 400))

def tick(v=1.0, bright=6000):
    t = t_(0.05); n = rng.standard_normal(len(t))
    return v * spec_filter(n, lo=bright) * np.exp(-t * 140)

def pad(freqs, d, v=1.0):
    t = t_(d); x = np.zeros_like(t)
    for k, f in enumerate(freqs):
        for det in (-0.12, 0.12):
            ph = rng.uniform(0, 6.28)
            x += np.sin(2 * np.pi * f * (1 + det / 100) * t + ph) + 0.25 * np.sin(4 * np.pi * f * t + ph)
    env = np.minimum(1, t / 1.6) * np.minimum(1, (d - t) / 1.2)
    trem = 1 + 0.15 * np.sin(2 * np.pi * 0.23 * t)
    return v * spec_filter(x * env * trem, hi=1800) / len(freqs)

def pluck(f, v=1.0):
    t = t_(1.6)
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.1 * np.sin(6 * np.pi * f * t)
    return v * x * np.exp(-t * 3.2) * (1 - np.exp(-t * 300))

def riser(d, v=1.0):
    t = t_(d); n = spec_filter(rng.standard_normal(len(t)), lo=1500, hi=7000)
    f = 180 + 500 * (t / d) ** 2
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3
    return v * (n * 0.22 + s) * (t / d) ** 2.2

def impact(v=1.0):
    t = t_(2.5); f = 38 + 60 * np.exp(-t * 10)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    air = spec_filter(rng.standard_normal(len(t)), lo=300, hi=5000) * np.exp(-t * 6) * 0.25
    return v * (sub + air)

def reverb(x, wet=0.25, decay=2.2):
    ir_t = t_(decay); ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 6.9 / decay)
    ir = spec_filter(ir, lo=200, hi=6000); ir /= np.sqrt(np.sum(ir ** 2))
    n = len(x) + len(ir)
    y = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[: len(x)]
    return x * (1 - wet) + y * wet

AM = [110.0, 164.81, 196.0, 246.94, 261.63]   # Am9
FM = [87.31, 130.81, 164.81, 220.0, 261.63]   # Fmaj7
EM = [82.41, 123.47, 196.0, 246.94, 293.66]   # Em7/G-ish colour

def build(total, silence_at=None, drop_at=None, calm_until=None):
    """calm until `calm_until`, tension until the silence, 0.6 s of nothing, drop, then strip back."""
    buf = np.zeros(int(total * SR))
    calm_until = calm_until if calm_until is not None else (silence_at or total)
    b = 0.0; i = 0
    while b < total:
        in_sil = silence_at is not None and silence_at - 0.05 <= b < (drop_at or total)
        after = drop_at is not None and b >= drop_at
        tense = b >= calm_until and not in_sil and not after
        if not in_sil:
            if i % 2 == 0: add(buf, heartbeat(0.9 if not after else 1.0), b)
            if i % 2 == 0: add(buf, heartbeat(0.45), b + BEAT * 0.28)
            add(buf, tick(0.12 if i % 2 else 0.07), b + BEAT / 2)
            if tense or after:
                add(buf, tick(0.06, 8000), b + BEAT / 4); add(buf, tick(0.06, 8000), b + 3 * BEAT / 4)
        b += BEAT; i += 1
    # pads, two bars each
    bar = 4 * BEAT; chords = [AM, FM, AM, EM]; k = 0; s = 0.0
    while s < total:
        seg_end = min(total, s + 2 * bar)
        if silence_at is not None and s < silence_at < seg_end: seg_end = silence_at
        if silence_at is not None and silence_at <= s < (drop_at or 0): s = drop_at; continue
        add(buf, pad(chords[k % 4], seg_end - s + 0.01, 0.55 if (drop_at and s >= drop_at) else 0.38), s)
        s = seg_end; k += 1
    if silence_at is not None:
        add(buf, riser(min(3.0, silence_at), 0.2), silence_at - min(3.0, silence_at))
        end = int(silence_at * SR); buf[end:int(drop_at * SR)] = 0
        add(buf, impact(0.9), drop_at)
        for n, (f, dt) in enumerate([(440, 0), (523.25, 0.5), (659.25, 1.0), (587.33, 1.75), (440, 2.4)]):
            add(buf, pluck(f, 0.22), drop_at + dt * BEAT * 1.0)
    fade = np.minimum(1, (total - np.arange(len(buf)) / SR) / 1.5)
    buf = reverb(buf) * np.clip(fade, 0, 1)
    if silence_at is not None:  # keep the silence truly silent (reverb tail cut)
        buf[int((silence_at + 0.12) * SR):int(drop_at * SR)] *= 0.0
    return buf / (np.max(np.abs(buf)) + 1e-9) * 0.89

def write(path, x):
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())

if __name__ == '__main__':
    out = sys.argv[1]
    if '--calm' in sys.argv:
        write(out, build(14.0))
    else:  # demo arc: calm → tension → half-second silence → drop → tail
        write(out, build(14.5, silence_at=7.6, drop_at=8.2, calm_until=4.2))
    print('wrote', out)
