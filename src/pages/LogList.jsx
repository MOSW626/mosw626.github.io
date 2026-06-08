import { Link } from 'react-router-dom';
import { useLang, t } from '../i18n.js';
import { LOG_POSTS } from '../lib/logPosts.js';
import './Pages.css';

export default function LogList() {
  const { lang } = useLang();
  return (
    <section className="section page">
      <div className="container">
        <h1 className="section__title">{t(lang, '로그', 'Log')}</h1>
        {LOG_POSTS.length === 0 ? (
          <p className="log-empty">{t(lang, '아직 글이 없습니다.', 'No posts yet.')}</p>
        ) : (
          <div className="log-list">
            {LOG_POSTS.map((post) => {
              const v = post[lang] || post.ko || post.en;
              return (
                <Link key={post.slug} to={`/log/${post.slug}`} className="log-card">
                  <div className="log-card__meta">
                    <span>{post.date}</span>
                    {post.ko && <span className="lang-badge">KO</span>}
                    {post.en && <span className="lang-badge">EN</span>}
                  </div>
                  <h2>{v.title}</h2>
                  <p className="log-card__summary">{v.summary}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
