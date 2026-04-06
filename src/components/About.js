import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaRobot, FaCode, FaTools, FaGraduationCap } from 'react-icons/fa';
import skillsData from '../data/skills.json';
import profile from '../data/profile.json';
import './About.css';

const iconMap = {
  FaRobot: <FaRobot />,
  FaCode: <FaCode />,
  FaTools: <FaTools />,
  FaGraduationCap: <FaGraduationCap />
};

const About = () => {
  return (
    <section id="about" className="about-section">
      <Container>
        <Row>
          <Col lg={12}>
            <h2 className="section-title">About Me</h2>
            <p className="section-subtitle">
              로봇 공학자로서의 경험과 기술
            </p>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col lg={12} className="mb-4">
            <div className="about-content">
              <h3>로봇 공학 개발자</h3>
              <p>{profile.aboutBio1}</p>
              <p>{profile.aboutBio2}</p>
            </div>
          </Col>
        </Row>
        <Row>
          {skillsData.map((skill, index) => (
            <Col lg={6} md={6} key={index} className="mb-3">
              <Card className="card-custom skill-card">
                <Card.Body>
                  <div className="skill-icon">{iconMap[skill.icon] || <FaRobot />}</div>
                  <Card.Title className="mt-3 mb-3">{skill.title}</Card.Title>
                  <ul className="skill-list">
                    {skill.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default About;
