import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import { useAppContext } from '../context/AppContext';
import Markdown from 'react-markdown';
import { FileText, Shield, Info, Mail } from 'lucide-react';

export default function StaticPage() {
  const location = useLocation();
  const page = location.pathname.substring(1); // remove leading slash
  const { siteSettings } = useAppContext();

  const getPageContent = () => {
    switch (page) {
      case 'privacy':
        return { title: 'Privacy Policy', icon: Shield, content: siteSettings.privacyPolicy };
      case 'terms':
        return { title: 'Terms of Service', icon: FileText, content: siteSettings.termsOfService };
      case 'about':
        return { title: 'About Us', icon: Info, content: siteSettings.aboutUs };
      case 'contact':
        return { title: 'Contact Us', icon: Mail, content: siteSettings.contactUs };
      default:
        return { title: 'Page Not Found', icon: FileText, content: 'The requested page could not be found.' };
    }
  };

  const { title, icon: Icon, content } = getPageContent();

  return (
    <div className="min-h-screen py-20 bg-slate-50 dark:bg-[#0F172A]">
      <SEO title={title} description={`Read our ${title}`} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/50 dark:border-white/10">
            <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            {title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-800/50"
        >
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 prose-img:rounded-xl prose-img:shadow-md">
            <Markdown>{content}</Markdown>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
