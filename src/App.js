import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import OrganizationsPage from './pages/OrganizationsPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

export const LanguageContext = React.createContext('ko');

function App() {
  const [lang, setLang] = useState('ko');

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <BrowserRouter basename={process.env.PUBLIC_URL || ''}>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/*" element={
            <div className="App">
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/organizations" element={<OrganizationsPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
              <Footer />
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </LanguageContext.Provider>
  );
}

export default App;
