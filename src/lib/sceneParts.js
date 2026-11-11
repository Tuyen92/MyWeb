import * as THREE from 'three';

/** Môi trường chrome sáng: dải trắng / đen xen kẽ để tạo phản chiếu "lỏng" bạc sáng */
export function createEnvironment(renderer) {
  const ec = document.createElement('canvas');
  ec.width = 1024;
  ec.height = 512;
  const c = ec.getContext('2d');

  const bg = c.createLinearGradient(0, 0, 0, 512);
  const stops = [
    [0, '#ffffff'], [0.18, '#9aa0ac'], [0.34, '#050506'], [0.5, '#f6f8fc'],
    [0.62, '#2a2d34'], [0.8, '#cfd4de'], [1, '#ffffff'],
  ];
  stops.forEach(([offset, color]) => bg.addColorStop(offset, color));
  c.fillStyle = bg;
  c.fillRect(0, 0, 1024, 512);

  const strip = (x, w, col) => {
    const g = c.createLinearGradient(x, 0, x + w, 0);
    g.addColorStop(0, 'transparent');
    g.addColorStop(0.5, col);
    g.addColorStop(1, 'transparent');
    c.fillStyle = g;
    c.fillRect(x, 0, w, 512);
  };
  strip(90, 150, '#ffffff');
  strip(360, 90, 'rgba(0,0,0,.9)');
  strip(540, 220, '#ffffff');
  strip(830, 130, '#c4d2ff');

  const et = new THREE.CanvasTexture(ec);
  et.mapping = THREE.EquirectangularReflectionMapping;
  et.encoding = THREE.sRGBEncoding;
  return new THREE.PMREMGenerator(renderer).fromEquirectangular(et).texture;
}

/** Hai vòng elip mảnh quanh chữ */
export function createRings() {
  const group = new THREE.Group();
  const rm = new THREE.MeshStandardMaterial({
    color: 0xffffff, metalness: 1, roughness: 0.12, envMapIntensity: 2,
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.012, 8, 260), rm);
  ring.scale.y = 0.36;
  ring.rotation.z = 0.16;
  ring.position.z = -0.4;
  group.add(ring);

  const r2 = ring.clone();
  r2.scale.set(0.8, 0.8, 0.8);
  r2.rotation.set(1.15, 0.2, -0.5);
  r2.position.z = 0;
  group.add(r2);
  return group;
}

/** Hạt bụi nền */
export function createDust(count = 70) {
  const pp = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pp[i * 3] = (Math.random() - 0.5) * 26;
    pp[i * 3 + 1] = (Math.random() - 0.5) * 14;
    pp[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  return new THREE.Points(
    pg,
    new THREE.PointsMaterial({
      color: 0xffffff, size: 0.03, transparent: true, opacity: 0.35, depthWrite: false,
    }),
  );
}
