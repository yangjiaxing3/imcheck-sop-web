# iMCheck SOP 互動教學（步驟 1–5）

Mobile-first Traditional Chinese training page for US3C / iMCheck channel staff.

## Run locally

```bash
cd /workspace/imcheck-sop-web
python3 -m http.server 8787
# open http://127.0.0.1:8787/
```

## Structure

- `index.html` / `app.js` / `styles.css` — UI
- `steps.json` — step metadata + normalized hotspots `{fx,fy,fw,fh}` in 0–1
- `steps/01.jpg` … `05.jpg` (+ `images-N.js` embedded data URIs for deploy without binary push)
- `scripts/detect_hotspots.py` — OpenCV hollow-red-box detector

## Add steps 6–88

1. Drop PNGs into `steps/` as `06.png`, `07.png`, …
2. Append narration to `steps.json`.
3. Re-run: `/workspace/imcheck-capcut/.venv/bin/python scripts/detect_hotspots.py` (extend range).
4. Hotspot null → UI shows **下一步**; hollow red box → pulse overlay.
5. Redeploy static site.

Brand: **US3C / iMCheck** only — no 燦坤 assets.
