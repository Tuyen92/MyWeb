// Tên công nghệ -> file ảnh logo 3D nằm trong public/logos/
// - Khoá viết thường, khớp với tên trong data/experience.js (không phân biệt hoa/thường).
// - Nên dùng PNG/WebP nền trong suốt, cùng chiều cao (ví dụ 256px) để hàng logo đều nhau.
// - Công nghệ nào chưa có file (hoặc file lỗi) sẽ tự hiện lại thành tag chữ như cũ.
export const TECH_LOGOS = {
  python: 'python.png',
  pandas: 'pandas.png',
  matplotlib: 'matplotlib.png',
  matlab: 'matlab.png',
  react: 'react.png',
  typescript: 'typescript.png',
  fastapi: 'fastapi.png',
  flask: 'flask.png',
  json: 'json.png',
  mariadb: 'mariadb.png',
  odoo: 'odoo.png',
  erpnext: 'erpnext.png',
  erp: 'erp.png',
  excel: 'excel.png',
  allplan: 'allplan.png',
};

export function logoUrl(name) {
  const file = TECH_LOGOS[String(name).toLowerCase()];
  return file ? `${process.env.PUBLIC_URL || ''}/logos/${file}` : null;
}
