import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoriesAPI, articlesAPI } from '../services/api';
import { FiBook, FiTrendingUp, FiStar, FiPlus } from 'react-icons/fi';

const PortalPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortalData();
  }, [slug]);

  const loadPortalData = async () => {
    try {
      const [catRes, articlesRes] = await Promise.all([
        categoriesAPI.getBySlug(slug),
        articlesAPI.getAll({ category: slug, limit: 20, status: 'published' }),
      ]);

      setCategory(catRes.data.category);
      setArticles(articlesRes.data.articles);

      // Get featured articles
      const featured = articlesRes.data.articles.filter(a => a.featured);
      setFeaturedArticles(featured);
    } catch (error) {
      console.error('Failed to load portal:', error);
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

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">البوابة غير موجودة</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Portal Header */}
      <div
        className="py-20 text-white"
        style={{ background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)` }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="text-6xl mb-4 block">{category.icon}</span>
            <h1 className="text-5xl font-bold mb-4">بوابة {category.nameAr}</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Portal Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={`#articles`}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <FiBook />
              <span>المقالات</span>
            </Link>
            <Link
              to={`#featured`}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <FiStar />
              <span>مقالات مميزة</span>
            </Link>
            <Link
              to={`#trending`}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <FiTrendingUp />
              <span>الأكثر قراءة</span>
            </Link>
            <Link
              to="/create"
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <FiPlus />
              <span>مقالة جديدة</span>
            </Link>
          </div>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div id="featured" className="mb-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2 space-x-reverse">
              <FiStar className="text-yellow-500" />
              <span>مقالات مميزة</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredArticles.slice(0, 4).map((article) => (
                <Link
                  key={article._id}
                  to={`/article/${article.slug}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  {article.images?.[0] && (
                    <img
                      src={article.images[0].url}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                    <p className="text-gray-600 line-clamp-3">{article.summary}</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span>{article.views} مشاهدة</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div id="articles">
          <h2 className="text-3xl font-bold mb-6 flex items-center space-x-2 space-x-reverse">
            <FiBook className="text-primary-600" />
            <span>جميع المقالات</span>
          </h2>

          {articles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">
                لا توجد مقالات في هذه البوابة حتى الآن
              </p>
              <Link
                to="/create"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
              >
                كن أول من يساهم!
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article._id}
                  to={`/article/${article.slug}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
                >
                  <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.author?.displayName}</span>
                    <span>{article.views} مشاهدة</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Portal Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {articles.length}
            </div>
            <div className="text-gray-600">مقالة</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {featuredArticles.length}
            </div>
            <div className="text-gray-600">مقالة مميزة</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {articles.reduce((sum, a) => sum + (a.views || 0), 0).toLocaleString()}
            </div>
            <div className="text-gray-600">مشاهدة</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalPage;
