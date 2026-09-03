#!/usr/bin/env bash
# Downloads the generated source files and compresses them into images/ and videos/.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p images videos .tmp-assets
while IFS='|' read -r name size q url; do
  [[ -z "$name" || "$name" == \#* ]] && continue
  if [[ "$size" == "mp4" ]]; then
    curl -sfL -o ".tmp-assets/$name.mp4" "$url" </dev/null
    ffmpeg -nostdin -v error -y -i ".tmp-assets/$name.mp4" -an -vf "scale=1280:-2" -c:v libx264 -crf "$q" -preset slow -pix_fmt yuv420p -movflags +faststart "videos/$name.mp4"
    # VP9 twin for browsers without H.264 (and for headless test runs)
    ffmpeg -nostdin -v error -y -i ".tmp-assets/$name.mp4" -an -vf "scale=1280:-2" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -pix_fmt yuv420p "videos/$name.webm"
  else
    curl -sfL -o ".tmp-assets/$name.png" "$url" </dev/null
    ffmpeg -nostdin -v error -y -i ".tmp-assets/$name.png" -vf "scale=$size:-2:flags=lanczos" -c:v libwebp -quality "$q" -compression_level 6 "images/$name.webp"
  fi
  echo "ok $name"
done < scripts/asset-sources.txt
rm -rf .tmp-assets
ls -la images videos
