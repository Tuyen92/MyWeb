// Kinh nghiệm làm việc, xếp từ mới nhất đến cũ nhất.
// Mọi mục dùng CÙNG MỘT cấu trúc để cửa sổ chi tiết (ExperienceSheet) hiển thị đồng bộ:
//
//   period, company, location, job_type, summary, tech[]
//   roles: [                       // vị trí mới nhất đứng đầu
//     {
//       title,                     // tên vị trí
//       period,                    // (tuỳ chọn) thời gian riêng của vị trí
//       projects: [
//         { name, desc, tech[] (tuỳ chọn), tasks: [ ... ] }
//       ],
//     },
//   ]
//
// Quy ước viết: tiếng Anh, mỗi task là MỘT câu hoàn chỉnh, bắt đầu bằng động từ quá khứ.
// Chỉ có 1 vị trí thì cửa sổ không hiện thanh vị trí; có từ 2 vị trí trở lên thì hiện thanh phân nhóm.
// Danh sách bên ngoài lấy vị trí đầu tiên (roles[0]) và 3 công nghệ đầu của `tech`.

export const EXPERIENCE = [
  {
    period: '10/2025 – Now',
    company: 'FPT SOFTWARE',
    location: 'Ho Chi Minh City, Vietnam',
    job_type: 'Full-time',
    summary:
      'Developing and maintaining Python backend services and plugins for FPT Software customers.',
    tech: ['Python', 'Pandas', 'MATLAB', 'Matplotlib'],
    roles: [
      {
        title: 'Software Engineer',
        projects: [
          {
            name: 'GEVernova Tunning & Operability',
            // TODO: sửa lại mô tả cho đúng với dự án thật
            desc: 'Python plugins for data extraction, calculation and report generation on simulation data.',
            tech: ['Python', 'Pandas', 'MATLAB'],
            tasks: [
              'Developed plugin workflows for data extraction, MATLAB-based calculations using Pandas, automated Matplotlib/Excel report generation, and production readiness support.',
              'Fixed bugs and implemented unit tests for all plugins using GitHub Copilot.',
              'Ran simulation plugins on Simulation Data Management in multiple environments.',
              'Held sync-up meetings with the Project Owner for sprint planning and user story reporting.',
              'Developed and maintained documentation for all plugins to ensure clear usage, integration, and maintenance guidelines.',
            ],
          },
        ],
      },
    ],
  },
  {
    period: '11/2023 – 09/2025',
    company: 'GSI GROUP LLC',
    location: 'Ho Chi Minh City, Vietnam',
    job_type: 'Full-time',
    summary:
      'Built Allplan desktop add-ons and the Piledesigner web front-end. Started as a junior developer on the Automation-Hub reporting tools.',
    tech: ['Python', 'TypeScript', 'React', 'Allplan', 'JSON', 'Odoo', 'MariaDB'],
    roles: [
      {
        title: 'Software Developer',
        projects: [
          {
            name: 'Schöck Tronsole',
            desc: 'Allplan desktop add-on for placing and adjusting product geometry.',
            tech: ['Allplan'],
            tasks: [
              'Implemented user-selected placement points and updated geometry based on product type.',
              'Implemented handlers that allow users to adjust the geometry, position, and direction of the objects.',
            ],
          },
          {
            name: 'Critical Zone',
            desc: 'Allplan desktop add-on that calculates the critical zone at wall connections.',
            tech: ['Allplan'],
            tasks: [
              'Implemented a user-selected placement point, detecting perpendicular wall connections and calculating the center of critical zone.',
              'Designed and developed a UI palette and handled its data validation.',
            ],
          },
          {
            name: 'Tebea Balcony Connector',
            desc: 'Allplan desktop add-on for configuring balcony connector products in 3D.',
            tech: ['Allplan', 'JSON', 'Excel'],
            tasks: [
              'Designed a JSON-based data structure to store detailed product information extracted from an Excel file.',
              'Developed a UI palette and handled constraints for users choosing product parameters.',
              'Implemented reinforcement geometry and arrow labels for each product type.',
              'Implemented a workflow for 3D positioning, orientation, and reactivation mode of objects.',
            ],
          },
          {
            name: 'Piledesigner',
            desc: 'Web application where I served as the main front-end developer.',
            tech: ['TypeScript', 'React'],
            tasks: [
              'Served as the main front-end developer, building applications with TypeScript and React.',
              'Re-designed the UI and improved the UX for the Login, Register, Workspace, Account, and Projects pages.',
              'Implemented a cookie-based “Remember Me”, the registration workflow, user info validation, and project–user role assignment.',
              'Integrated new back-end APIs, refactored the front-end component workflows, and handled user permissions at the component level.',
              'Fixed bugs and enhanced data grid components to display multiple data types and validate user inputs. \nCustomized themes and handled translated text for the guided tour feature.',
              'Tested all features of the Piledesigner front-end.',
            ],
          },
        ],
      },
      {
        title: 'Junior Software Developer',
        projects: [
          {
            name: 'Odoo Timesheet Reports',
            desc: 'Part of the Automation-Hub reporting tools.',
            tech: ['Odoo', 'MariaDB'],
            tasks: [
              'Designed and created a database schema in MariaDB to store raw data and transformed data.',
              'Developed FastAPI APIs to process Odoo Timesheet data and generate report metrics.'
            ],
          },
        ],
      },
      {
        title: 'Junior Software Developer',
        projects: [
          {
            name: 'CV ETL',
            desc: 'Part of the Automation-Hub reporting tools.',
            tech: ['FastAPI', 'MariaDB'],
            tasks: [
              'Designed and created a database schema in MariaDB to store applicant data and CV logs.',
              'Developed FastAPI endpoints to process applicant data from ChatGPT and log CV evaluation workflows.'
            ],
          },
        ],
      },
      {
        title: 'Junior Software Developer',
        projects: [
          {
            name: 'Internal Translation Platform',
            desc: 'Part of the Automation-Hub reporting tools.',
            tech: ['Flask', 'MariaDB'],
            tasks: [
              'Designed and created a database schema in MariaDB to store construction glossaries in English, German, and Vietnamese.',
              'Developed a Flask application integrating DeepL, Google Translate, and LibreTranslate, with a workflow to replace words and refine translation.'
            ],
          },
        ],
      },
      {
        title: 'Junior Software Developer',
        projects: [
          {
            name: 'Assessment web application',
            desc: 'Part of the Automation-Hub reporting tools.',
            tech: ['Flask', 'MariaDB'],
            tasks: [
              'Designed and created a database schema in MariaDB to store quiz data, candidate information, assessments, and results.',
              'Developed a Flask application integrating Moodle and Odoo APIs to retrieve data and process technical and MBTI assessments.'
            ],
          },
        ],
      },
    ],
  },
  {
    period: '09/2022 – 11/2023',
    company: 'FINTECT DRACO CORPORATION',
    location: 'Ho Chi Minh City, Vietnam',
    job_type: 'Full-time',
    summary:
      'First job: developed and customized ERP modules in Python.',
    tech: ['Python', 'ERP'],
    roles: [
      {
        title: 'Junior Backend Developer',
        projects: [
          {
            name: 'Multi E-com',
            desc: 'Business modules for an enterprise ERP system.',
            tech: ['Python', 'ERPNext'],
            tasks: [
              'Customized ERPNext modules to store seller data, including seller information, products, warehouse, orders, invoices, and shipping.',
              'Integrated Tiki and TikTok e-commerce APIs with ERPNext.',
              'Built features to handle data between ERPNext and e-commerce platforms.',
              'Built webhooks to automatically call APIs and ensure data consistency between systems.',
              'Tested features and workflows of seller selling processes in ERPNext',
            ],
          },


          {
            name: 'Thai Son Driving Training Center’s LMS',
            desc: 'Business modules for an enterprise ERP system.',
            tech: ['Python', 'ERPNext'],
            tasks: [
              'Customized ERPNext modules to store data, including student information, courses, and assessments.',
              'Developed features in ERPNext for handling course enrollment, attendance tracking, and course assessments.',
              'Designed and developed UI/UX in ERPNext for student learning.',
            ],
          },
        ],
      },
    ],
  },
];

// Hàm dùng chung để danh sách và cửa sổ chi tiết luôn lấy cùng một nguồn
export const latestRole = (e) => e.roles[0].title;
export const stackOf = (e) => e.tech.slice(0, 3).join(' · ');
