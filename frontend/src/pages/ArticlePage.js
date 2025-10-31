import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articlesAPI } from '../services/api';
import { FiClock, FiUser, FiEye, FiEdit } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

const ArticlePage = () => {
  const { slug } = useParams();
  const { isEditor } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      const response = await articlesAPI.getBySlug(slug);
      setArticle(response.data.article);
    } catch (error) {
      setError('المقالة غير موجودة');
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">❌ {error}</h1>
        <Link to="/" className="text-primary-600 hover:underline">
          العودة للصفحة الرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {article.categories?.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-200"
                >
                  {cat.icon} {cat.nameAr}
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

            {/* Summary */}
            {article.summary && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">{article.summary}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 border-t border-b py-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <FiUser />
                <span>
                  بواسطة{' '}
                  <Link to={`/user/${article.author?.username}`} className="text-primary-600 hover:underline">
                    {article.author?.displayName}
                  </Link>
                </span>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <FiClock />
                <span>{new Date(article.createdAt).toLocaleDateString('ar-YE')}</span>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <FiEye />
                <span>{article.views} مشاهدة</span>
              </div>

              {isEditor && (
                <Link
                  to={`/edit/${article._id}`}
                  className="mr-auto flex items-center space-x-2 space-x-reverse text-primary-600 hover:underline"
                >
                  <FiEdit />
                  <span>تحرير</span>
                </Link>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="article-content prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">الوسوم:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Link
                      key={index}
                      to={`/search?q=${tag}`}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* References */}
            {article.references && article.references.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-bold mb-4">المراجع:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {article.references.map((ref, index) => (
                    <li key={index} className="text-gray-700">
                      {ref.url ? (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline"
                        >
                          {ref.title}
                        </a>
                      ) : (
                        ref.title
                      )}
                      {ref.author && <span className="text-gray-600"> - {ref.author}</span>}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Related Articles */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4">مقالات ذات صلة:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {article.relatedArticles.map((related) => (
                  <Link
                    key={related._id}
                    to={`/article/${related.slug}`}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow transition"
                  >
                    <h4 className="font-semibold text-gray-800 mb-2">{related.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{related.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
