export function boxBlur(src, w, h, r) {
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  const k = 2 * r + 1;
  const cl = (v, m) => Math.min(m - 1, Math.max(0, v));

  for (let y = 0; y < h; y++) {
    let s = 0;
    for (let x = -r; x <= r; x++) s += src[y * w + cl(x, w)];
    for (let x = 0; x < w; x++) {
      tmp[y * w + x] = s / k;
      s += src[y * w + cl(x + r + 1, w)] - src[y * w + cl(x - r, w)];
    }
  }
  for (let x = 0; x < w; x++) {
    let s = 0;
    for (let y = -r; y <= r; y++) s += tmp[cl(y, h) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = s / k;
      s += tmp[cl(y + r + 1, h) * w + x] - tmp[cl(y - r, h) * w + x];
    }
  }
  return out;
}
