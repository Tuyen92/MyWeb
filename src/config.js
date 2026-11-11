const EMAIL = 'nguyenletuyen9201@gmail.com';
const PHONE = '+84 773 946 632';
const MYGIT = 'https://github.com/Tuyen92';
const MYLINKEDIN = 'https://www.linkedin.com/in/tuyenguyenle/';

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
  // Tên luân phiên ở mục Contact. Mỗi lần đổi tên sẽ kèm một font ngẫu nhiên trong aliasFonts
  aliases: ['Nguyễn Lê Tuyên', 'Tuyen Nguyen Le', 'Sterling Nguyen'],
  // font: font-family | weight: độ đậm | style: 'italic' nếu cần
  // scale: nhân kích thước chữ (font càng hẹp thì để càng lớn, font rộng thì < 1)
  // spacing: letter-spacing (tuỳ chọn)
  aliasFonts: [
    { font: '"Unbounded", sans-serif', weight: 900, scale: 1 },                   // Y2K rộng
    { font: '"Bricolage Grotesque", sans-serif', weight: 800, scale: 1.2 },       // grotesque "lệch" kiểu editorial
    { font: '"Fraunces", serif', weight: 900, style: 'italic', scale: 1.15 },     // serif mềm nghiêng
    { font: '"Space Grotesk", sans-serif', weight: 700, scale: 1.2 },             // tech gọn
    { font: '"Big Shoulders Display", sans-serif', weight: 900, scale: 1.4 },     // cao hẹp kiểu streetwear
    { font: '"Space Mono", monospace', weight: 700, scale: 1 },                   // mono
    { font: '"Baloo 2", sans-serif', weight: 800, scale: 1.2 },                   // tròn bụ, dễ thương
    { font: '"Chakra Petch", sans-serif', weight: 700, scale: 1.15 },             // cyber, góc cạnh
    { font: '"Bungee", sans-serif', weight: 400, scale: 0.9 },                    // chữ biển hiệu đường phố
  ],
  email: EMAIL,
  phone: PHONE,
  nav: ['Experience', 'About', 'Skills', 'Contact'],
  role: ['Software Engineer'],
  place: ['Based in HCMC', 'Vietnam'],
  vertical: 'Seize Your Moment!',

  // Contact Card
  contact: {
    heading: 'Contact',
    avatar: '',
    items: [
      { label: 'Email', lines: [{ text: EMAIL, href: `mailto:${EMAIL}` }] },
      { label: 'Phone', lines: [{ text: PHONE }] },
      {
        label: 'Find me on',
        lines: [
          { text: 'GitHub', href: MYGIT },
          { text: 'LinkedIn', href: MYLINKEDIN },
        ],
      },
    ],
  },
};
