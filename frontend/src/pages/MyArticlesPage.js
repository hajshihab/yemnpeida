import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiEdit, FiTrash2, FiEye, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';

const MyArticlesPage = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, published, draft, pending

  useEffect(() => {
    loadMyArticles();
  }, [filter]);

  const loadMyArticles = async () => {
    try {
      setLoading(true);
      const res = await articlesAPI.getAll({
        author: user._id,
        status: filter === 'all' ? undefined : filter,
        limit: 100
      });
      setArticles(res.data.articles || []);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المقالة؟')) {
      try {
        await articlesAPI.delete(id);
        setArticles(articles.filter(a => a._id !== id));
      } catch (error) {
        console.error('Failed to delete article:', error);
        alert('فشل حذف المقالة');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      published: { icon: <FiCheckCircle />, text: 'منشور', color: 'bg-green-100 text-green-800' },
      draft: { icon: <FiEdit />, text: 'مسودة', color: 'bg-gray-100 text-gray-800' },
      pending: { icon: <FiClock />, text: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800' },
      rejected: { icon: <FiXCircle />, text: 'مرفوض', color: 'bg-red-100 text-red-800' }
    };
    const badge = badges[status] || badges.draft;
    return (
      <span className={`inline-flex items-center space-x-1 space-x-reverse px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.icon}
        <span>{badge.text}</span>
      </span>
    );
  };

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length,
    pending: articles.filter(a => a.status === 'pending').length,
    totalViews: articles.reduce((sum, a) => sum + (a.views || 0), 0)
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
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">مقالاتي</h1>
          <p className="text-xl opacity-90">إدارة مقالاتك ومساهماتك في يمن بيديا</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
            <div className="text-sm text-gray-600">إجمالي المقالات</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            <div className="text-sm text-gray-600">منشور</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
            <div className="text-sm text-gray-600">مسودة</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">قيد المراجعة</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</div>
            <div className="text-sm text-gray-600">مشاهدة</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              الكل ({stats.total})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'published' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              منشور ({stats.published})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'draft' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              مسودة ({stats.draft})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              قيد المراجعة ({stats.pending})
            </button>
          </div>
        </div>

        {/* Create New Article Button */}
        <Link
          to="/create"
          className="inline-flex items-center space-x-2 space-x-reverse bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition mb-6"
        >
          <FiEdit />
          <span>مقالة جديدة</span>
        </Link>

        {/* Articles List */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiAlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {filter === 'all' ? 'لا توجد مقالات بعد' : `لا توجد مقالات ${filter === 'published' ? 'منشورة' : filter === 'draft' ? 'كمسودة' : 'قيد المراجعة'}`}
            </h3>
            <p className="text-gray-600 mb-4">ابدأ الآن بكتابة مقالتك الأولى!</p>
            <Link
              to="/create"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
            >
              إنشاء مقالة
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse mb-2">
                      <Link
                        to={`/article/${article.slug}`}
                        className="text-xl font-bold text-gray-800 hover:text-primary-600 transition"
                      >
                        {article.title}
                      </Link>
                      {getStatusBadge(article.status)}
                      {article.featured && (
                        <span className="inline-flex items-center space-x-1 space-x-reverse px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FiCheckCircle />
                          <span>مميزة</span>
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 line-clamp-2 mb-3">{article.summary}</p>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                      <span className="flex items-center space-x-1 space-x-reverse">
                        <FiEye />
                        <span>{article.views || 0} مشاهدة</span>
                      </span>
                      <span className="flex items-center space-x-1 space-x-reverse">
                        <FiClock />
                        <span>{new Date(article.createdAt).toLocaleDateString('ar-YE')}</span>
                      </span>
                      {article.categories?.length > 0 && (
                        <span className="text-primary-600">
                          {article.categories.map(c => c.nameAr).join(' • ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse mr-4">
                    <Link
                      to={`/edit/${article._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="تحرير"
                    >
                      <FiEdit size={20} />
                    </Link>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="حذف"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Revision Count */}
                {article.revisions?.length > 0 && (
                  <div className="text-xs text-gray-500 mt-2">
                    {article.revisions.length} مراجعة • آخر تحديث: {new Date(article.updatedAt).toLocaleDateString('ar-YE')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArticlesPage;
