#!/usr/bin/env bash
# =============================================================================
# Turn the Higgsfield dish clips into the numbered frame sequence the hero
# scrubs through, then point index.html at the real frame count.
#
#   usage:  ./tools/build-frames.sh clip-01.mp4 clip-02.mp4 clip-03.mp4 clip-04.mp4
#
# Clips are cross-dissolved into one continuous shot, so the dishes flow into
# each other instead of hard-cutting. Output lands in tapas/frames/ as
# plate_0001.webp, plate_0002.webp, ...
# =============================================================================
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$HERE/frames"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

FPS=15          # extraction rate — 15 is plenty once the engine lerps between frames
WIDTH=1000      # long edge; the hero never renders the plate wider than ~720px
QUALITY=68      # webp quality
XFADE=0.7       # seconds of cross-dissolve between dishes

command -v ffmpeg >/dev/null || { echo "ffmpeg not found. brew install ffmpeg (mac) / apt install ffmpeg (linux)"; exit 1; }
[ "$#" -ge 1 ] || { echo "usage: $0 clip-01.mp4 [clip-02.mp4 ...]"; exit 1; }

echo "→ normalising $# clip(s)"
i=0
NORM=()
for f in "$@"; do
  i=$((i+1))
  n="$WORK/n$(printf '%02d' "$i").mp4"
  ffmpeg -v error -y -i "$f" \
    -vf "scale=${WIDTH}:${WIDTH}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${WIDTH}:(ow-iw)/2:(oh-ih)/2:color=0xF6F2EC,fps=${FPS}" \
    -an "$n"
  NORM+=("$n")
done

if [ "${#NORM[@]}" -eq 1 ]; then
  cp "${NORM[0]}" "$WORK/joined.mp4"
else
  echo "→ cross-dissolving between dishes"
  cur="${NORM[0]}"
  for ((k=1; k<${#NORM[@]}; k++)); do
    dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$cur")
    off=$(python3 -c "print(max(0, $dur - $XFADE))")
    nxt="$WORK/j$k.mp4"
    ffmpeg -v error -y -i "$cur" -i "${NORM[$k]}" \
      -filter_complex "[0:v][1:v]xfade=transition=fade:duration=${XFADE}:offset=${off},fps=${FPS}" \
      -an "$nxt"
    cur="$nxt"
  done
  cp "$cur" "$WORK/joined.mp4"
fi

echo "→ extracting frames"
rm -f "$OUT"/plate_*.webp
mkdir -p "$OUT"
ffmpeg -v error -y -i "$WORK/joined.mp4" -q:v "$QUALITY" "$OUT/plate_%04d.webp"

COUNT=$(ls -1 "$OUT"/plate_*.webp | wc -l | tr -d ' ')
echo "→ $COUNT frames written to frames/"

# point the hero at the real count
python3 - "$HERE/index.html" "$COUNT" <<'PY'
import re, sys
path, count = sys.argv[1], sys.argv[2]
src = open(path, encoding="utf-8").read()
src = re.sub(r"var FRAME_COUNT = \d+;", f"var FRAME_COUNT = {count};", src)
src = src.replace("var USE_FRAMES = false;", "var USE_FRAMES = true;")
open(path, "w", encoding="utf-8").write(src)
print(f"→ index.html now reads FRAME_COUNT = {count}, USE_FRAMES = true")
PY

TOTAL=$(du -sh "$OUT" | cut -f1)
echo "→ done. frames/ is $TOTAL. Open tapas/index.html and scroll."
