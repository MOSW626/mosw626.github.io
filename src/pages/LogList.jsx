import { Link } from 'react-router-dom';
import { useLang, t } from '../i18n.js';
import { LOG_POSTS } from '../lib/logPosts.js';
import { usePageMeta } from '../lib/meta.js';
import './Pages.css';

export default function LogList() {
  const { lang } = useLang();
  usePageMeta({
    title: t(lang, '기록', 'Notes'),
    description: t(
      lang,
      '개발 과정과 생각을 기록한 안연수의 노트.',
      "Yeonsu An's notes on the development process and ideas along the way."
    ),
  });
  return (
    <section className="section page">
      <div className="container">
        <h1 className="section__title">{t(lang, '기록', 'Notes')}</h1>
        {LOG_POSTS.length === 0 ? (
          <p className="log-empty">{t(lang, '아직 글이 없습니다.', 'No posts yet.')}</p>
        ) : (
          <div className="log-list">
            {LOG_POSTS.map((post) => {
              const v = post[lang] || post.ko || post.en;
              return (
                <Link key={post.slug} to={`/notes/${post.slug}`} className="log-card">
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
