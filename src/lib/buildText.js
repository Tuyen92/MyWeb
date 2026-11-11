import * as THREE from 'three';
import { boxBlur } from './boxBlur';

/** Chữ -> heightmap "thổi phồng" -> normal map -> chrome lỏng kiểu Y2K */
export async function buildText(C) {
  try {
    await document.fonts.load(`${C.fontStyle} 100px ${C.fontFamily}`, C.text);
  } catch {
    /* bỏ qua nếu font chưa load được */
  }

  const size = 160;
  const lines = C.text.split('\n');
  const lh = size * 1.12;
  const font = `${C.fontStyle} ${size}px ${C.fontFamily}`;

  const m0 = document.createElement('canvas').getContext('2d');
  m0.font = font;
  const maxW = Math.max(...lines.map((l) => m0.measureText(l).width));
  const W = Math.ceil(maxW + 140 + C.skew * size);
  const H = Math.ceil(lines.length * lh + 110);

  const draw = (k) => {
    const cv = document.createElement('canvas');
    cv.width = W * k;
    cv.height = H * k;
    const c = cv.getContext('2d');
    c.fillStyle = '#000';
    c.fillRect(0, 0, cv.width, cv.height);
    c.scale(k, k);
    c.translate(W / 2, H / 2);
    c.transform(1, 0, -C.skew, 1, 0, 0);
    c.font = font;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = '#fff';
    c.strokeStyle = '#fff';
    c.lineJoin = 'round';
    c.lineWidth = C.fatten;
    lines.forEach((t, i) => {
      const y = (i - (lines.length - 1) / 2) * lh + size * 0.04;
      c.fillText(t, 0, y);
      if (C.fatten > 0) c.strokeText(t, 0, y);
    });
    return cv;
  };

  const hi = draw(2);
  const lo = draw(1);
  const d = lo.getContext('2d').getImageData(0, 0, W, H).data;
  const mask = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) mask[i] = d[i * 4] / 255;

  let b = mask;
  for (let p = 0; p < 3; p++) b = boxBlur(b, W, H, 7);

  let h = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const v = Math.min(1, Math.max(0, (b[i] - 0.5) * 2));
    h[i] = Math.sqrt(v) - 0.1 * Math.exp(-Math.pow((v - 0.42) / 0.1, 2)); // rãnh viền bên trong
  }
  h = boxBlur(h, W, H, 2);

  const nc = document.createElement('canvas');
  nc.width = W;
  nc.height = H;
  const nctx = nc.getContext('2d');
  const img = nctx.createImageData(W, H);
  const S = C.puff * 0.5;
  const at = (x, y) =>
    h[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let nx = -(at(x + 1, y) - at(x - 1, y)) * S;
      let ny = (at(x, y + 1) - at(x, y - 1)) * S;
      let nz = 1;
      const l = Math.hypot(nx, ny, nz);
      nx /= l; ny /= l; nz /= l;
      const o = (y * W + x) * 4;
      img.data[o] = (nx * 0.5 + 0.5) * 255;
      img.data[o + 1] = (ny * 0.5 + 0.5) * 255;
      img.data[o + 2] = (nz * 0.5 + 0.5) * 255;
      img.data[o + 3] = 255;
    }
  }
  nctx.putImageData(img, 0, 0);

  const am = new THREE.CanvasTexture(hi);
  const nm = new THREE.CanvasTexture(nc);
  am.anisotropy = nm.anisotropy = 8;

  const wW = 8;
  const wH = (wW * H) / W;
  const geo = new THREE.PlaneGeometry(wW, wH, 200, 2);

  if (C.curve > 0) {
    const q = geo.attributes.position;
    for (let i = 0; i < q.count; i++) {
      const x = q.getX(i);
      const y = q.getY(i);
      const th = x / C.curve;
      q.setX(i, (C.curve + y) * Math.sin(th));
      q.setY(i, (C.curve + y) * Math.cos(th) - C.curve);
    }
  }

  const front = new THREE.MeshStandardMaterial({
    color: 0xffffff, metalness: 1, roughness: 0.07, envMapIntensity: 2.6,
    normalMap: nm, alphaMap: am, alphaTest: 0.5, side: THREE.DoubleSide,
  });
  const back = new THREE.MeshStandardMaterial({
    color: 0xb9bfcc, metalness: 1, roughness: 0.3, envMapIntensity: 1.6,
    alphaMap: am, alphaTest: 0.5, side: THREE.DoubleSide,
  });

  const g = new THREE.Group();
  for (let i = 1; i <= 10; i++) {
    const m = new THREE.Mesh(geo, back);
    m.position.z = -i * 0.03; // độ dày
    g.add(m);
  }
  g.add(new THREE.Mesh(geo, front));

  return {
    group: g,
    width: wW,
    height: wH + (C.curve > 0 ? C.curve * (1 - Math.cos(wW / 2 / C.curve)) : 0),
  };
}
