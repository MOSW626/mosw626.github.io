import { useParams } from 'react-router-dom';
export default function LogPost() {
  const { slug } = useParams();
  return <div className="container">Post: {slug}</div>;
}
