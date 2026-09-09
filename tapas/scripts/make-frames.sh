#!/usr/bin/env bash
# Turn a video (or a folder of photos) into the numbered frame sequence the
# Tapas hero scrubs through, at two sizes, and record the count.
#
#   ./scripts/make-frames.sh path/to/clip.mp4        # from a video
#   ./scripts/make-frames.sh path/to/photos/         # from a folder of stills
#
# Needs ffmpeg:  brew install ffmpeg  /  apt install ffmpeg
set -euo pipefail

SRC="${1:-}"
FPS="${FPS:-30}"          # frames pulled per second of video
MAX_FRAMES="${MAX_FRAMES:-420}"   # hard cap — see the note on weight below
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BIG="$ROOT/public/frames/tapas/1440"
SMALL="$ROOT/public/frames/tapas/720"

if [ -z "$SRC" ]; then
  echo "usage: $0 <video-file|photo-folder>" >&2
  exit 1
fi

FFMPEG="${FFMPEG:-ffmpeg}"
command -v "$FFMPEG" >/dev/null || {
  echo "ffmpeg not found — install it, or run with FFMPEG=/path/to/ffmpeg" >&2
  exit 1
}

rm -f "$BIG"/frame_*.jpg "$SMALL"/frame_*.jpg
mkdir -p "$BIG" "$SMALL"

if [ -d "$SRC" ]; then
  # Photo folder: order by filename, one frame per photo.
  n=0
  for f in $(ls "$SRC" | sort); do
    case "${f,,}" in
      *.jpg|*.jpeg|*.png|*.webp|*.heic) ;;
      *) continue ;;
    esac
    n=$((n + 1))
    printf -v idx "%04d" "$n"
    "$FFMPEG" -loglevel error -y -i "$SRC/$f" \
      -vf "scale=1440:-2:flags=lanczos" -q:v 4 "$BIG/frame_$idx.jpg"
    "$FFMPEG" -loglevel error -y -i "$SRC/$f" \
      -vf "scale=720:-2:flags=lanczos" -q:v 5 "$SMALL/frame_$idx.jpg"
  done
else
  # Video: sample at $FPS, capped at $MAX_FRAMES.
  "$FFMPEG" -loglevel error -y -i "$SRC" \
    -vf "fps=$FPS,scale=1440:-2:flags=lanczos" -q:v 4 \
    -frames:v "$MAX_FRAMES" "$BIG/frame_%04d.jpg"
  "$FFMPEG" -loglevel error -y -i "$SRC" \
    -vf "fps=$FPS,scale=720:-2:flags=lanczos" -q:v 5 \
    -frames:v "$MAX_FRAMES" "$SMALL/frame_%04d.jpg"
fi

COUNT=$(ls "$BIG"/frame_*.jpg 2>/dev/null | wc -l | tr -d ' ')

# First frame doubles as the poster for slow connections / reduced motion.
if [ "$COUNT" -gt 0 ]; then
  cp "$BIG/frame_0001.jpg" "$ROOT/public/frames/tapas/poster.jpg"
fi

cat > "$ROOT/lib/frames-manifest.json" <<JSON
{
  "count": $COUNT,
  "note": "Written by scripts/make-frames.sh. 0 means no frames uploaded yet."
}
JSON

BYTES=$(du -sh "$BIG" 2>/dev/null | cut -f1)
SBYTES=$(du -sh "$SMALL" 2>/dev/null | cut -f1)
echo "frames: $COUNT   desktop set: $BYTES   phone set: $SBYTES"
if [ "$COUNT" -gt 0 ]; then
  echo "If the poster is a .jpg now, point POSTER in lib/tapas-frames.ts at /frames/tapas/poster.jpg"
fi
