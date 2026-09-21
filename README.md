# iMCheck SOP 互動教學（步驟 1–5）

Mobile-first Traditional Chinese training for **US3C / iMCheck** channel staff.
Tap red teaching hotspots to advance; steps without a red box use **下一步**.

## Local

```bash
cd /workspace/imcheck-sop-web
python3 -m http.server 8787
# open http://127.0.0.1:8787/
```

## Files

| Path | Role |
|------|------|
| `index.html` / `app.js` / `styles.css` | UI |
| `steps.json` | id, image, title, narration, hotspot `{fx,fy,fw,fh}` 0–1 or null |
| `steps/0N.jpg` (+ `.png` originals) | Screenshots |
| `scripts/detect_hotspots.py` | OpenCV hollow-red-box detector |

Hotspots detected: **step 2** (估價), **step 3** (測iOS). Steps 1/4/5 → `hotspot: null`.

## Add steps 6–88

1. Drop PNGs into `steps/` as `06.png` … `88.png`.
2. Extend `narration.csv` / `steps.json` titles + narration.
3. In `scripts/detect_hotspots.py`, set range to `range(1, 89)` and re-run:
   ```bash
   /workspace/imcheck-capcut/.venv/bin/python scripts/detect_hotspots.py
   ```
4. Optional: re-encode JPG for web size; keep PNG for print quality.
5. Redeploy the static folder.

Brand: **US3C / iMCheck** only — no 燦坤 assets.
