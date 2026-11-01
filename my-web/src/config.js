const EMAIL = 'nguyenletuyen9201@gmail.com';
const PHONE= '+84 773 946 632';

export const CONFIG = {
  text: 'STERLING',        // chữ 3D (dùng \n để xuống dòng)
  fontStyle: '700',        // vd: '700', '900'
  fontFamily: '"Unbounded", sans-serif', // font Y2K (hỗ trợ tiếng Việt)
  puff: 22,                // độ phồng của chrome (lớn = nổi khối mạnh)
  fatten: 0,               // làm nét chữ dày thêm (px)
  skew: 0,                 // độ nghiêng chữ (vd 0.18)
  curve: 0,                // bán kính cong vòm (nhỏ = cong nhiều, 0 = thẳng)
  tilt: -0.07,             // xoay cả khối (rad)
  ring: true,              // vòng elip mảnh quanh chữ
  name: 'TUYEN NGUYEN',
  email: EMAIL,
  phone: PHONE,
  nav: ['Work', 'About', 'Contact'],
  role: ['Software Engineer'],
  place: ['Based in HCMC', 'Vietnam'],
  vertical: 'Seize Your Moment!',

  // ---- Thẻ liên hệ (hiện khi bấm "Contact" trên menu) ----
  contact: {
    heading: 'Contact',
    avatar: '', // ảnh minh hoạ, vd: '/avatar.png' (để file trong thư mục public/). Để trống thì ẩn.
    items: [
      { label: 'Email', lines: [{ text: EMAIL, href: `mailto:${EMAIL}` }] },
      { label: 'Phone', lines: [{ text: PHONE, href: PHONE }] },
      {
        label: 'Find me on',
        lines: [
          { text: 'GitHub', href: 'https://github.com/' },
          { text: 'LinkedIn', href: 'https://linkedin.com/' },
        ],
      },
    ],
  },
};
