import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Loader } from 'lucide-react';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import HomePage from './pages/HomePage';

// Lazy load pages to improve initial load time
const MathGamePage = lazy(() => import('./pages/MathGamePage'));
const CountingGamePage = lazy(() => import('./pages/CountingGamePage'));
const ShapesGamePage = lazy(() => import('./pages/ShapesGamePage'));
const ParentDashboardPage = lazy(() => import('./pages/ParentDashboardPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <Loader className="w-16 h-16 text-primary-500 animate-spin" />
    <p className="mt-4 text-xl font-display text-primary-700">Loading adventure...</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/math-game/:level?" element={<MathGamePage />} />
              <Route path="/counting-game/:level?" element={<CountingGamePage />} />
              <Route path="/shapes-game/:level?" element={<ShapesGamePage />} />
              <Route path="/parent-dashboard" element={<ParentDashboardPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;