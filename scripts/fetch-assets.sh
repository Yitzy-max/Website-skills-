#!/usr/bin/env bash
# Downloads the generated source files and compresses them into images/ and videos/.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p images videos .tmp-assets
while IFS='|' read -r name size q url; do
  [[ -z "$name" || "$name" == \#* ]] && continue
  if [[ "$size" == "mp4" ]]; then
    curl -sfL -o ".tmp-assets/$name.mp4" "$url"
    ffmpeg -v error -y -i ".tmp-assets/$name.mp4" -an -vf "scale=1280:-2" -c:v libx264 -crf "$q" -preset slow -pix_fmt yuv420p -movflags +faststart "videos/$name.mp4"
    # 10-frame contact sheet, one frame per second, for checking the pour timing
    ffmpeg -v error -y -i ".tmp-assets/$name.mp4" -vf "fps=1,scale=384:-1,tile=5x2" -q:v 4 "videos/$name-contact-sheet.jpg"
  else
    curl -sfL -o ".tmp-assets/$name.png" "$url"
    ffmpeg -v error -y -i ".tmp-assets/$name.png" -vf "scale=$size:-2:flags=lanczos" -c:v libwebp -quality "$q" -compression_level 6 "images/$name.webp"
  fi
  echo "ok $name"
done < scripts/asset-sources.txt
rm -rf .tmp-assets
ls -la images videos
