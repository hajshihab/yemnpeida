import React, { useEffect, useState } from 'react';
import { articlesAPI, categoriesAPI } from '../services/api';
import axios from 'axios';
import { FiBook, FiUsers, FiEye, FiTrendingUp, FiAward, FiActivity } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StatsPage = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalEditors: 0,
    totalCategories: 0,
    featuredArticles: 0
  });
  const [topArticles, setTopArticles] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [articlesRes, categoriesRes] = await Promise.all([
        articlesAPI.getAll({ limit: 1000, status: 'published' }),
        categoriesAPI.getAll()
      ]);

      const articles = articlesRes.data.articles || [];
      const categories = categoriesRes.data.categories || [];

      // Calculate total views
      const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);

      // Count featured
      const featuredCount = articles.filter(a => a.featured).length;

      // Get unique editors
      const editors = new Set(articles.map(a => a.author?._id).filter(Boolean));

      // Top articles by views
      const top = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);

      // Top categories by article count
      const categoriesWithCount = categories.map(cat => {
        const count = articles.filter(a => a.categories?.some(c => c._id === cat._id)).length;
        const views = articles
          .filter(a => a.categories?.some(c => c._id === cat._id))
          .reduce((sum, a) => sum + (a.views || 0), 0);
        return { ...cat, articleCount: count, totalViews: views };
      }).sort((a, b) => b.articleCount - a.articleCount);

      // Recent activity (latest articles)
      const recent = [...articles].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 10);

      setStats({
        totalArticles: articles.length,
        totalViews,
        totalEditors: editors.size,
        totalCategories: categories.length,
        featuredArticles: featuredCount
      });

      setTopArticles(top);
      setTopCategories(categoriesWithCount.slice(0, 5));
      setRecentActivity(recent);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 space-x-reverse mb-4">
            <FiActivity size={48} />
            <h1 className="text-4xl font-bold">إحصائيات يمن بيديا</h1>
          </div>
          <p className="text-xl text-center opacity-90">
            أرقام وبيانات عن نمو الموسوعة والمساهمات
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={<FiBook className="text-blue-600" size={32} />}
            value={stats.totalArticles}
            label="مقالة"
            color="blue"
          />
          <StatCard
            icon={<FiEye className="text-green-600" size={32} />}
            value={stats.totalViews.toLocaleString()}
            label="مشاهدة"
            color="green"
          />
          <StatCard
            icon={<FiUsers className="text-purple-600" size={32} />}
            value={stats.totalEditors}
            label="محرر"
            color="purple"
          />
          <StatCard
            icon={<FiAward className="text-yellow-600" size={32} />}
            value={stats.featuredArticles}
            label="مقالة مميزة"
            color="yellow"
          />
          <StatCard
            icon={<FiTrendingUp className="text-red-600" size={32} />}
            value={stats.totalCategories}
            label="تصنيف"
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Articles */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 space-x-reverse">
              <FiTrendingUp className="text-primary-600" />
              <span>الأكثر قراءة</span>
            </h2>
            <div className="space-y-3">
              {topArticles.map((article, index) => (
                <Link
                  key={article._id}
                  to={`/article/${article.slug}`}
                  className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{article.title}</h3>
                    <p className="text-sm text-gray-600">{article.views?.toLocaleString()} مشاهدة</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 space-x-reverse">
              <FiAward className="text-primary-600" />
              <span>التصنيفات الأكثر نشاطاً</span>
            </h2>
            <div className="space-y-4">
              {topCategories.map((category) => (
                <Link
                  key={category._id}
                  to={`/portal/${category.slug}`}
                  className="block p-4 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-semibold">{category.nameAr}</span>
                    </div>
                    <span className="text-sm text-gray-600">{category.articleCount} مقالة</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(category.articleCount / stats.totalArticles) * 100}%`,
                        backgroundColor: category.color
                      }}
                    ></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 space-x-reverse">
            <FiActivity className="text-primary-600" />
            <span>النشاط الأخير</span>
          </h2>
          <div className="space-y-3">
            {recentActivity.map((article) => (
              <Link
                key={article._id}
                to={`/article/${article.slug}`}
                className="flex items-start space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 line-clamp-1">{article.title}</h3>
                  <p className="text-sm text-gray-600">
                    بواسطة {article.author?.displayName} • {new Date(article.createdAt).toLocaleDateString('ar-YE')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-lg shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white bg-opacity-20 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
};

export default StatsPage;
