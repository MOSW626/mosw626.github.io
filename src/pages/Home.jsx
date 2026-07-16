import Hero from '../components/Hero.jsx';
import About from '../components/About.jsx';
import FeaturedWorks from '../components/FeaturedWorks.jsx';
import Contact from '../components/Contact.jsx';
import { usePageMeta } from '../lib/meta.js';

export default function Home() {
  usePageMeta({});
  return (
    <>
      <Hero />
      <About />
      <FeaturedWorks />
      <Contact />
    </>
  );
}
