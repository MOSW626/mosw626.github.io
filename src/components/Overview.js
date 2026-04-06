import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaRobot, FaGithub, FaVideo, FaArrowRight } from 'react-icons/fa';
import { fetchGitHubRepos } from '../utils/githubApi';
import { notionProjects } from '../data/notionProjects';
import profile from '../data/profile.json';
import './Overview.css';

const Overview = () => {
  const [githubRepos, setGithubRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGitHubRepos = async () => {
      setLoading(true);
      const repos = await fetchGitHubRepos(profile.githubUsername);
      setGithubRepos(repos.slice(0, 3)); // 최신 3개만
      setLoading(false);
    };
    loadGitHubRepos();
  }, []);

  // 최신 프로젝트 3개만 표시
  const recentRobotProjects = notionProjects.robotDevelopment.slice(0, 3);
  const recentVideoProjects = notionProjects.videoProduction.slice(0, 2);

  return (
    <section id="overview" className="overview-section">
      <Container>
        <Row>
          <Col lg={12}>
            <h2 className="section-title">Overview</h2>
            <p className="section-subtitle">
              자기소개 및 주요 프로젝트
            </p>
          </Col>
        </Row>

        {/* 자기소개 섹션 */}
        <Row className="mt-4 mb-5">
          <Col lg={12}>
            <Card className="overview-about-card">
              <Card.Body className="p-4">
                <Row>
                  <Col lg={8}>
                    <h3 className="mb-3">안녕하세요, {profile.name}입니다</h3>
                    <p className="mb-3">{profile.overviewBio1}</p>
                    <p className="mb-0">{profile.overviewBio2}</p>
                  </Col>
                  <Col lg={4} className="text-center">
                    <div className="overview-stats">
                      <div className="stat-item">
                        <div className="stat-number">{notionProjects.robotDevelopment.length}</div>
                        <div className="stat-label">로봇 프로젝트</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">{notionProjects.videoProduction.length}</div>
                        <div className="stat-label">영상 제작</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">{loading ? '...' : githubRepos.length}</div>
                        <div className="stat-label">GitHub 저장소</div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          {/* 로봇 개발 프로젝트 요약 */}
          <Col lg={4} md={6} className="mb-4">
            <Card className="overview-card">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaRobot className="overview-icon me-2" />
                  <Card.Title className="h5 mb-0">로봇 개발</Card.Title>
                </div>
                <div className="overview-projects">
                  {recentRobotProjects.map((project, index) => (
                    <div key={index} className="overview-project-item">
                      <div className="fw-bold small">{project.title}</div>
                      <div className="text-muted small">{project.period}</div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="mt-3 w-100"
                  as={Link}
                  to="/projects"
                >
                  전체 보기 <FaArrowRight className="ms-1" />
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* 영상 제작 프로젝트 요약 */}
          <Col lg={4} md={6} className="mb-4">
            <Card className="overview-card">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaVideo className="overview-icon me-2" />
                  <Card.Title className="h5 mb-0">영상 제작</Card.Title>
                </div>
                <div className="overview-projects">
                  {recentVideoProjects.map((project, index) => (
                    <div key={index} className="overview-project-item">
                      <div className="fw-bold small">{project.title}</div>
                      <div className="text-muted small">{project.period}</div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="mt-3 w-100"
                  as={Link}
                  to="/projects"
                >
                  전체 보기 <FaArrowRight className="ms-1" />
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* GitHub 프로젝트 요약 */}
          <Col lg={4} md={6} className="mb-4">
            <Card className="overview-card">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaGithub className="overview-icon me-2" />
                  <Card.Title className="h5 mb-0">GitHub</Card.Title>
                </div>
                {loading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="overview-projects">
                      {githubRepos.map((repo) => (
                        <div key={repo.id} className="overview-project-item">
                          <div className="fw-bold small">{repo.title}</div>
                          <div className="text-muted small">
                            {repo.language || '기타'} • ⭐ {repo.stars}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="mt-3 w-100"
                      as={Link}
                      to="/projects"
                    >
                      전체 보기 <FaArrowRight className="ms-1" />
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Overview;

