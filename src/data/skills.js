// Skills theo NHÓM (lấy từ CV). Trang chỉ hiện tên nhóm, rê chuột vào nhóm thì hiện cửa sổ nhỏ liệt kê tech bên trong.
// tier: 1 = lớn nhất → 3 = nhỏ nhất.
// x, y: vị trí (%) trong khung Skills trên màn hình rộng. Có thể chỉnh số để xếp lại.
// Trên mobile (< 860px) các nhóm xếp thành cột và danh sách tech hiện sẵn, nên x, y không còn tác dụng.
export const SKILLS = [
  {
    name: 'Programming Languages',
    tier: 1, x: 3, y: 6,
    items: ['Python', 'Java', 'TypeScript', 'JavaScript', 'SQL'],
  },
  {
    name: 'Backend & Frameworks',
    tier: 1, x: 36, y: 12,
    items: ['FastAPI', 'Django', 'Django REST Framework', 'REST API', 'Node.js', 'ERPNext'],
  },
  {
    name: 'Frontend & UI',
    tier: 2, x: 70, y: 4,
    items: ['React', 'Redux', 'HTML5', 'CSS3', 'Axios', 'Ant Design', 'Material-UI', 'Mantine'],
  },
  {
    name: 'Databases & Data Processing',
    tier: 2, x: 8, y: 42,
    items: ['MySQL', 'MariaDB', 'SQLite', 'Database Schema Design', 'Pandas', 'Matplotlib', 'ETL'],
  },
  {
    name: 'Security, DevOps & Tools',
    tier: 2, x: 44, y: 48,
    items: ['JWT', 'OAuth2', 'Git', 'GitHub', 'GitLab', 'Postman', 'Swagger', 'Pytest', 'VS Code', 'PyCharm'],
  },
  {
    name: 'Core Concepts',
    tier: 3, x: 76, y: 40,
    items: ['OOP', 'Design Patterns', 'Agile', 'Scrum'],
  },
  {
    name: 'AI Tools',
    tier: 3, x: 24, y: 82,
    items: ['GitHub Copilot', 'ChatGPT', 'Claude', 'AI-assisted coding'],
  },
];
