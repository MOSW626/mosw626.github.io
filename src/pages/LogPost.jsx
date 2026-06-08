import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLang, t } from '../i18n.js';
import { getPost } from '../lib/logPosts.js';
import './Pages.css';

export default function LogPost() {
  const { slug } = useParams();
  const { lang } = useLang();
  const post = getPost(slug);

  if (!post) {
    return (
      <section className="section page">
        <div className="container">
          <p className="log-empty">{t(lang, '글을 찾을 수 없습니다.', 'Post not found.')}</p>
          <Link className="post__back" to="/log">← {t(lang, '로그로', 'Back to Log')}</Link>
        </div>
      </section>
    );
  }

  const variant = post[lang] || post.ko || post.en;
  const isFallback = !post[lang];

  return (
    <section className="section page">
      <div className="container">
        <article className="post">
          <Link className="post__back" to="/log">← {t(lang, '로그로', 'Back to Log')}</Link>
          <div className="post__meta">
            <span>{post.date}</span>
            {post.tags.map((tag) => (
              <span key={tag} className="pill">{tag}</span>
            ))}
          </div>
          <h1 className="post__title">{variant.title}</h1>
          {isFallback && (
            <p className="post__fallback">
              {t(lang, '이 글은 아직 번역되지 않아 원문으로 표시됩니다.', 'This post is not translated yet; showing the original.')}
            </p>
          )}
          <div className="post__body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{variant.body}</ReactMarkdown>
          </div>
        </article>
      </div>
    </section>
  );
}
