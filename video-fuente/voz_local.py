"""Voz gratis (Microsoft Edge TTS) con tiempos por palabra → voz/*.wav + voz.js

Uso:  python voz.py guion.json --out <proyecto> [--voice es-CO-GonzaloNeural] [--rate +8%] [--gap 0.35] [--lead 0.4]

guion.json: {"lines":[{"id":"s1","text":"Hola…", "say":"texto alternativo para pronunciar (opcional)",
                       "show":{"cuatrocientos ochenta y ocho por ciento":"488 %"}, "hold":0.6}]}
Escribe <proyecto>/voz/NN.wav y <proyecto>/voz.js con window.VOZ = {lines:[{id,src,start,end}], words:[{text,start,end}], duration}
Los tiempos son absolutos (segundos desde el inicio del video). Las líneas se encadenan con `gap` (+ `hold` propio).
"""
import ssl, os, edge_tts.communicate as _ec
_ec._SSL_CTX = ssl.create_default_context(cafile=os.environ.get("SSL_CERT_FILE"))
import argparse, asyncio, json, pathlib, re, subprocess

import edge_tts, sys
sys.stdout.reconfigure(encoding="utf-8")

ap = argparse.ArgumentParser()
ap.add_argument("guion"); ap.add_argument("--out", required=True)
ap.add_argument("--voice", default="es-CO-GonzaloNeural"); ap.add_argument("--rate", default="+8%")
ap.add_argument("--gap", type=float, default=0.35); ap.add_argument("--lead", type=float, default=0.4)
ap.add_argument("--pitch", default="+0Hz"); ap.add_argument("--tail", type=float, default=1.2)
A = ap.parse_args()

out = pathlib.Path(A.out); (out / "voz").mkdir(parents=True, exist_ok=True)
G = json.loads(pathlib.Path(A.guion).read_text(encoding="utf-8"))
norm = lambda w: re.sub(r"[^\wáéíóúüñ%]", "", w.lower())

def merge(words, show):
    """Junta palabras habladas en un token visual (p. ej. 'cuatrocientos … por ciento' → '488 %')."""
    rules = [(k.lower().split(), v) for k, v in (show or {}).items()]
    res, i = [], 0
    while i < len(words):
        for seq, tok in rules:
            seg = words[i:i + len(seq)]
            if [norm(w["text"]) for w in seg] == [norm(s) for s in seq]:
                tail = re.sub(r"^[\wáéíóúüñ%]+", "", seg[-1]["text"])
                res.append({"text": tok + tail, "start": seg[0]["start"], "end": seg[-1]["end"]}); i += len(seq); break
        else:
            res.append(words[i]); i += 1
    return res

def dur_of(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                                capture_output=True, text=True).stdout)

async def main():
    t, lines, allw = A.lead, [], []
    for n, L in enumerate(G["lines"], 1):
        mp3 = out / "voz" / f"{n:02d}.mp3"; wav = out / "voz" / f"{n:02d}.wav"
        c = edge_tts.Communicate(L.get("say", L["text"]), L.get("voice", A.voice), rate=L.get("rate", A.rate), pitch=L.get("pitch", A.pitch), boundary="WordBoundary")
        words = []
        with open(mp3, "wb") as f:
            async for ch in c.stream():
                if ch["type"] == "audio": f.write(ch["data"])
                elif ch["type"] == "WordBoundary":
                    s = ch["offset"] / 1e7; d = ch["duration"] / 1e7
                    words.append({"text": ch["text"], "start": s, "end": s + d})
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp3), "-ar", "48000", "-ac", "2", str(wav)], check=True)
        mp3.unlink()
        d = dur_of(wav)
        if words: d = min(d, words[-1]["end"] + 0.2)  # recorta el silencio final de cada frase
        words = merge(words, L.get("show"))
        for w in words: allw.append({"text": w["text"], "start": round(t + w["start"], 3), "end": round(t + w["end"], 3), "line": L["id"]})
        lines.append({"id": L["id"], "src": f"voz/{n:02d}.wav", "start": round(t, 3), "end": round(t + d, 3), "text": L["text"]})
        print(f'{L["id"]:>4}  {t:6.2f}–{t + d:6.2f}s  {L["text"][:70]}')
        t += d + A.gap + L.get("hold", 0)
    total = round(t - A.gap + A.tail, 2)
    data = {"voice": A.voice, "lines": lines, "words": allw, "duration": total}
    (out / "voz.js").write_text("window.VOZ = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    print(f"✓ voz.js · {len(lines)} líneas · {len(allw)} palabras · duración {total}s")

asyncio.run(main())
