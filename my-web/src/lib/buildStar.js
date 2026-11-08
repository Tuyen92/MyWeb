import * as THREE from 'three';
import { makeStarMaps } from './starMaps';

/**
 * Ngôi sao 4 cánh chrome: cùng vật liệu và cùng cách xếp lớp tạo độ dày với chữ STERLING (buildText),
 * nên khi đặt cùng môi trường phản chiếu (createEnvironment) hai vật thể trông cùng một chất liệu.
 */
export function buildStar(opts) {
  const { alpha, normal } = makeStarMaps(opts);
  const am = new THREE.CanvasTexture(alpha);
  const nm = new THREE.CanvasTexture(normal);
  am.anisotropy = nm.anisotropy = 8;

  const SIZE = 6; // cạnh mặt phẳng trong đơn vị scene
  const geo = new THREE.PlaneGeometry(SIZE, SIZE);

  const front = new THREE.MeshStandardMaterial({
    color: 0xffffff, metalness: 1, roughness: 0.07, envMapIntensity: 2.6,
    normalMap: nm, alphaMap: am, alphaTest: 0.5, side: THREE.DoubleSide,
  });
  const back = new THREE.MeshStandardMaterial({
    color: 0xb9bfcc, metalness: 1, roughness: 0.3, envMapIntensity: 1.6,
    alphaMap: am, alphaTest: 0.5, side: THREE.DoubleSide,
  });

  const group = new THREE.Group();
  for (let i = 1; i <= 10; i++) {
    const m = new THREE.Mesh(geo, back);
    m.position.z = -i * 0.03; // độ dày
    group.add(m);
  }
  group.add(new THREE.Mesh(geo, front));
  group.position.z = 0.15; // đưa tâm độ dày về gốc để xoay không bị lệch

  const holder = new THREE.Group();
  holder.add(group);

  return {
    group: holder,
    size: SIZE,
    dispose() {
      geo.dispose();
      front.dispose();
      back.dispose();
      am.dispose();
      nm.dispose();
    },
  };
}
