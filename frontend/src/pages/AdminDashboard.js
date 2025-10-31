import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI, categoriesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiFileText, FiEye, FiCheckCircle, FiClock, FiAlertCircle, FiTrash2, FiEdit, FiStar, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    pendingArticles: 0,
    draftArticles: 0,
    totalViews: 0,
    totalEditors: 0
  });
  const [pendingArticles, setPendingArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'editor')) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [articlesRes] = await Promise.all([
        articlesAPI.getAll({ limit: 100 })
      ]);

      const articles = articlesRes.data.articles || [];

      // Calculate stats
      const published = articles.filter(a => a.status === 'published');
      const pending = articles.filter(a => a.status === 'pending');
      const drafts = articles.filter(a => a.status === 'draft');
      const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
      const editors = new Set(articles.map(a => a.author?._id).filter(Boolean));

      setStats({
        totalArticles: articles.length,
        publishedArticles: published.length,
        pendingArticles: pending.length,
        draftArticles: drafts.length,
        totalViews,
        totalEditors: editors.size
      });

      setPendingArticles(pending.slice(0, 10));
      setRecentArticles(articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10));
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await articlesAPI.update(id, { status: 'published' });
      loadDashboardData();
      alert('تم نشر المقالة بنجاح!');
    } catch (error) {
      console.error('Failed to approve article:', error);
      alert('فشل في نشر المقالة');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('سبب الرفض (اختياري):');
    try {
      await articlesAPI.update(id, { status: 'rejected', rejectionReason: reason });
      loadDashboardData();
      alert('تم رفض المقالة');
    } catch (error) {
      console.error('Failed to reject article:', error);
      alert('فشل في رفض المقالة');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المقالة نهائياً؟')) {
      try {
        await articlesAPI.delete(id);
        loadDashboardData();
        alert('تم حذف المقالة');
      } catch (error) {
        console.error('Failed to delete article:', error);
        alert('فشل في حذف المقالة');
      }
    }
  };

  const toggleFeatured = async (article) => {
    try {
      await articlesAPI.update(article._id, { featured: !article.featured });
      loadDashboardData();
    } catch (error) {
      console.error('Failed to toggle featured:', error);
      alert('فشل في تحديث المقالة');
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FiAlertCircle size={64} className="mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">غير مصرح لك</h1>
        <p className="text-gray-600 mb-4">يجب أن تكون محرراً أو مسؤولاً للوصول إلى هذه الصفحة</p>
        <Link to="/" className="text-primary-600 hover:underline">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

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
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">لوحة التحكم</h1>
          <p className="text-xl opacity-90">
            مرحباً {user.displayName} • {user.role === 'admin' ? 'مسؤول' : 'محرر'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <FiFileText className="text-blue-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalArticles}</div>
            <div className="text-sm text-gray-600">إجمالي المقالات</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <FiCheckCircle className="text-green-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.publishedArticles}</div>
            <div className="text-sm text-gray-600">منشور</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <FiClock className="text-yellow-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingArticles}</div>
            <div className="text-sm text-gray-600">قيد المراجعة</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <FiEdit className="text-gray-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-600">{stats.draftArticles}</div>
            <div className="text-sm text-gray-600">مسودات</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <FiEye className="text-purple-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</div>
            <div className="text-sm text-gray-600">مشاهدة</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <FiUsers className="text-orange-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.totalEditors}</div>
            <div className="text-sm text-gray-600">محررين</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Articles */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 space-x-reverse">
              <FiClock className="text-yellow-600" />
              <span>مقالات تحتاج مراجعة ({stats.pendingArticles})</span>
            </h2>

            {pendingArticles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiCheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                <p>لا توجد مقالات تحتاج مراجعة!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingArticles.map((article) => (
                  <div key={article._id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                    <div className="mb-3">
                      <Link
                        to={`/article/${article.slug}`}
                        className="text-lg font-bold text-gray-800 hover:text-primary-600"
                      >
                        {article.title}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        بواسطة: {article.author?.displayName} • {new Date(article.createdAt).toLocaleDateString('ar-YE')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleApprove(article._id)}
                        className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        <FiCheckCircle />
                        <span>نشر</span>
                      </button>
                      <button
                        onClick={() => handleReject(article._id)}
                        className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        <FiAlertCircle />
                        <span>رفض</span>
                      </button>
                      <Link
                        to={`/edit/${article._id}`}
                        className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        <FiEdit />
                        <span>تحرير</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Articles */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 space-x-reverse">
              <FiTrendingUp className="text-primary-600" />
              <span>آخر المقالات</span>
            </h2>

            <div className="space-y-3">
              {recentArticles.map((article) => (
                <div key={article._id} className="border rounded-lg p-3 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        to={`/article/${article.slug}`}
                        className="font-semibold text-gray-800 hover:text-primary-600"
                      >
                        {article.title}
                      </Link>
                      <div className="flex items-center space-x-3 space-x-reverse text-xs text-gray-500 mt-1">
                        <span>{article.author?.displayName}</span>
                        <span className={`px-2 py-1 rounded ${
                          article.status === 'published' ? 'bg-green-100 text-green-800' :
                          article.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {article.status === 'published' ? 'منشور' :
                           article.status === 'pending' ? 'قيد المراجعة' : 'مسودة'}
                        </span>
                        <span>{article.views || 0} مشاهدة</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse mr-3">
                      <button
                        onClick={() => toggleFeatured(article)}
                        className={`p-2 rounded-lg transition ${
                          article.featured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400 hover:bg-yellow-50'
                        }`}
                        title={article.featured ? 'إلغاء المميزة' : 'جعلها مميزة'}
                      >
                        <FiStar size={16} />
                      </button>
                      <Link
                        to={`/edit/${article._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <FiEdit size={16} />
                      </Link>
                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/create"
              className="flex flex-col items-center justify-center p-6 bg-primary-50 rounded-lg hover:bg-primary-100 transition"
            >
              <FiEdit size={32} className="text-primary-600 mb-2" />
              <span className="font-semibold text-primary-600">مقالة جديدة</span>
            </Link>
            <Link
              to="/categories"
              className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition"
            >
              <FiFileText size={32} className="text-green-600 mb-2" />
              <span className="font-semibold text-green-600">التصنيفات</span>
            </Link>
            <Link
              to="/sources"
              className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <FiFileText size={32} className="text-blue-600 mb-2" />
              <span className="font-semibold text-blue-600">المصادر</span>
            </Link>
            <Link
              to="/stats"
              className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
            >
              <FiTrendingUp size={32} className="text-purple-600 mb-2" />
              <span className="font-semibold text-purple-600">الإحصائيات</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
