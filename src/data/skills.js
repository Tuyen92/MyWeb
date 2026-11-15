// Danh sách skill. tier: 1 = lớn nhất / nổi bật nhất → 4 = nhỏ nhất.
// x, y: vị trí (%) trong khung Skills trên màn hình rộng. Có thể kéo thả số để xếp lại.
// Trên mobile (< 860px) các chữ tự xếp dòng nên x, y không còn tác dụng.
export const SKILLS = [
  { name: 'Python', tier: 1, x: 45.8, y: 27.8 },
  { name: 'React', tier: 1, x: 11.4, y: 31.2 },
  { name: 'SQL', tier: 1, x: 31.0, y: 42.3 },
  { name: 'Javascript', tier: 2, x: 22.2, y: 17.9 },
  { name: 'REST API', tier: 2, x: 40.3, y: 55.1 },
  { name: 'Django', tier: 2, x: 60.7, y: 49.5 },
  { name: 'FastAPI', tier: 2, x: 50.3, y: 70.1 },
  { name: 'Git', tier: 2, x: 66.2, y: 36.0 },
  { name: 'Typescript', tier: 3, x: 70.3, y: 66.8 },
  { name: 'Java', tier: 3, x: 60.2, y: 16.0 },
  { name: 'CSS', tier: 3, x: 20.9, y: 55.5 },
  { name: 'HTML', tier: 3, x: 13.9, y: 63.5 },
  { name: 'Node.js', tier: 4, x: 69.2, y: 25.0 },
  { name: 'Agile', tier: 4, x: 32.1, y: 66.5 },

  // ---- Thêm từ CV (xếp vị trí tự động để không đè lên các skill ở trên) ----
  // Core concepts
  { name: 'OOP', tier: 4, x: 95.8, y: 20.7 },
  { name: 'Design Patterns', tier: 4, x: 0.8, y: 95.0 },
  { name: 'Scrum', tier: 4, x: 15.0, y: 84.9 },
  // Backend
  { name: 'Django REST', tier: 4, x: 40.2, y: 1.9 },
  { name: 'JWT', tier: 4, x: 68.1, y: 2.9 },
  { name: 'OAuth2', tier: 4, x: 2.6, y: 24.9 },
  { name: 'Pandas', tier: 3, x: 91.2, y: 90.9 },
  { name: 'Matplotlib', tier: 4, x: 63.8, y: 95.2 },
  { name: 'Pytest', tier: 4, x: 2.0, y: 71.8 },
  // Frontend
  { name: 'Redux', tier: 3, x: 92.3, y: 45.0 },
  { name: 'Axios', tier: 4, x: 65.1, y: 76.3 },
  { name: 'Mantine', tier: 4, x: 0.7, y: 47.6 },
  { name: 'Ant Design', tier: 4, x: 14.4, y: 1.2 },
  { name: 'MUI', tier: 4, x: 33.8, y: 1.7 },
  // Database
  { name: 'MySQL', tier: 3, x: 1.1, y: 1.4 },
  { name: 'MariaDB', tier: 4, x: 83.7, y: 24.2 },
  { name: 'SQLite', tier: 4, x: 54.5, y: 94.1 },
  // Tools & Platforms
  { name: 'GitHub', tier: 4, x: 38.8, y: 28.5 },
  { name: 'GitLab', tier: 4, x: 41.0, y: 74.6 },
  { name: 'VS Code', tier: 4, x: 78.6, y: 94.2 },
  { name: 'PyCharm', tier: 4, x: 76.0, y: 1.8 },
  { name: 'Postman', tier: 3, x: 89.7, y: 1.5 },
  { name: 'Swagger', tier: 4, x: 87.5, y: 68.5 },
  // AI & Productivity
  { name: 'GitHub Copilot', tier: 4, x: 19.1, y: 95.4 },
  { name: 'ChatGPT', tier: 4, x: 79.3, y: 46.4 },
  { name: 'Claude', tier: 4, x: 53.1, y: 1.2 },
  { name: 'AI-assisted coding', tier: 4, x: 35.3, y: 95.2 },
];
