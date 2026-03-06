import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopOnMount from './components/ScrollToTopOnMount';

const Home = lazy(() => import('./pages/Home'));
const ToolReview = lazy(() => import('./pages/ToolReview'));
const Admin = lazy(() => import('./pages/Admin'));
const Category = lazy(() => import('./pages/Category'));
const StaticPage = lazy(() => import('./pages/StaticPage'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTopOnMount />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tool/:slug" element={<ToolReview />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/category/:name" element={<Category />} />
                <Route path="/privacy" element={<StaticPage />} />
                <Route path="/terms" element={<StaticPage />} />
                <Route path="/about" element={<StaticPage />} />
                <Route path="/contact" element={<StaticPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </Router>
    </AppProvider>
  );
}
