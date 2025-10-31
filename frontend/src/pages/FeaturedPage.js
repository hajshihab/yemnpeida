import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI } from '../services/api';
import { FiStar, FiEye, FiClock, FiAward } from 'react-icons/fi';

const FeaturedPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedArticles();
  }, []);

  const loadFeaturedArticles = async () => {
    try {
      const response = await articlesAPI.getAll({ featured: true, status: 'published', limit: 50 });
      setArticles(response.data.articles || []);
    } catch (error) {
      console.error('Failed to load featured articles:', error);
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
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 space-x-reverse mb-4">
            <FiStar size={48} />
            <h1 className="text-4xl font-bold">المقالات المميزة</h1>
          </div>
          <p className="text-xl text-center opacity-90 max-w-3xl mx-auto">
            أفضل المقالات في يمن بيديا - محتوى عالي الجودة مختار بعناية
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Info Box */}
        <div className="bg-blue-50 border-r-4 border-blue-500 p-6 rounded-lg mb-8">
          <div className="flex items-start space-x-3 space-x-reverse">
            <FiAward className="text-blue-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">ما هي المقالات المميزة؟</h3>
              <p className="text-blue-800 text-sm">
                المقالات المميزة هي أفضل المحتوى في يمن بيديا. تتميز بالدقة، الشمولية، المراجع الموثوقة،
                والكتابة الاحترافية. يتم اختيارها بعناية من قبل المحررين.
              </p>
            </div>
          </div>
        </div>

        {/* Articles Count */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">
            {articles.length} مقالة مميزة
          </h2>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiStar className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد مقالات مميزة بعد</h3>
            <p className="text-gray-600">سنضيف المقالات المميزة قريباً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <FeaturedArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FeaturedArticleCard = ({ article }) => {
  return (
    <Link
      to={`/article/${article.slug}`}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
    >
      {/* Star Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-yellow-500 text-white p-2 rounded-full shadow-lg">
          <FiStar className="fill-current" size={20} />
        </div>
      </div>

      {/* Image */}
      {article.images?.[0] ? (
        <div className="h-48 overflow-hidden">
          <img
            src={article.images[0].url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
          <FiStar className="text-primary-400" size={64} />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-3">
          {article.categories?.slice(0, 2).map((cat) => (
            <span
              key={cat._id}
              className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
            >
              {cat.icon} {cat.nameAr}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.summary}</p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
          <div className="flex items-center space-x-1 space-x-reverse">
            <FiEye size={14} />
            <span>{article.views?.toLocaleString()} مشاهدة</span>
          </div>
          <div className="flex items-center space-x-1 space-x-reverse">
            <FiClock size={14} />
            <span>{new Date(article.createdAt).toLocaleDateString('ar-YE')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedPage;
