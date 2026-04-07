import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaRobot } from 'react-icons/fa';
import {
  SiPython, SiCplusplus, SiJavascript,
  SiOpencv, SiTensorflow, SiPytorch,
  SiGit, SiLinux, SiArduino
} from 'react-icons/si';
import skillsData from '../data/skills.json';
import profile from '../data/profile.json';
import { LanguageContext } from '../App';
import './About.css';

const ICON_MAP = {
  SiPython: <SiPython />,
  SiCplusplus: <SiCplusplus />,
  SiJavascript: <SiJavascript />,
  SiOpencv: <SiOpencv />,
  SiTensorflow: <SiTensorflow />,
  SiPytorch: <SiPytorch />,
  SiGit: <SiGit />,
  SiLinux: <SiLinux />,
  SiArduino: <SiArduino />,
  FaRobot: <FaRobot />,
};

const About = () => {
  const { lang } = useContext(LanguageContext);

  const subtitle = lang === 'en'
    ? 'Experience and skills as a robotics engineer'
    : '로봇 공학자로서의 경험과 기술';

  const heading = lang === 'en' ? 'Robotics Engineer' : '로봇 공학 개발자';

  const bio1 = lang === 'en' && profile.aboutBio1En
    ? profile.aboutBio1En
    : profile.aboutBio1;

  const bio2 = lang === 'en' && profile.aboutBio2En
    ? profile.aboutBio2En
    : profile.aboutBio2;

  return (
    <section id="about" className="about-section">
      <Container>
        <Row>
          <Col lg={12}>
            <h2 className="section-title">About Me</h2>
            <p className="section-subtitle">{subtitle}</p>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col lg={12} className="mb-5">
            <div className="about-content">
              <h3>{heading}</h3>
              <p>{bio1}</p>
              <p>{bio2}</p>
            </div>
          </Col>
        </Row>
        <Row>
          {skillsData.map((category, ci) => (
            <Col lg={6} md={6} key={ci} className="mb-4">
              <div className="skill-category-card">
                <h5 className="skill-category-title">{category.category}</h5>
                <div className="skill-icon-grid">
                  {category.items.map((item, ii) => (
                    <div key={ii} className="skill-icon-item">
                      <span className="skill-icon-svg">
                        {ICON_MAP[item.icon] || <FaRobot />}
                      </span>
                      <span className="skill-icon-label">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default About;
