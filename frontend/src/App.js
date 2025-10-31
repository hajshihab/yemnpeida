import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AIAssistantPage from './pages/AIAssistantPage';
import ArticlePage from './pages/ArticlePage';
import ArticlePageEnhanced from './pages/ArticlePageEnhanced';
import CreateArticlePage from './pages/CreateArticlePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import PortalPage from './pages/PortalPage';
import SourcesPage from './pages/SourcesPage';
import CategoriesPage from './pages/CategoriesPage';
import ProfilePage from './pages/ProfilePage';
import FeaturedPage from './pages/FeaturedPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import StatsPage from './pages/StatsPage';
import MyArticlesPage from './pages/MyArticlesPage';
import ArticleHistoryPage from './pages/ArticleHistoryPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import EditArticlePage from './pages/EditArticlePage';
import SuperAdminPanel from './pages/SuperAdminPanel';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/article/:slug" element={<ArticlePageEnhanced />} />
            <Route path="/article/history/:id" element={<ArticleHistoryPage />} />
            <Route path="/portal/:slug" element={<PortalPage />} />
            <Route path="/sources" element={<SourcesPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/featured" element={<FeaturedPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-articles" element={<MyArticlesPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/super-admin" element={<SuperAdminPanel />} />
            <Route path="/create" element={<CreateArticlePage />} />
            <Route path="/edit/:id" element={<EditArticlePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
