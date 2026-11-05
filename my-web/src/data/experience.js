// Kinh nghiệm làm việc, xếp từ mới nhất đến cũ nhất.
// period: thời gian | company: công ty | role: vị trí | stack: công nghệ chính (hiện ở danh sách)
// Phần chi tiết (hiện trong cửa sổ trượt lên khi click):
//   location: nơi làm việc | summary: mô tả ngắn | tech: tag công nghệ
//   projects: danh sách dự án trong công ty, mỗi dự án gồm:
//     name: tên dự án | desc: mô tả ngắn (tuỳ chọn) | tasks: các đầu việc đã làm
// TODO: thay nội dung mẫu bên dưới bằng kinh nghiệm thật của bạn.
export const EXPERIENCE = [
  {
    period: '10/2025 – Now',
    company: 'FPT SOFTWARE',
    role: 'Software Engineer',
    stack: 'Python',
    location: 'Ho Chi Minh City, Vietnam',
    summary:
      'Phát triển và vận hành các dịch vụ backend bằng Python cho khách hàng của FPT Software.',
    projects: [
      {
        name: 'Tên dự án A',
        desc: 'Mô tả ngắn về dự án A (khách hàng, mục tiêu).',
        tasks: [
          'Thiết kế và xây dựng các API / service backend bằng Python.',
          'Viết test, review code và tối ưu hiệu năng cho các module chính.',
        ],
      },
      {
        name: 'Tên dự án B',
        desc: 'Mô tả ngắn về dự án B.',
        tasks: [
          'Phối hợp với team và khách hàng để phân tích yêu cầu.',
          'Giao tính năng đúng hạn, hỗ trợ vận hành sau release.',
        ],
      },
    ],
    tech: ['Python'],
  },
  {
    period: '11/2023 – 09/2025',
    company: 'GSI GROUP LLC',
    role: 'Software Developer',
    stack: 'Python · TypeScript · React',
    location: 'Ho Chi Minh City, Vietnam',
    summary:
      'Làm full-stack: xây dựng giao diện React/TypeScript và dịch vụ backend Python.',
    projects: [
      {
        name: 'Tên dự án A',
        desc: 'Mô tả ngắn về dự án A.',
        tasks: [
          'Xây dựng giao diện web bằng React + TypeScript, tái sử dụng component.',
          'Phát triển API backend bằng Python và tích hợp với frontend.',
        ],
      },
      {
        name: 'Tên dự án B',
        desc: 'Mô tả ngắn về dự án B.',
        tasks: ['Cải thiện chất lượng code, quy trình review và triển khai.'],
      },
    ],
    tech: ['Python', 'TypeScript', 'React'],
  },
  {
    period: '09/2022 – 11/2023',
    company: 'FINTECT DRACO CORPORATION',
    role: 'Junior Backend Developer',
    stack: 'Python · ERP ',
    location: 'Ho Chi Minh City, Vietnam',
    summary:
      'Bước đầu đi làm: phát triển và tuỳ biến các module ERP bằng Python.',
    projects: [
      {
        name: 'Tên dự án ERP A',
        desc: 'Mô tả ngắn về dự án.',
        tasks: [
          'Phát triển và tuỳ biến các module ERP theo nghiệp vụ doanh nghiệp.',
          'Sửa lỗi, hỗ trợ vận hành và cải tiến tính năng hiện có.',
        ],
      },
    ],
    tech: ['Python', 'ERP'],
  },
];
