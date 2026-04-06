import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUniversity, FaBuilding, FaFlask, FaLink } from 'react-icons/fa';
import organizationsData from '../data/organizations.json';
import './Organizations.css';

const getIcon = (type) => {
  switch (type) {
    case 'university': return <FaUniversity />;
    case 'company': return <FaBuilding />;
    case 'research': return <FaFlask />;
    default: return <FaBuilding />;
  }
};

const Organizations = () => {
  return (
    <section id="organizations" className="organizations-section">
      <Container>
        <Row>
          <Col lg={12}>
            <h2 className="section-title">Career & Organizations</h2>
            <p className="section-subtitle">
              경력 및 소속 기관
            </p>
          </Col>
        </Row>
        <Row className="mt-4">
          {organizationsData.map((org, index) => (
            <Col lg={6} md={6} key={index} className="mb-4">
              <Card className="card-custom organization-card">
                {org.image ? (
                  <Card.Img
                    variant="top"
                    src={org.image}
                    className="organization-image"
                  />
                ) : (
                  <div className="organization-icon-wrapper">
                    <div className="organization-icon">
                      {getIcon(org.type)}
                    </div>
                  </div>
                )}
                <Card.Body>
                  <Card.Title>
                    {org.link ? (
                      <a
                        href={org.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="organization-link"
                      >
                        {org.name}
                        <FaLink className="ms-2 link-icon" />
                      </a>
                    ) : (
                      org.name
                    )}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {org.role} | {org.period}
                  </Card.Subtitle>
                  <Card.Text className="mb-3">{org.description}</Card.Text>
                  {org.achievements && org.achievements.length > 0 && (
                    <div>
                      <strong className="d-block mb-2">주요 성과:</strong>
                      <ul className="organization-achievements">
                        {org.achievements.map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Organizations;
