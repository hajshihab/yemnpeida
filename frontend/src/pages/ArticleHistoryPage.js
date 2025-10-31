import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articlesAPI } from '../services/api';
import { FiClock, FiUser, FiEdit, FiEye, FiArrowRight } from 'react-icons/fi';

const ArticleHistoryPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareRevision, setCompareRevision] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticleHistory();
  }, [id]);

  const loadArticleHistory = async () => {
    try {
      const res = await articlesAPI.getById(id);
      setArticle(res.data.article);
      setRevisions(res.data.article.revisions || []);
    } catch (error) {
      console.error('Failed to load article history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('ar-YE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChangeSummary = (revision) => {
    if (!revision.changes) return 'لا توجد تفاصيل';

    const changes = [];
    if (revision.changes.title) changes.push('العنوان');
    if (revision.changes.content) changes.push('المحتوى');
    if (revision.changes.summary) changes.push('الملخص');
    if (revision.changes.categories) changes.push('التصنيفات');
    if (revision.changes.tags) changes.push('الوسوم');

    return changes.length > 0 ? `تم تعديل: ${changes.join(' • ')}` : 'تعديلات عامة';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">المقالة غير موجودة</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            to={`/article/${article.slug}`}
            className="inline-flex items-center space-x-2 space-x-reverse text-white opacity-80 hover:opacity-100 mb-4"
          >
            <FiArrowRight />
            <span>العودة للمقالة</span>
          </Link>
          <h1 className="text-4xl font-bold mb-2">سجل التعديلات</h1>
          <p className="text-xl opacity-90">{article.title}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">{revisions.length + 1}</div>
            <div className="text-gray-600">إجمالي المراجعات</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {new Set(revisions.map(r => r.author?.displayName)).size + 1}
            </div>
            <div className="text-gray-600">المحررون</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatDate(article.createdAt).split(' ')[0]}
            </div>
            <div className="text-gray-600">تاريخ الإنشاء</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {formatDate(article.updatedAt).split(' ')[0]}
            </div>
            <div className="text-gray-600">آخر تحديث</div>
          </div>
        </div>

        {/* Compare Mode Toggle */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => {
                setCompareMode(e.target.checked);
                if (!e.target.checked) {
                  setCompareRevision(null);
                }
              }}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-gray-700">وضع المقارنة</span>
          </label>
          {compareMode && (
            <p className="text-sm text-gray-500 mt-2">
              اختر مراجعتين لمقارنة التغييرات بينهما
            </p>
          )}
        </div>

        {/* Revisions Timeline */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 space-x-reverse">
            <FiClock className="text-primary-600" />
            <span>سجل المراجعات</span>
          </h2>

          <div className="space-y-4">
            {/* Current Version */}
            <div
              className={`border-r-4 border-green-500 bg-green-50 p-4 rounded-lg ${
                compareMode ? 'cursor-pointer hover:bg-green-100' : ''
              }`}
              onClick={() => {
                if (compareMode) {
                  if (!selectedRevision) {
                    setSelectedRevision('current');
                  } else if (selectedRevision !== 'current') {
                    setCompareRevision('current');
                  }
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 space-x-reverse mb-2">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      النسخة الحالية
                    </span>
                    {compareMode && (selectedRevision === 'current' || compareRevision === 'current') && (
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        {selectedRevision === 'current' ? 'محدد 1' : 'محدد 2'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600 mb-2">
                    <span className="flex items-center space-x-1 space-x-reverse">
                      <FiUser />
                      <span>{article.author?.displayName}</span>
                    </span>
                    <span className="flex items-center space-x-1 space-x-reverse">
                      <FiClock />
                      <span>{formatDate(article.updatedAt)}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{article.summary}</p>
                </div>
                <Link
                  to={`/article/${article.slug}`}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                  title="عرض"
                >
                  <FiEye size={20} />
                </Link>
              </div>
            </div>

            {/* Previous Revisions */}
            {revisions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد مراجعات سابقة
              </div>
            ) : (
              revisions.map((revision, index) => (
                <div
                  key={revision._id || index}
                  className={`border-r-4 border-blue-500 bg-blue-50 p-4 rounded-lg ${
                    compareMode ? 'cursor-pointer hover:bg-blue-100' : ''
                  }`}
                  onClick={() => {
                    if (compareMode) {
                      if (!selectedRevision) {
                        setSelectedRevision(revision._id);
                      } else if (selectedRevision !== revision._id) {
                        setCompareRevision(revision._id);
                      }
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 space-x-reverse mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          المراجعة #{revisions.length - index}
                        </span>
                        {compareMode && (selectedRevision === revision._id || compareRevision === revision._id) && (
                          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                            {selectedRevision === revision._id ? 'محدد 1' : 'محدد 2'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600 mb-2">
                        <span className="flex items-center space-x-1 space-x-reverse">
                          <FiUser />
                          <span>{revision.author?.displayName || 'محرر'}</span>
                        </span>
                        <span className="flex items-center space-x-1 space-x-reverse">
                          <FiClock />
                          <span>{formatDate(revision.timestamp)}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{getChangeSummary(revision)}</p>
                      {revision.comment && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          "{revision.comment}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Compare View */}
        {compareMode && selectedRevision && compareRevision && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h3 className="text-xl font-bold mb-4">مقارنة المراجعات</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">المراجعة الأولى</h4>
                <p className="text-sm text-gray-600">
                  {selectedRevision === 'current' ? 'النسخة الحالية' : `المراجعة #${revisions.findIndex(r => r._id === selectedRevision) + 1}`}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">المراجعة الثانية</h4>
                <p className="text-sm text-gray-600">
                  {compareRevision === 'current' ? 'النسخة الحالية' : `المراجعة #${revisions.findIndex(r => r._id === compareRevision) + 1}`}
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center text-gray-600">
              <FiEdit size={32} className="mx-auto mb-2 text-gray-400" />
              <p>ميزة المقارنة التفصيلية قيد التطوير</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleHistoryPage;
