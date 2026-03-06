import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Star, CheckCircle2, XCircle, ExternalLink, PlayCircle, Calendar, ChevronRight } from 'lucide-react';
import Markdown from 'react-markdown';
import { useAppContext } from '../context/AppContext';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';
import CommentSection from '../components/CommentSection';

const RatingBar = ({ label, score }: { label: string, score: number }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm font-medium mb-1">
      <span className="text-slate-700 dark:text-slate-300">{label}</span>
      <span className="text-slate-900 dark:text-white">{score}/5.0</span>
    </div>
    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(score / 5) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
      />
    </div>
  </div>
);

export default function ToolReview() {
  const { slug } = useParams<{ slug: string }>();
  const { tools, adSettings } = useAppContext();
  
  const tool = tools.find(t => t.slug === slug);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
          <Link to="/" className="text-blue-600 hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const relatedTools = tools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 8);

  return (
    <article className="min-h-screen pb-20">
      <SEO 
        title={`${tool.name} Review & Pricing`} 
        description={tool.description}
        type="article"
      />

      {/* Hero Header */}
      <header className="relative pt-20 pb-32 bg-slate-900 dark:bg-slate-950 overflow-hidden">
        <div className="absolute inset-0">
          <img src={tool.imageUrl} alt="" className="w-full h-full object-cover opacity-20 blur-sm" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center text-slate-300 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to all reviews
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <img src={tool.imageUrl} alt={tool.name} className="w-32 h-32 rounded-2xl object-cover shadow-2xl border-4 border-white/10" referrerPolicy="no-referrer" />
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30">
                  {tool.category}
                </span>
                <span className="flex items-center text-amber-400 font-bold">
                  <Star className="w-5 h-5 fill-amber-400 mr-1" /> {tool.rating.overall}
                </span>
                <span className="flex items-center text-slate-300 text-sm font-medium">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(tool.dateAdded).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{tool.name} Review</h1>
              <p className="text-xl text-slate-300 max-w-2xl">{tool.tagline}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="glass-card p-6 md:p-8 mb-12 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Starting Price</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{tool.pricing}</p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1 sm:flex-none">
              Visit Website <ExternalLink className="w-4 h-4" />
            </a>
            <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 sm:flex-none">
              Try {tool.name}
            </a>
          </div>
        </div>

        <AdSlot code={adSettings.afterFirstParagraph} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Overview</h2>
              
              {(tool.ctaPosition === 'top' || tool.ctaPosition === 'both') && tool.ctaLink && (
                <div className="mb-8">
                  <a href={tool.ctaLink} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
                    {tool.ctaText || 'Try Now'}
                  </a>
                </div>
              )}

              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
                {tool.description}
              </p>
              
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                <Markdown>{tool.content}</Markdown>
              </div>

              {(tool.ctaPosition === 'bottom' || tool.ctaPosition === 'both') && tool.ctaLink && (
                <div className="mt-8">
                  <a href={tool.ctaLink} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
                    {tool.ctaText || 'Try Now'}
                  </a>
                </div>
              )}
            </section>

            <AdSlot code={adSettings.middleArticle} />

            {/* Pros & Cons */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Pros
                </h3>
                <ul className="space-y-3">
                  {tool.pros.map((pro, i) => (
                    <li key={i} className="flex items-start text-emerald-700 dark:text-emerald-300">
                      <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-rose-800 dark:text-rose-400 mb-4 flex items-center">
                  <XCircle className="w-5 h-5 mr-2" /> Cons
                </h3>
                <ul className="space-y-3">
                  {tool.cons.map((con, i) => (
                    <li key={i} className="flex items-start text-rose-700 dark:text-rose-300">
                      <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <AdSlot code={adSettings.beforeConclusion} />

            {/* Verdict */}
            <section className="glass p-8 rounded-2xl border-l-4 border-l-blue-500">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Final Verdict</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                {tool.name} is a powerhouse in the {tool.category.toLowerCase()} space. With its impressive feature set and strong performance, it earns our high recommendation.
              </p>
              <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
                Start Using {tool.name} Today
              </a>
            </section>

            <CommentSection toolId={tool.id} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Rating Breakdown */}
            <div className="glass-card p-6">
              <div className="text-center mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">{tool.rating.overall}</div>
                <div className="flex justify-center gap-1 mb-2">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className={`w-5 h-5 ${star <= Math.round(tool.rating.overall) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                  ))}
                </div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Excellent</div>
              </div>
              
              <RatingBar label="Ease of Use" score={tool.rating.easeOfUse} />
              <RatingBar label="Features" score={tool.rating.features} />
              <RatingBar label="Value for Money" score={tool.rating.valueForMoney} />
              <RatingBar label="Performance" score={tool.rating.performance} />
            </div>

            {/* Key Features */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Key Features</h3>
              <ul className="space-y-3">
                {tool.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <AdSlot code={adSettings.sidebarAd} />

            {/* Sticky Related Blogs (Sidebar) */}
            {relatedTools.length > 0 && (
              <div className="sticky top-24 glass-card p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Related Tools</h3>
                <div className="space-y-4">
                  {relatedTools.slice(0, 6).map((rt) => (
                    <Link key={rt.id} to={`/tool/${rt.slug}`} className="block group">
                      <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {rt.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {rt.tagline}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Bottom Related Blogs */}
        {relatedTools.length > 0 && (
          <div className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">More from {tool.category}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedTools.map((rt) => (
                <Link key={rt.id} to={`/tool/${rt.slug}`} className="glass-card p-4 hover:-translate-y-1 transition-transform">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1 line-clamp-1">{rt.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{rt.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
