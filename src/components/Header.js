import React, { useState, useEffect, useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { LanguageContext } from '../App';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { lang, setLang } = useContext(LanguageContext);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // 페이지 변경 시 스크롤을 맨 위로
    window.scrollTo(0, 0);
  }, [location]);

  const toggleLang = () => {
    setLang(lang === 'ko' ? 'en' : 'ko');
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={scrolled ? 'navbar-scrolled' : 'navbar-transparent'}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <span className="brand-text">안연수</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" active={location.pathname === '/about'}>
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/projects" active={location.pathname === '/projects'}>
              Projects
            </Nav.Link>
            <Nav.Link as={Link} to="/organizations" active={location.pathname === '/organizations'}>
              Organizations
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" active={location.pathname === '/contact'}>
              Contact
            </Nav.Link>
            <button className="lang-toggle-btn" onClick={toggleLang} aria-label="언어 전환">
              <span className={lang === 'ko' ? 'lang-active' : ''}>KO</span>
              <span className="lang-divider">/</span>
              <span className={lang === 'en' ? 'lang-active' : ''}>EN</span>
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
