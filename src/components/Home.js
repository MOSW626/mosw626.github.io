import React, { useEffect, useRef, useState, useContext } from 'react';
import { Container, Row, Col, Button, Toast, ToastContainer } from 'react-bootstrap';
import { FaRobot, FaGithub, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import Typed from 'typed.js';
import profile from '../data/profile.json';
import { LanguageContext } from '../App';
import './Home.css';

const Home = () => {
  const typedRef = useRef(null);
  const typedInstance = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const { lang } = useContext(LanguageContext);

  useEffect(() => {
    const strings = lang === 'en' && profile.typingStringsEn
      ? profile.typingStringsEn
      : profile.typingStrings;

    const options = {
      strings,
      typeSpeed: 50,
      backSpeed: 50,
      loop: true
    };

    // destroy previous instance before creating a new one
    if (typedInstance.current) {
      typedInstance.current.destroy();
    }

    typedInstance.current = new Typed(typedRef.current, options);

    return () => {
      if (typedInstance.current) {
        typedInstance.current.destroy();
      }
    };
  }, [lang]);

  const handleDownload = () => {
    if (profile.cvUrl) {
      window.open(profile.cvUrl, '_blank', 'noopener,noreferrer');
    } else {
      setShowToast(true);
    }
  };

  const heroDesc = lang === 'en' && profile.heroDescriptionEn
    ? profile.heroDescriptionEn
    : profile.heroDescription;

  const greeting = lang === 'en'
    ? <>Hello, I'm <span className="highlight">{profile.nameEn || profile.name}</span></>
    : <>안녕하세요, <span className="highlight">{profile.name}</span>입니다</>;

  const cvLabel = lang === 'en' ? 'Download CV' : 'CV 다운로드';
  const portfolioLabel = lang === 'en' ? 'Portfolio' : '포트폴리오 보기';
  const toastMsg = lang === 'en' ? 'CV will be uploaded soon!' : 'CV는 곧 업로드될 예정입니다!';

  return (
    <section id="home" className="home-section">
      <ToastContainer position="bottom-end" className="p-4" style={{ zIndex: 9999 }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="dark">
          <Toast.Body className="text-white">
            📄 {toastMsg}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="home-content">
            <div className="home-text fade-in-up">
              <h1 className="home-title">
                {greeting}
              </h1>
              <h2 className="home-subtitle">
                <span ref={typedRef}></span>
              </h2>
              <p
                className="home-description"
                dangerouslySetInnerHTML={{ __html: heroDesc }}
              />
              {profile.achievements && profile.achievements.length > 0 && (
                <div className="achievement-badges">
                  {profile.achievements.map((ach, i) => (
                    <span key={i} className="achievement-badge">
                      <span className="achievement-emoji">{ach.emoji}</span>
                      {ach.label}
                    </span>
                  ))}
                </div>
              )}
              <div className="home-buttons">
                <Button
                  className="btn-custom btn-primary-custom me-3 mb-3"
                  onClick={handleDownload}
                >
                  <HiOutlineDocumentText className="me-2" />
                  {cvLabel}
                </Button>
                <Button
                  className="btn-custom btn-secondary-custom mb-3"
                  as="a"
                  href={profile.socialLinks.notion}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaExternalLinkAlt className="me-2" />
                  {portfolioLabel}
                </Button>
              </div>
              <div className="home-social">
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <FaGithub />
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="social-icon"
                >
                  <FaEnvelope />
                </a>
              </div>
            </div>
          </Col>
          <Col lg={6} className="home-image">
            <div className="profile-visual">
              {!photoError ? (
                <img
                  src="/assets/profile.jpg"
                  alt={profile.name}
                  className="profile-photo"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <div className="robot-animation">
                  <FaRobot className="robot-icon" />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Home;
