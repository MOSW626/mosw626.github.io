import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { FaEnvelope, FaGithub, FaBlog } from 'react-icons/fa';
import { SiNotion } from 'react-icons/si';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // mailto 링크를 사용하여 이메일 클라이언트 열기
    const subject = encodeURIComponent(`포트폴리오 문의: ${formData.name}`);
    const body = encodeURIComponent(`이름: ${formData.name}\n이메일: ${formData.email}\n\n메시지:\n${formData.message}`);
    const mailtoLink = `mailto:ays6533@naver.com?subject=${subject}&body=${body}`;

    // mailto 링크 열기
    try {
      window.location.href = mailtoLink;
      // 사용자에게 알림
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setFormData({ name: '', email: '', message: '' });
      }, 5000);
    } catch (error) {
      // mailto가 작동하지 않는 경우 대체 방법
      alert('이메일 앱을 열 수 없습니다. 직접 이메일을 보내주세요: ays6533@naver.com');
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      label: 'Email',
      value: 'ays6533@naver.com',
      link: 'mailto:ays6533@naver.com'
    },
    {
      icon: <FaGithub />,
      label: 'GitHub',
      value: 'MOSW626',
      link: 'https://github.com/MOSW626'
    },
    {
      icon: <SiNotion />,
      label: 'Notion',
      value: '포트폴리오',
      link: 'https://mosw.notion.site/'
    },
    {
      icon: <FaBlog />,
      label: 'Blog',
      value: 'Tistory',
      link: 'https://mosw.tistory.com/'
    }
  ];

  return (
    <section id="contact" className="contact-section">
      <Container>
        <Row>
          <Col lg={12}>
            <h2 className="section-title">Contact</h2>
            <p className="section-subtitle">
              연락 주시면 빠르게 답변드리겠습니다
            </p>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col lg={6} className="mb-4">
            <div className="contact-info">
              <h3>연락처 정보</h3>
              <div className="contact-list">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    target={info.link.startsWith('http') ? '_blank' : '_self'}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                    className="contact-item"
                  >
                    <div className="contact-icon">{info.icon}</div>
                    <div className="contact-details">
                      <div className="contact-label">{info.label}</div>
                      <div className="contact-value">{info.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <Card className="card-custom contact-form-card">
              <Card.Body>
                <h3 className="mb-4">메시지 보내기</h3>
                {showAlert && (
                  <Alert variant="success" className="mb-3">
                    이메일 앱이 열렸습니다. 메시지를 확인하고 전송 버튼을 눌러주세요.
                  </Alert>
                )}
                <Alert variant="info" className="mb-3">
                  <small>
                    <strong>📧 이메일 앱 열기:</strong> 전송하기 버튼을 클릭하면 기본 이메일 앱(메일, Outlook 등)이 열립니다.
                    앱에서 메시지를 확인한 후 전송 버튼을 눌러주세요.
                  </small>
                </Alert>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="이름을 입력하세요"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>이메일</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="이메일을 입력하세요"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>메시지</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="메시지를 입력하세요"
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    className="btn-custom btn-primary-custom w-100"
                  >
                    <FaEnvelope className="me-2" />
                    전송하기
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contact;

