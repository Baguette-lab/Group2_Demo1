"""Rebuild the original Room for Two instrumental (optional: numpy and ffmpeg).

No samples or existing songs are used. The website only needs the finished MP3.
"""
from pathlib import Path
import subprocess
import tempfile
import wave
import numpy as np

SR = 44100
BEAT = 60 / 76
BAR = BEAT * 4
LENGTH = round(16 * BAR * SR)
mix = np.zeros((LENGTH, 2), dtype=np.float64)
rng = np.random.default_rng(147)


def add(note, beat, duration, gain, voice="keys", pan=0):
    seconds = duration * BEAT
    t = np.arange(round((seconds + 1.6) * SR)) / SR
    f = 440 * 2 ** ((note - 69) / 12)
    if voice == "pad":
        sound = np.sin(2 * np.pi * f * t) + .16 * np.sin(2 * np.pi * f * 2 * t)
        envelope = np.minimum(t / .55, 1) * np.minimum(np.maximum((seconds + 1.4 - t) / 1.4, 0), 1)
        sound *= .9 + .1 * np.sin(2 * np.pi * .28 * t)
    elif voice == "bass":
        sound = np.sin(2 * np.pi * f * t) + .14 * np.sin(2 * np.pi * f * 2 * t)
        envelope = (1 - np.exp(-t * 35)) * np.exp(-t / 1.3) * np.clip((seconds + .4 - t) / .4, 0, 1)
    else:
        # Gentle electric keys: a soft fundamental with a little bell color.
        sound = np.sin(2 * np.pi * f * t + .32 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 3))
        sound += .11 * np.sin(2 * np.pi * f * 3 * t) * np.exp(-t * 4)
        envelope = (1 - np.exp(-t * 95)) * np.exp(-t / .92) * np.clip((seconds + 1.2 - t) / .8, 0, 1)
    sample = sound * envelope * gain
    stereo = sample[:, None] * np.array([np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)])
    start = round(beat * BEAT * SR)
    # Fold release tails across the loop seam instead of adding a silent gap.
    indices = (start + np.arange(len(sample))) % LENGTH
    np.add.at(mix, indices, stereo)


chords = [
    (45, [57, 60, 64, 71]), (41, [57, 60, 64, 69]),
    (36, [55, 60, 64, 74]), (43, [55, 59, 64, 69]),
]
for bar in range(16):
    bass, notes = chords[(bar // 2) % 4]
    for p, note in enumerate(notes):
        add(note, bar * 4, 3.2, .018, "pad", -.45 + p * .3)
    add(bass, bar * 4, 2.5, .074, "bass", 0)
    add(bass + 12, bar * 4 + 2.5, 1, .024, "bass", .05)
    pattern = [0, 2, 1, 3, 2, 1] if bar % 2 == 0 else [2, 1, 3, 2, 0, 2]
    for j, offset in enumerate([0, .75, 1.5, 2, 2.75, 3.5]):
        add(notes[pattern[j]], bar * 4 + offset, .7, .062 * rng.uniform(.83, 1.05), pan=(-.3 if j % 2 else .3))
    if bar in [1, 5, 9, 13]:
        for offset, note in zip([.5, 1.75, 3], [76, 74, 71] if bar < 8 else [72, 74, 76]):
            add(note, bar * 4 + offset, .9, .034, pan=.12)

# Quiet, diffuse echoes, with the same circular wrap for a smooth repeating bed.
dry = mix.copy()
for delay, gain in [(BEAT * .75, .13), (BEAT * 1.5, .07), (BEAT * 2.25, .035)]:
    mix += np.roll(dry[:, ::-1], round(delay * SR), axis=0) * gain
mix -= mix.mean(axis=0)
mix *= .48 / np.max(np.abs(mix))
output = Path(__file__).with_name("story-ambience.mp3")
with tempfile.TemporaryDirectory() as tmp:
    wav = Path(tmp) / "ambience.wav"
    with wave.open(str(wav), "wb") as file:
        file.setnchannels(2)
        file.setsampwidth(2)
        file.setframerate(SR)
        file.writeframes((mix * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav), "-codec:a", "libmp3lame", "-b:a", "160k", "-metadata", "title=Room for Two", "-metadata", "comment=Original instrumental for Sa Iisang Bubong", str(output)], check=True)
print(f"{output.name}: {LENGTH / SR:.2f}s, peak {np.max(np.abs(mix)):.3f}, RMS {np.sqrt(np.mean(mix ** 2)):.3f}")
