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


# ───────────── "Spy" style (owner brand theme): original stealth-thriller feel, D minor, 104 BPM ─────────────
SPY_BPM = 104
E8 = 60 / SPY_BPM / 2
def nf(name):  # note name → Hz, e.g. 'D2', 'Bb3'
    names = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}
    n, o = name[:-1], int(name[-1])
    return 440 * 2 ** ((names[n] + 12 * (o + 1) - 69) / 12)

def bass(f, d=0.26, v=1.0):  # round plucked electric/upright bass
    t = t_(d + 0.15)
    x = sum((1 / k) * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (6 + 5 * k)) for k in range(1, 6))
    return v * x * np.minimum(1, np.maximum(0, (d + 0.15 - t) / 0.08)) * (1 - np.exp(-t * 600))

def mute_pluck(f, v=1.0):  # palm-muted, tiptoeing staccato (odd harmonics, dark)
    t = t_(0.22)
    x = sum((1 / k) * np.sin(2 * np.pi * f * k * t) for k in (1, 3, 5, 7))
    return v * spec_filter(x * np.exp(-t * 22), hi=2600)

def snare(v=1.0):  # brushed snare
    t = t_(0.25); n = spec_filter(rng.standard_normal(len(t)), lo=900, hi=6000)
    return v * (n * np.exp(-t * 18) + 0.3 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30))

def saw(f, t, n=24):
    return sum(((-1) ** (k + 1)) / k * np.sin(2 * np.pi * f * k * t) for k in range(1, n) if f * k < 12000)

def brass_stab(freqs, v=1.0, d=0.9):  # short ensemble stab with filter envelope
    t = t_(d)
    x = sum(saw(f * (1 + det), t) for f in freqs for det in (-0.003, 0.003))
    env = (1 - np.exp(-t * 60)) * np.exp(-t * 3.5)
    bright = spec_filter(x, hi=3500) * np.exp(-t * 5) + spec_filter(x, hi=900) * (1 - np.exp(-t * 5))
    return v * bright * env / len(freqs)

def echo(x, dt=E8 * 3, fb=0.35, n=4):
    y = x.copy()
    for k in range(1, n + 1):
        sh = int(dt * k * SR); y[sh:] += x[: len(x) - sh] * fb ** k
    return y

def build_spy(total=10.5, silence_at=7.25, drop_at=7.75):
    buf = np.zeros(int(total * SR)); plk = np.zeros_like(buf)
    line = ['D2', 'D2', 'F2', 'D2', 'G2', 'F2', 'E2', 'C2',  'D2', 'D2', 'F2', 'D2', 'A2', 'G2', 'F2', 'E2']
    arp = ['A4', None, 'D5', None, 'F5', 'E5', None, 'D5',  'A4', None, 'C5', None, 'D5', None, 'A4', None]
    i = 0; tt = 0.0
    while tt < silence_at - 0.02:
        add(buf, bass(nf(line[i % 16]), v=0.55), tt)
        if i % 4 == 0: add(buf, heartbeat(0.55), tt)
        add(buf, tick(0.05 if i % 2 else 0.09, 7000), tt)
        if tt >= 3.2:
            if i % 4 == 2: add(buf, snare(0.22), tt)
            if arp[i % 16]: add(plk, mute_pluck(nf(arp[i % 16]), 0.22), tt)
        tt += E8; i += 1
    buf += echo(plk)
    # dark pad: Dm(add9) → Bbmaj7 → Gm → A7sus
    for k, ch in enumerate([['D3', 'A3', 'E4', 'F4'], ['Bb2', 'F3', 'A3', 'D4'], ['G2', 'D3', 'Bb3', 'F4'], ['A2', 'E3', 'G3', 'D4']]):
        s0 = k * 16 * E8 / 2 * 1.0
        if s0 >= silence_at: break
        add(buf, pad([nf(n) for n in ch], min(16 * E8 / 2, silence_at - s0) + 0.01, 0.3), s0)
    add(buf, riser(2.2, 0.16), silence_at - 2.2)
    buf[int(silence_at * SR):] *= 0
    # the drop: brass stab + low impact + bass hit, then a last tiptoe and a sustained dark chord
    add(buf, brass_stab([nf(n) for n in ['D3', 'A3', 'C4', 'F4', 'E5']], 0.8), drop_at)
    add(buf, impact(0.7), drop_at)
    add(buf, bass(nf('D1'), d=0.9, v=0.7), drop_at)
    add(buf, brass_stab([nf(n) for n in ['D3', 'A3', 'C4', 'F4', 'E5']], 0.45, d=0.5), drop_at + E8 * 3)
    add(buf, pad([nf(n) for n in ['D2', 'A2', 'F3', 'E4']], total - drop_at - 0.3, 0.35), drop_at + 0.2)
    fade = np.clip((total - np.arange(len(buf)) / SR) / 1.2, 0, 1)
    buf = reverb(buf, wet=0.22) * fade
    buf[int((silence_at + 0.1) * SR):int(drop_at * SR)] = 0
    return buf / (np.max(np.abs(buf)) + 1e-9) * 0.89

def write(path, x):
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())

if __name__ == '__main__':
    out = sys.argv[1]
    if '--spy' in sys.argv:
        write(out, build_spy())
    elif '--calm' in sys.argv:
        write(out, build(14.0))
    else:  # demo arc: calm → tension → half-second silence → drop → tail
        write(out, build(14.5, silence_at=7.6, drop_at=8.2, calm_until=4.2))
    print('wrote', out)
