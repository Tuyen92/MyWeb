export const EXPERIENCE = [
  {
    period: '10/2025 – Now',
    company: 'FPT SOFTWARE CO., LTD',
    location: 'Ho Chi Minh City, Vietnam',
    job_type: 'Full-time',
    tech: ['Python', 'Pandas', 'Matplotlib', 'MATLAB'],
    roles: [
      {
        title: 'Software Engineer',
        projects: [
          {
            name: 'GEVernova Tunning & Operability for Wind Energy',
            desc: 'Develop various plugins to automate the process of handling simulation data for wind turbine design and evaluation.',
            tech: ['Python', 'Pandas', 'Matplotlib', 'MATLAB'],
            tasks: [
              'Developed end-to-en plugin workflows for wind energy data extraction and MATLAB-Based engineering calculations using **Python** and **Pandas**.',
              'Built automated reporting using **Matplotlib** and **openpyxl (Excel)** to generate standardized analytical report for the engineering teams across simulation environments.',
              'Improve code reliability and production readiness by writing comprehensive unit test suites.',
              'Authored technical documentation and user guides, streamlining plugin setup and maintenance for engineering team.',
              'Collaborated directly with the Product Owner on Agile/Scrum sprint planning and user story review to ensure timely feature delivery.',
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
    tech: ['Python', 'FastAPI', 'Flask', 'TypeScript', 'React', 'AllplanAPI', 'Odoo', 'MariaDB'],
    achievements: [
      {
        title: 'Top Performer Certificate - GSI GROUP LLC',
        date: '2024',
      },
    ],
    roles: [
      {
        title: 'Software Developer',
        projects: [
          {
            name: 'Allplan CAD Desktop Add-ons',
            desc: 'Allplan add-ons.',
            tech: ['3D Geometry', 'Python'],
            tasks: [
              '**Schöck Tronsole:** Implemented user-selected placement points with product-based geometry updates and built interactive handler to adjust 3D objects geometry, position, and direction.',
              '**Critical Zone:** Developed placement point selection, automated perpendicular wall connection detection, critical zone center calculations, and a custom UI palette for data handling.',
              '**Tebea Balcony Connector:** Strucutred Excel-to-JSON product catalogs, built interactive UI palettes with parameter constraint validation, and implemented 3D reinforcement geometry, arrow labeling, and object reactivation workflows.'
            ],
          },
          {
            name: 'Piledesigner Web Application',
            desc: 'Web application for soil layer analysis and calculations.',
            tech: ['React', 'TypeScript'],
            tasks: [
              'Led the Front-End architecture and UI/UX overhaul for core modules (Workspace , Project, Account, Auth), improving user workflow efficiency.',
              'Implemented secure cookie-based authenticaiton ("Remember Me"), multi-step registration with validation and granular component-level RBAC permission.',
              'Enhenced data grid components to support rendering types, real-time input validation, and localized guided tours.',
            ],
          },
        ],
      },
      {
        title: 'Junior Software Developer',
        projects: [
          {
            name: 'Automation-Hub',
            desc: 'Internal Enterprise Suite.',
            tech: ['Odoo', 'Python', 'FastAPI', 'MariaDB'],
            tasks: [
              '**Odoo Timesheet Analytics:** Built APIs using **FastAPI** and designed relational schemas in MariaDB to process raw timesheet logs, providing the Software Engineering Manager with fast automated automated reports on project progress and budget utilization.',
              '**CV ETL & Evaluation Processing:** Engineered a CV processing using **FastAPI** and **MariaDB** ro parse candidate resumes, and automate recruitment workflows, helping reduce HR screening time.',
              '**Multilingual Translation Web App:** Developed a web application using **Flask** and designed relational schemas in **MariaDB**, integrating DeeppL, Google Translate, and LibreTranslate APIs with a custom construction glossary engine.',
              '**Automated Assessment Platform:** Created a web application using **Flask** and designed relational schemas in **MariaDB**, integrating Moodle and Odoo APIs to synchronize candidate profiles and evaluate technical and MBTI test results.'
            ],
          },
        ],
      },
    ],
  },
  {
    period: '09/2022 – 11/2023',
    company: 'FINTECH DRACO CORPORATION',
    location: 'Ho Chi Minh City, Vietnam',
    job_type: 'Full-time',
    summary:
      'First job: developed and customized ERP modules in Python.',
    tech: ['Python', 'ERPNext'],
    roles: [
      {
        title: 'Junior Backend Developer',
        projects: [
          {
            name: 'Multi-Channel E-Commerce Integration',
            desc: 'Integrated an e-commerce platform with ERPNext and synchronized data between systems.',
            tech: ['Python', 'ERPNext', 'RESTful APIs'],
            tasks: [
              'Integrated **TIKI** and **TIKTOK SHOP** APIs into **ERPNext**, synchronizing product catalogs, invertory levels, orders, invoices, and shipping status updates across platforms.',
              'Engineered event-dirven webhooks to ensure real-time data consistency between ERPNext and external marketplaces, eliminating manual order entry errors.',
            ],
          },


          {
            name: 'LMS - Thai Son Driving Training Center',
            desc: 'Customized ERPNext into a learning management system for driving training.',
            tech: ['Python', 'ERPNext'],
            tasks: [
              'Customized ERPNext core modules and developed student-facing UI/UX to manage course enrollements, attendance, and exams.',
            ],
          },
        ],
      },
    ],
  },
];

// Common function use to get data in same source
export const latestRole = (e) => e.roles[0].title;
export const stackOf = (e) => e.tech.slice(0, 3).join(' · ');
