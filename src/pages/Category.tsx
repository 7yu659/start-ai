import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SEO from '../components/SEO';

export default function Category() {
  const { name } = useParams<{ name: string }>();
  const { tools, siteSettings } = useAppContext();
  const [visibleCount, setVisibleCount] = useState(siteSettings.postsPerSection || 5);

  const categoryTools = tools.filter(t => t.category === name);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + (siteSettings.postsPerSection || 5));
  };

  return (
    <div className="min-h-screen pt-12 pb-20">
      <SEO 
        title={`${name} AI Tools`} 
        description={`Explore the best AI tools and platforms in the ${name} category.`} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {name} <span className="text-gradient">AI Tools</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Discover and compare the top-rated AI solutions in this category.
          </p>
        </header>

        {categoryTools.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryTools.slice(0, visibleCount).map((tool, index) => (
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
            
            {visibleCount < categoryTools.length && (
              <div className="mt-12 text-center">
                <button onClick={handleLoadMore} className="btn-secondary">
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No tools found in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
