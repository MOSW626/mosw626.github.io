import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
          <Nav className="ms-auto">
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

