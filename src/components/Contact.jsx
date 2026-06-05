import { FaEnvelope, FaGithub, FaStickyNote, FaBlog } from 'react-icons/fa';
import { useLang, t } from '../i18n.js';
import profile from '../data/profile.json';
import './Contact.css';

export default function Contact() {
  const { lang } = useLang();
  const items = [
    { icon: FaEnvelope, label: profile.email, url: `mailto:${profile.email}` },
    { icon: FaGithub, label: 'GitHub', url: profile.socialLinks.github },
    { icon: FaStickyNote, label: 'Notion', url: profile.socialLinks.notion },
    { icon: FaBlog, label: 'Blog', url: profile.socialLinks.blog },
  ].filter((i) => i.url);

  return (
    <section id="contact" className="section section--alt">
      <div className="container contact reveal">
        <h2 className="section__title">{t(lang, '연락처', 'Contact')}</h2>
        <p className="contact__lead">
          {t(lang, '협업이나 문의는 아래로 연락 주세요.', 'Reach out for collaboration or questions.')}
        </p>
        <div className="contact__links">
          {items.map(({ icon: Icon, label, url }) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="contact__link">
              <Icon /> {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
