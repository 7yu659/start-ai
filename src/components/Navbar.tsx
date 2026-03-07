import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Search, Menu, Sparkles, ChevronDown, X, LayoutDashboard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  const { isDarkMode, toggleDarkMode, tools, siteSettings, isAdmin } = useAppContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const categories = siteSettings.categories || Array.from(new Set(tools.map(t => t.category)));

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : tools.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSearchSelect = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/tool/${slug}`);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 glass border-b-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Fixed for Mobile */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                {siteSettings.logoText.split(' ')[0]} <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 animate-gradient-spin">{siteSettings.logoText.split(' ').slice(1).join(' ')}</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
              
              {/* Categories Dropdown */}
              <div className="relative group py-8">
                <button className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                  Categories <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-6">
                  <div className="grid grid-cols-3 gap-8">
                    {(siteSettings.categoryGroups || []).map((group, idx) => (
                      <div key={idx}>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
                          {group.name}
                        </h3>
                        <ul className="space-y-2">
                          {group.categories.map(c => (
                            <li key={c}>
                              <Link to={`/category/${c}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block py-1">
                                {c}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Link to="/privacy" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link>
              <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
              
              {isAdmin && (
                <Link to="/admin" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800/50">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              )}
              
              <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-700">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-slate-500 dark:text-slate-400">
                <Search className="w-5 h-5" />
              </button>
              <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-500 dark:text-slate-400">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-4 space-y-4 shadow-lg max-h-[80vh] overflow-y-auto">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-slate-900 dark:text-white">Home</Link>
            <div className="space-y-4">
              {(siteSettings.categoryGroups || []).map((group, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{group.name}</p>
                  {group.categories.map(c => (
                    <Link key={c} to={`/category/${c}`} onClick={() => setIsMobileMenuOpen(false)} className="block pl-4 text-base text-slate-600 dark:text-slate-300">
                      {c}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <Link to="/privacy" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-slate-900 dark:text-white">Privacy Policy</Link>
            <Link to="/terms" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-slate-900 dark:text-white">Terms of Service</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-slate-900 dark:text-white">About</Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-bold text-blue-600 dark:text-blue-400">Dashboard</Link>
            )}
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-6 h-6 text-slate-400" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search AI tools, categories..." 
                className="flex-grow bg-transparent border-none focus:outline-none text-lg text-slate-900 dark:text-white placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => setIsSearchOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            {searchQuery && (
              <div className="max-h-96 overflow-y-auto p-2">
                {searchResults.length > 0 ? (
                  searchResults.map(tool => (
                    <button 
                      key={tool.id}
                      onClick={() => handleSearchSelect(tool.slug)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex items-center gap-4 transition-colors"
                    >
                      <img src={tool.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{tool.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{tool.category}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
