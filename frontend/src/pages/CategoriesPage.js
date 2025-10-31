import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI, articlesAPI } from '../services/api';
import { FiGrid, FiList, FiTrendingUp } from 'react-icons/fi';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, articlesRes] = await Promise.all([
        categoriesAPI.getAll(),
        articlesAPI.getAll({ limit: 1000 })
      ]);

      setCategories(categoriesRes.data.categories);

      // Calculate stats per category
      const articles = articlesRes.data.articles || [];
      const categoryStats = {};

      categoriesRes.data.categories.forEach(cat => {
        const catArticles = articles.filter(a =>
          a.categories?.some(c => c._id === cat._id)
        );
        categoryStats[cat._id] = {
          count: catArticles.length,
          views: catArticles.reduce((sum, a) => sum + (a.views || 0), 0)
        };
      });

      setStats(categoryStats);
    } catch (error) {
      console.error('Failed to load categories:', error);
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
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">🗂️ تصفح حسب التصنيفات</h1>
          <p className="text-xl text-center opacity-90 max-w-3xl mx-auto">
            استكشف الموسوعة اليمنية عبر 15 تصنيفاً متخصصاً
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* View Toggle */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">جميع التصنيفات ({categories.length})</h2>
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
            >
              <FiGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
            >
              <FiList size={20} />
            </button>
          </div>
        </div>

        {/* Categories Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} stats={stats[category._id]} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <CategoryListItem key={category._id} category={category} stats={stats[category._id]} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryCard = ({ category, stats }) => {
  return (
    <Link
      to={`/portal/${category.slug}`}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
    >
      <div
        className="h-32 flex items-center justify-center text-6xl group-hover:scale-110 transition"
        style={{ background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}40 100%)` }}
      >
        <span>{category.icon}</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{category.nameAr}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{stats?.count || 0} مقالة</span>
          <span>{(stats?.views || 0).toLocaleString()} مشاهدة</span>
        </div>
      </div>
    </Link>
  );
};

const CategoryListItem = ({ category, stats }) => {
  return (
    <Link
      to={`/portal/${category.slug}`}
      className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex items-center space-x-4 space-x-reverse"
    >
      <div
        className="w-20 h-20 rounded-lg flex items-center justify-center text-4xl flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}40 100%)` }}
      >
        {category.icon}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{category.nameAr}</h3>
        <p className="text-sm text-gray-600 mb-2">{category.description}</p>
        <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
          <span>📄 {stats?.count || 0} مقالة</span>
          <span>👁️ {(stats?.views || 0).toLocaleString()} مشاهدة</span>
        </div>
      </div>
      <div className="text-primary-600 text-2xl">←</div>
    </Link>
  );
};

export default CategoriesPage;
