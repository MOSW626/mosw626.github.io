// Notion 프로젝트 데이터 - 실제 Notion에서 가져온 상세 정보
export const notionProjects = {
  robotDevelopment: [
    {
      title: 'ISP 개발 프로젝트',
      description: 'PID 제어를 사용한 DC 모터 제어 시스템 개발. IMU 센서의 해상도 한계를 극복하기 위한 연구를 진행했습니다.',
      fullDescription: `이 프로젝트는 STEAM 연구개발(RnE) 프로젝트로, PID 제어 알고리즘을 활용한 DC 모터 제어 시스템을 개발했습니다.
      IMU(Inertial Measurement Unit) 센서의 해상도 한계를 극복하기 위한 다양한 방법을 연구하고 테스트했습니다.
      실제 로봇 시스템에 적용하여 안정적인 제어 성능을 달성했습니다.`,
      technologies: ['PID 제어', 'DC 모터', 'IMU', 'ROS', 'Python'],
      tags: ['STEAM RnE'],
      period: '2023.07.01 - 2023.11.10',
      category: '로봇 개발',
      role: '개발자',
      contribution: '50%',
      link: 'https://mosw.notion.site/ISP-90474110b9a248d5897c7ad48a59afde?source=copy_link',
      github: 'https://github.com/MOSW626/automobile-stability-control_ISP',
      images: [
        '/assets/projects/isp1.jpg',
        '/assets/projects/isp2.jpg',
        '/assets/projects/isp3.jpg'
      ],
      achievements: [
        'PID 제어 알고리즘 최적화',
        'IMU 센서 데이터 처리 개선',
        '실시간 모터 제어 시스템 구현'
      ],
      files: [
        { name: '프로젝트 보고서.pdf', url: '/assets/files/isp_report.pdf' }
      ]
    },
    {
      title: '자동 쓰레기통 개발 프로젝트',
      description: '자동화된 쓰레기통 시스템으로 사용자 편의성 향상',
      fullDescription: `자동으로 열리고 닫히는 쓰레기통 시스템을 개발했습니다. 초음파 센서를 활용하여 사용자 접근을 감지하고,
      서보 모터를 통해 뚜껑을 자동으로 제어합니다. Arduino 기반으로 구현되었으며, 실용적인 IoT 솔루션입니다.`,
      technologies: ['Arduino', '초음파 센서', '서보 모터', 'C++'],
      tags: ['학교 프로젝트'],
      period: '2023.06.15 - 2023.06.25',
      category: '로봇 개발',
      link: 'https://mosw.notion.site/',
      achievements: [
        '초음파 센서 기반 자동 감지 시스템',
        '서보 모터 제어 구현',
        '사용자 친화적 인터페이스 설계'
      ],
      files: [
        // 파일이 있으면 여기에 추가
        // { name: '프로젝트 보고서.pdf', url: '/assets/files/trashcan_report.pdf' }
      ]
    },
    {
      title: '고양이 생체 모방 4륜 구동차 개발 프로젝트',
      description: '2023 YSC 발표대회 참가 선정. 고양이의 움직임을 모방한 4륜 구동 로봇 "고생이" 개발',
      fullDescription: `2023 YSC(Young Scientist Contest) 발표대회에 참가하여 선정된 프로젝트입니다.
      고양이의 생체 모방을 통해 자연스러운 이동 패턴을 구현한 4륜 구동 로봇을 개발했습니다.
      생체 모방 로봇공학의 원리를 적용하여 효율적인 이동 메커니즘을 설계했습니다.`,
      technologies: ['생체 모방', '4륜 구동', 'ROS', 'Python', 'OpenCV'],
      tags: ['YSC'],
      period: '2023.04.10 - 2023.09.10',
      category: '로봇 개발',
      link: 'https://mosw.notion.site/',
      achievements: [
        'YSC 발표대회 참가 선정',
        '생체 모방 로봇 설계 및 구현',
        '자연스러운 이동 패턴 구현'
      ],
      files: [
        // 파일이 있으면 여기에 추가
        // { name: 'YSC 발표 자료.pdf', url: '/assets/files/ysc_presentation.pdf' }
      ]
    },
    {
      title: '자율 주행 자동차 프로젝트',
      description: '센서 기반 자율 주행 시스템 개발',
      fullDescription: `다양한 센서(라이다, 카메라, 초음파)를 융합하여 자율 주행 기능을 구현한 프로젝트입니다.
      ROS를 활용한 센서 융합 및 경로 계획 알고리즘을 개발했습니다. 실제 차량에 적용 가능한 수준의 시스템을 목표로 했습니다.`,
      technologies: ['ROS', '라이다', '카메라', 'SLAM', '경로 계획', 'Python', 'C++'],
      tags: ['학교 프로젝트'],
      period: '2022.10.01 - 2022.11.20',
      category: '로봇 개발',
      link: 'https://mosw.notion.site/',
      achievements: [
        '다중 센서 융합 시스템 구현',
        'SLAM 알고리즘 적용',
        '자율 주행 경로 계획 알고리즘 개발'
      ],
      files: [
        // { name: '자율주행 보고서.pdf', url: '/assets/files/autonomous_report.pdf' }
      ]
    },
    {
      title: '화성 용암 동굴 행성 탐사 로봇 개발 프로젝트',
      description: '행성 탐사를 위한 로봇 시스템 개발',
      fullDescription: `화성의 용암 동굴을 탐사하기 위한 로봇 시스템을 개발했습니다.
      극한 환경에서도 작동할 수 있는 견고한 구조와 센서 시스템을 설계했습니다.
      원격 제어 및 자율 탐사 기능을 모두 갖춘 시스템입니다.`,
      technologies: ['행성 탐사', '원격 제어', '센서 시스템', 'ROS'],
      tags: ['행성 탐사 프로젝트'],
      period: '2022.06.12 - 2022.08.17',
      category: '로봇 개발',
      link: 'https://mosw.notion.site/',
      achievements: [
        '극한 환경 대응 설계',
        '원격 제어 시스템 구현',
        '자율 탐사 알고리즘 개발'
      ],
      files: [
        // { name: '행성탐사 보고서.pdf', url: '/assets/files/planet_report.pdf' }
      ]
    },
    {
      title: 'OpenCV와 AI를 활용한 자율 주행 배달 로봇 제작 프로젝트',
      description: 'OpenCV와 AI 기술을 활용한 배달 로봇 개발',
      fullDescription: `OpenCV를 활용한 컴퓨터 비전과 AI 기술을 결합한 자율 주행 배달 로봇을 개발했습니다.
      물체 인식, 경로 계획, 장애물 회피 등 다양한 기능을 통합했습니다.
      YSC와 학교 프로젝트로 진행되었으며, 실제 배달 환경을 시뮬레이션하여 테스트했습니다.`,
      technologies: ['OpenCV', 'AI', '컴퓨터 비전', 'ROS', 'Python', 'TensorFlow'],
      tags: ['YSC', '학교 프로젝트'],
      period: '2022.04.01 - 2022.12.14',
      category: '로봇 개발',
      link: 'https://mosw.notion.site/',
      achievements: [
        'OpenCV 기반 물체 인식 시스템',
        'AI 경로 계획 알고리즘',
        '실제 환경 테스트 완료'
      ],
      files: [
        // { name: '배달로봇 보고서.pdf', url: '/assets/files/delivery_report.pdf' }
      ]
    },
    {
      title: '줄다리기 로봇 개발 프로젝트',
      description: '전국과학전람회 참가 프로젝트',
      fullDescription: `전국과학전람회에 참가한 줄다리기 로봇 개발 프로젝트입니다.
      로봇의 힘과 균형을 최적화하여 줄다리기 경기에서 우수한 성과를 거두었습니다.
      대통령상을 수상한 프로젝트로, 긱블에도 출연했습니다.`,
      technologies: ['로봇 설계', '힘 제어', '균형 시스템'],
      tags: ['전국과학전람회'],
      period: '2022.03.02 - 2022.09.15',
      category: '로봇 개발',
      link: 'https://mosw.notion.site/',
      achievements: [
        '전국과학전람회 참가',
        '대통령상 수상',
        '긱블 출연'
      ],
      files: [
        // { name: '줄다리기 보고서.pdf', url: '/assets/files/tugofwar_report.pdf' }
      ]
    },
    {
      title: '그네타기 로봇 개발 프로젝트',
      description: '전국과학전람회 참가 프로젝트',
      fullDescription: `그네를 타는 로봇을 개발한 프로젝트입니다.
      역학 원리를 활용하여 로봇이 그네를 효율적으로 탈 수 있도록 설계했습니다.
      전국과학전람회에 참가하여 우수한 성과를 거두었습니다.`,
      technologies: ['역학', '로봇 설계', '제어 시스템'],
      tags: ['전국과학전람회'],
      period: '2021.04.04 - 2021.10.02',
      category: '로봇 개발',
      link: 'https://mosw.notion.site/',
      achievements: [
        '전국과학전람회 참가',
        '역학 원리 적용',
        '효율적인 그네 타기 구현'
      ],
      files: [
        // { name: '그네타기 보고서.pdf', url: '/assets/files/swing_report.pdf' }
      ]
    },
    {
      title: '자동 중화 적정 기기 제작 프로젝트',
      description: '자동화된 화학 실험 장비 개발',
      fullDescription: `화학 실험의 중화 적정 과정을 자동화한 장비를 개발했습니다.
      정밀한 액체 제어와 센서를 활용하여 정확한 적정을 수행할 수 있도록 설계했습니다.
      연구개발(RnE) 프로젝트로 진행되었습니다.`,
      technologies: ['자동화', '액체 제어', '센서 시스템', '화학 실험'],
      tags: ['RnE'],
      period: '2020.07.01 - 2021.01.10',
      category: '로봇 개발',
      link: 'https://mosw.notion.site/',
      achievements: [
        '자동 중화 적정 시스템 구현',
        '정밀 액체 제어',
        '실험 정확도 향상'
      ],
      files: [
        // { name: '중화적정 보고서.pdf', url: '/assets/files/titration_report.pdf' }
      ]
    }
  ],
  videoProduction: [
    {
      title: '2024 충북과학고 졸업영상',
      description: '충북과학고등학교 2024 33기 졸업 영상 제작',
      fullDescription: `충북과학고등학교 33기 졸업을 기념하는 공식 졸업 영상을 제작했습니다.
      학생들의 추억과 성장 과정을 담아 감동적인 영상으로 완성했습니다.
      촬영, 편집, 후반 작업을 모두 담당했습니다.`,
      technologies: ['영상 편집', '촬영', '후반 작업', 'Premiere Pro', 'After Effects'],
      tags: ['학교 졸업영상 제작'],
      period: '2023.12.18 - 2023.12',
      category: '영상 제작',
      duration: '3:42',
      link: 'https://mosw.notion.site/',
      youtube: 'https://youtu.be/IOqnhKe1itQ?si=XGXTZe0Ehs-9pNYU', // YouTube URL 추가 필요
      achievements: [
        '공식 졸업영상 제작',
        '전체 제작 과정 담당',
        '감동적인 스토리텔링'
      ],
      files: [
        // { name: '졸업영상 제작 계획서.pdf', url: '/assets/files/graduation_plan.pdf' }
      ]
    },
    {
      title: '2023 충북과학고 축제 라이브',
      description: '2023 충북과학고등학교 사름제 라이브 방송',
      fullDescription: `충북과학고등학교의 주요 행사인 사름제를 라이브로 방송했습니다.
      실시간 스트리밍 기술을 활용하여 온라인으로도 행사를 즐길 수 있도록 했습니다.
      멀티 카메라 시스템과 실시간 편집을 통해 전문적인 방송을 구현했습니다.`,
      technologies: ['라이브 스트리밍', '멀티 카메라', '실시간 편집', 'OBS'],
      tags: ['행사 라이브'],
      period: '2023.12.14',
      category: '영상 제작',
      duration: '4:03:10',
      link: 'https://mosw.notion.site/',
      youtube: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', // YouTube URL 추가 필요
      achievements: [
        '실시간 라이브 방송',
        '멀티 카메라 시스템 구축',
        '온라인 시청자 대응'
      ],
      files: [
        // { name: '라이브 방송 계획서.pdf', url: '/assets/files/live_plan.pdf' }
      ]
    },
    {
      title: '2023 충북과학고 홍보영상',
      description: '충북과학고등학교 홍보영상 제작',
      fullDescription: `충북과학고등학교를 소개하는 홍보영상을 제작했습니다.
      학교의 교육 철학과 학생들의 활동을 효과적으로 보여주는 영상으로 완성했습니다.
      다양한 촬영 기법과 편집 기술을 활용했습니다.`,
      technologies: ['홍보 영상', '촬영', '편집', 'Premiere Pro'],
      tags: ['학교 홍보영상 제작'],
      period: '2023.06.10',
      category: '영상 제작',
      duration: '3:40',
      link: 'https://mosw.notion.site/',
      youtube: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', // YouTube URL 추가 필요
      achievements: [
        '홍보영상 제작',
        '효과적인 스토리텔링',
        '전문적인 영상 퀄리티'
      ],
      files: [
        // { name: '홍보영상 제작 계획서.pdf', url: '/assets/files/promo_plan.pdf' }
      ]
    }
  ]
};
