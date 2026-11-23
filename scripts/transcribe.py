"""Narration → text + word timestamps (offline, CPU).
  python scripts/transcribe.py public/audio/<file>.mp3     → public/data/<file>.transcript.json
Whisper small.en gives the text per phrase; Zipformer gives per-word times. Models come from
k2-fsa GitHub releases (Hugging Face is blocked) and are cached in ~/.cache/fms-asr.
Needs: pip install sherpa-onnx soundfile numpy"""
import sys, os, re, json, subprocess, tarfile, urllib.request
import sherpa_onnx, soundfile as sf

CACHE = os.path.expanduser('~/.cache/fms-asr')
REL = 'https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/'
MODELS = ['sherpa-onnx-whisper-small.en', 'sherpa-onnx-zipformer-en-2023-06-26']

def ensure(name):
    d = os.path.join(CACHE, name)
    if not os.path.isdir(d):
        os.makedirs(CACHE, exist_ok=True); tb = d + '.tar.bz2'
        print('downloading', name, flush=True); urllib.request.urlretrieve(REL + name + '.tar.bz2', tb)
        with tarfile.open(tb) as t: t.extractall(CACHE)
        os.remove(tb)
    return d + '/'

src = sys.argv[1]; base = os.path.splitext(os.path.basename(src))[0]
wav = f'/tmp/{base}.16k.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '16000', wav], check=True)
a, sr = sf.read(wav, dtype='float32'); dur = len(a) / sr
Wd, Zd = ensure(MODELS[0]), ensure(MODELS[1])
wh = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=Wd + 'small.en-encoder.int8.onnx', decoder=Wd + 'small.en-decoder.int8.onnx', tokens=Wd + 'small.en-tokens.txt', num_threads=4)
zp = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=Zd + 'encoder-epoch-99-avg-1.onnx', decoder=Zd + 'decoder-epoch-99-avg-1.onnx', joiner=Zd + 'joiner-epoch-99-avg-1.onnx', tokens=Zd + 'tokens.txt', num_threads=4)

# phrases = speech between pauses ≥ 0.18 s
log = subprocess.run(['ffmpeg', '-nostats', '-i', wav, '-af', 'silencedetect=noise=-38dB:d=0.18', '-f', 'null', '-'], capture_output=True, text=True).stderr
ss = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]; se = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
bounds, t = [], 0.0
for s, e in zip(ss, se):
    if s - t > 0.05: bounds.append((t, s))
    t = e
if dur - t > 0.1: bounds.append((t, dur))

out = []
for s, e in bounds:
    s0 = max(0, s - 0.05); seg = a[int(s0 * sr):int(min(dur, e + 0.05) * sr)]
    res = []
    for rec in (wh, zp):
        st = rec.create_stream(); st.accept_waveform(sr, seg); rec.decode_stream(st); res.append(st.result)
    words = []
    for tok, ts in zip(res[1].tokens, res[1].timestamps):
        if tok[:1] in ('▁', ' ') or not words: words.append([tok.strip('▁ '), round(s0 + ts, 2)])
        else: words[-1][0] += tok
    out.append({'start': round(s, 2), 'end': round(e, 2), 'text': res[0].text.strip(), 'words': words})
    print(f"{s:6.2f}-{e:6.2f} | {res[0].text.strip()}\n        " + ' '.join(f'{w}@{x}' for w, x in words), flush=True)
os.makedirs('public/data', exist_ok=True)
json.dump(out, open(f'public/data/{base}.transcript.json', 'w'), indent=1)
print(f'✔ public/data/{base}.transcript.json · {dur:.2f}s · {len(out)} phrases')
