(() => {
  "use strict";

  const els = {
    progress: document.getElementById("progress"),
    image: document.getElementById("stepImage"),
    hotspot: document.getElementById("hotspot"),
    tapCatcher: document.getElementById("tapCatcher"),
    title: document.getElementById("stepTitle"),
    narration: document.getElementById("narration"),
    btnBack: document.getElementById("btnBack"),
    btnNext: document.getElementById("btnNext"),
    hint: document.getElementById("hint"),
    toast: document.getElementById("toast"),
    done: document.getElementById("done"),
    btnRestart: document.getElementById("btnRestart"),
    phoneFrame: document.getElementById("phoneFrame"),
  };

  let data = null;
  let index = 0;
  let toastTimer = null;
  let currentHotspot = null;

  function stepSrc(step) {
    const emb =
      typeof window.IMCHECK_STEP_IMAGES === "object" &&
      window.IMCHECK_STEP_IMAGES[String(step.id)];
    return emb || step.image;
  }

  async function load() {
    const res = await fetch("steps.json", { cache: "no-store" });
    if (!res.ok) throw new Error("無法載入 steps.json");
    data = await res.json();
    render();
  }

  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.hidden = true;
    }, 1600);
  }

  function contentBox() {
    const frame = els.phoneFrame.getBoundingClientRect();
    const nw = els.image.naturalWidth || 1;
    const nh = els.image.naturalHeight || 1;
    const fr = frame.width / frame.height;
    const ir = nw / nh;
    let cw, ch, ox, oy;
    if (ir > fr) {
      cw = frame.width;
      ch = frame.width / ir;
      ox = 0;
      oy = (frame.height - ch) / 2;
    } else {
      ch = frame.height;
      cw = frame.height * ir;
      ox = (frame.width - cw) / 2;
      oy = 0;
    }
    return { fw: frame.width, fh: frame.height, cw, ch, ox, oy };
  }

  function placeHotspot(hs) {
    currentHotspot = hs;
    if (!hs) {
      els.hotspot.hidden = true;
      return;
    }
    const box = contentBox();
    if (!box.fw || !els.image.naturalWidth) {
      els.hotspot.hidden = true;
      return;
    }
    const left = box.ox + hs.fx * box.cw;
    const top = box.oy + hs.fy * box.ch;
    const w = hs.fw * box.cw;
    const h = hs.fh * box.ch;
    els.hotspot.hidden = false;
    els.hotspot.style.left = `${(left / box.fw) * 100}%`;
    els.hotspot.style.top = `${(top / box.fh) * 100}%`;
    els.hotspot.style.width = `${(w / box.fw) * 100}%`;
    els.hotspot.style.height = `${(h / box.fh) * 100}%`;
  }

  function render() {
    if (!data) return;
    const total = data.steps.length;
    if (index >= total) {
      els.done.hidden = false;
      return;
    }
    els.done.hidden = true;
    const step = data.steps[index];
    els.progress.textContent = `第 ${step.id}／${total}`;
    els.title.textContent = step.title;
    els.narration.textContent = step.narration;
    els.btnBack.disabled = index === 0;

    const hasHotspot = !!step.hotspot;
    els.btnNext.hidden = hasHotspot;
    els.hint.textContent = hasHotspot
      ? "請點畫面上的紅框區域以繼續"
      : "確認畫面後點「下一步」";

    const apply = () => placeHotspot(step.hotspot);
    const src = stepSrc(step);
    els.image.alt = step.title;
    if (els.image.getAttribute("src") === src && els.image.complete && els.image.naturalWidth) {
      apply();
    } else {
      els.hotspot.hidden = true;
      els.image.onload = apply;
      els.image.src = src;
    }
  }

  function goNext() {
    index += 1;
    render();
  }

  function goBack() {
    if (index <= 0) return;
    index -= 1;
    render();
  }

  els.hotspot.addEventListener("click", (e) => {
    e.stopPropagation();
    goNext();
  });

  els.tapCatcher.addEventListener("click", () => {
    const step = data && data.steps[index];
    if (step && step.hotspot) showToast("請點紅框區域");
  });

  els.btnNext.addEventListener("click", goNext);
  els.btnBack.addEventListener("click", goBack);
  els.btnRestart.addEventListener("click", () => {
    index = 0;
    render();
  });

  window.addEventListener("resize", () => {
    if (currentHotspot) placeHotspot(currentHotspot);
  });

  els.phoneFrame.addEventListener("contextmenu", (e) => e.preventDefault());

  load().catch((err) => {
    els.narration.textContent = String(err.message || err);
  });
})();
