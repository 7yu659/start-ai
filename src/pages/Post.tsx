import { useParams, Link } from 'react-router-dom';
import { posts } from '../data/posts';
import SEO from '../components/SEO';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import Markdown from 'react-markdown';

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">The article you are looking for does not exist.</p>
        <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <SEO 
        title={post.title} 
        description={post.excerpt} 
        type="article"
      />
      
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 sm:mb-12">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to all posts
      </Link>

      <header className="mb-10 sm:mb-14">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {post.readTime}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {post.author}
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        <div className="flex gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="prose prose-lg prose-indigo max-w-none font-serif text-gray-800 leading-relaxed">
        <Markdown>{post.content}</Markdown>
      </div>
    </article>
  );
}
