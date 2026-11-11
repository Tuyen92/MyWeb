import { boxBlur } from './boxBlur';

/**
 * Ngôi sao 4 cánh lõm -> heightmap "thổi phồng" -> normal map.
 * Cùng cách làm với buildText (chữ STERLING) nên khi đặt vào scene với cùng vật liệu chrome
 * và cùng môi trường phản chiếu, hai vật thể có chất liệu giống nhau.
 *
 * Chỉ dùng canvas 2D, không phụ thuộc three.
 */

/** Khoảng cách từ mỗi điểm bên trong hình tới mép gần nhất (chamfer 2 lượt) */
function distanceInside(mask, W, H) {
  const d = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) d[i] = mask[i] > 0.5 ? 1e9 : 0;
  const A = 1;
  const B = Math.SQRT2;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      let v = d[i];
      if (v === 0) continue;
      if (x > 0) v = Math.min(v, d[i - 1] + A);
      if (y > 0) {
        v = Math.min(v, d[i - W] + A);
        if (x > 0) v = Math.min(v, d[i - W - 1] + B);
        if (x < W - 1) v = Math.min(v, d[i - W + 1] + B);
      }
      d[i] = v;
    }
  }
  for (let y = H - 1; y >= 0; y--) {
    for (let x = W - 1; x >= 0; x--) {
      const i = y * W + x;
      let v = d[i];
      if (v === 0) continue;
      if (x < W - 1) v = Math.min(v, d[i + 1] + A);
      if (y < H - 1) {
        v = Math.min(v, d[i + W] + A);
        if (x < W - 1) v = Math.min(v, d[i + W + 1] + B);
        if (x > 0) v = Math.min(v, d[i + W - 1] + B);
      }
      d[i] = v;
    }
  }
  return d;
}

/** Vẽ đường viền sao 4 cánh: 4 mũi nhọn nối nhau bằng các cung lõm */
function starPath(c, r, pinch) {
  const p = r * pinch;
  c.beginPath();
  c.moveTo(0, -r);
  c.quadraticCurveTo(p, -p, r, 0);
  c.quadraticCurveTo(p, p, 0, r);
  c.quadraticCurveTo(-p, p, -r, 0);
  c.quadraticCurveTo(-p, -p, 0, -r);
  c.closePath();
}

/**
 * @param size    cạnh texture (px)
 * @param arm     độ dài cánh so với size (0.46 = gần chạm mép)
 * @param pinch   độ thắt eo: nhỏ = cánh mảnh, lớn = sao mập
 * @param fatten  làm tròn / dày thêm mũi nhọn (px)
 * @param radius  bề rộng vùng "phồng" tính từ mép vào (tỉ lệ so với size)
 * @param puff    độ nổi khối của chrome (giống C.puff của chữ)
 */
export function makeStarMaps({
  size = 512,
  arm = 0.46,
  pinch = 0.15,
  fatten = 10,
  radius = 0.2,
  puff = 50,
} = {}) {
  const N = size;

  const draw = (k) => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = N * k;
    const c = cv.getContext('2d');
    c.fillStyle = '#000';
    c.fillRect(0, 0, cv.width, cv.height);
    c.scale(k, k);
    c.translate(N / 2, N / 2);
    starPath(c, N * arm, pinch);
    c.fillStyle = '#fff';
    c.strokeStyle = '#fff';
    c.lineJoin = 'round';
    c.lineWidth = fatten;
    c.fill();
    c.stroke();
    return cv;
  };

  const hi = draw(2); // dùng làm alphaMap (viền sắc nét)
  const lo = draw(1);
  const W = N;
  const H = N;
  const px = lo.getContext('2d').getImageData(0, 0, W, H).data;
  const mask = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) mask[i] = px[i * 4] / 255;

  // chiều cao: mặt cắt tròn từ mép vào trong, cánh càng mảnh càng thấp
  const dist = distanceInside(mask, W, H);
  const R = N * radius;
  let h = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const q = Math.min(1, dist[i] / R);
    h[i] = Math.sqrt(1 - (1 - q) * (1 - q)) - 0.1 * Math.exp(-Math.pow((q - 0.42) / 0.1, 2)); // rãnh viền như chữ
  }
  h = boxBlur(boxBlur(h, W, H, 3), W, H, 3); // làm mượt để vệt phản chiếu liền mạch

  const nc = document.createElement('canvas');
  nc.width = W;
  nc.height = H;
  const nctx = nc.getContext('2d');
  const img = nctx.createImageData(W, H);
  const S = puff;
  const at = (x, y) => h[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let nx = -(at(x + 1, y) - at(x - 1, y)) * S;
      let ny = (at(x, y + 1) - at(x, y - 1)) * S;
      let nz = 1;
      const l = Math.hypot(nx, ny, nz);
      nx /= l;
      ny /= l;
      nz /= l;
      const o = (y * W + x) * 4;
      img.data[o] = (nx * 0.5 + 0.5) * 255;
      img.data[o + 1] = (ny * 0.5 + 0.5) * 255;
      img.data[o + 2] = (nz * 0.5 + 0.5) * 255;
      img.data[o + 3] = 255;
    }
  }
  nctx.putImageData(img, 0, 0);

  return { alpha: hi, normal: nc, W, H };
}
