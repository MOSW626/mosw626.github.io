import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGithub, FaEnvelope, FaBlog, FaHeart } from 'react-icons/fa';
import { SiNotion } from 'react-icons/si';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="footer-content">
              <div className="footer-social">
                <a
                  href="https://github.com/MOSW626"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
                <a
                  href="mailto:ays6533@naver.com"
                  className="footer-social-icon"
                  aria-label="Email"
                >
                  <FaEnvelope />
                </a>
                <a
                  href="https://mosw.notion.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="Notion"
                >
                  <SiNotion />
                </a>
                <a
                  href="https://mosw.tistory.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="Blog"
                >
                  <FaBlog />
                </a>
              </div>
              <div className="footer-text">
                <p>
                  Made with <FaHeart className="heart-icon" /> by 안연수 / Yeonsu An
                </p>
                <p className="footer-copyright">
                  © {currentYear} 안연수 / Yeonsu An. All rights reserved.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

