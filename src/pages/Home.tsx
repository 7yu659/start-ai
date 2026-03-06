import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, Zap, Shield, Mail, Calendar, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SEO from '../components/SEO';
import AdSlot from '../components/AdSlot';
import { AITool } from '../types';

export default function Home() {
  const { tools, adSettings, siteSettings } = useAppContext();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const renderToolGrid = (sectionTools: AITool[], title: string, subtitle: string, id: string) => {
    const [visibleCount, setVisibleCount] = useState(siteSettings.postsPerSection || 5);

    const handleLoadMore = () => {
      setVisibleCount(prev => prev + (siteSettings.postsPerSection || 5));
    };

    return (
      <section id={id} className="py-20 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
              <p className="text-slate-600 dark:text-slate-400">{subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectionTools.slice(0, visibleCount).map((tool, index) => (
              <motion.article 
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index % (siteSettings.postsPerSection || 5)) * 0.1 }}
                className="glass-card flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={tool.imageUrl} alt={tool.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-semibold rounded-full text-slate-900 dark:text-white shadow-sm">
                      {tool.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2">
                      <Link to={`/tool/${tool.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {tool.name}
                      </Link>
                    </h3>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow line-clamp-3">
                    {tool.tagline}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{tool.rating.overall}</span>
                    </div>
                    <Link to={`/tool/${tool.slug}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                      Read Now <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {visibleCount < sectionTools.length && (
            <div className="mt-12 text-center">
              <button onClick={handleLoadMore} className="btn-secondary">
                Load More
              </button>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Discover the Best AI Tools & Platforms" 
        description="Your ultimate guide to the best AI tools, software, and platforms. Read in-depth reviews, compare features, and find the perfect AI for your needs." 
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-5 dark:opacity-10 mix-blend-luminosity"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`flex flex-col ${siteSettings.headerImageUrl ? 'lg:flex-row lg:items-center lg:text-left text-center' : 'text-center'} gap-12`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={siteSettings.headerImageUrl ? 'lg:w-1/2' : 'w-full'}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 border border-blue-100 dark:border-blue-800/50">
                <Sparkles className="w-4 h-4" /> {siteSettings.headerTitle || 'The Future is Here'}
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-tight">
                {siteSettings.headerSubtitle ? (
                  <>
                    {siteSettings.headerSubtitle.split('AI Tools & Platforms')[0]}
                    {siteSettings.headerSubtitle.includes('AI Tools & Platforms') && <span className="text-gradient">AI Tools & Platforms</span>}
                    {siteSettings.headerSubtitle.split('AI Tools & Platforms')[1]}
                  </>
                ) : (
                  <>Discover the Best <br /><span className="text-gradient">AI Tools & Platforms</span></>
                )}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                {siteSettings.headerDescription || 'We test, review, and compare the latest AI software so you can find exactly what you need to boost your productivity and creativity.'}
              </p>
              <div className={`flex flex-col sm:flex-row items-center ${siteSettings.headerImageUrl ? 'justify-center lg:justify-start' : 'justify-center'} gap-4`}>
                <a href="#latest" className="btn-primary w-full sm:w-auto text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                  Explore Top Tools <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>

            {siteSettings.headerImageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:w-1/2"
              >
                <img src={siteSettings.headerImageUrl} alt="Header" className="rounded-2xl shadow-2xl w-full object-cover max-h-[500px]" referrerPolicy="no-referrer" />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Header Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot code={adSettings.headerAd} label="Sponsored" />
      </div>

      {/* Sections */}
      {renderToolGrid(tools.filter(t => t.homeSection === 'latest'), 'Latest Tools', 'In-depth analysis of the newest platforms.', 'latest')}
      {renderToolGrid(tools.filter(t => t.homeSection === 'popular'), 'Popular Tools', 'The most highly-rated tools by our community.', 'popular')}
      {renderToolGrid(tools.filter(t => t.homeSection === 'new'), 'New Posts', 'Freshly added tool guides and articles.', 'new')}

      {/* Features/Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-2xl text-center">
              <div className="w-14 h-14 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{siteSettings.preFooterTitle1 || 'Fast & Accurate'}</h3>
              <p className="text-slate-600 dark:text-slate-400">{siteSettings.preFooterDesc1 || 'We test tools rigorously to ensure they deliver on their promises of speed and accuracy.'}</p>
            </div>
            <div className="glass p-8 rounded-2xl text-center">
              <div className="w-14 h-14 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{siteSettings.preFooterTitle2 || 'Unbiased Analysis'}</h3>
              <p className="text-slate-600 dark:text-slate-400">{siteSettings.preFooterDesc2 || 'Our reviews are 100% independent. We highlight both the pros and the cons.'}</p>
            </div>
            <div className="glass p-8 rounded-2xl text-center">
              <div className="w-14 h-14 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{siteSettings.preFooterTitle3 || 'Top Rated Only'}</h3>
              <p className="text-slate-600 dark:text-slate-400">{siteSettings.preFooterDesc3 || 'We filter out the noise and only showcase the absolute best tools in the market.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Mail className="w-12 h-12 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{siteSettings.newsletterTitle}</h2>
          <p className="text-slate-300 text-lg mb-8">{siteSettings.newsletterDescription}</p>
          
          {subscribed ? (
            <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-6 py-4 rounded-xl max-w-lg mx-auto font-medium">
              {siteSettings.newsletterSuccessMsg}
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address" 
                className="flex-grow px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                {siteSettings.newsletterButtonText}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
