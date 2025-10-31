import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articlesAPI } from '../services/api';
import { FiClock, FiUser, FiEye, FiEdit, FiMessageSquare, FiPrinter, FiShare2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Infobox from '../components/Infobox';
import TableOfContents from '../components/TableOfContents';
import CitationBox from '../components/CitationBox';

const ArticlePageEnhanced = () => {
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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط!');
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
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 space-x-reverse text-gray-600">
              <li><Link to="/" className="hover:text-primary-600">الرئيسية</Link></li>
              <li>←</li>
              {article.categories?.[0] && (
                <>
                  <li>
                    <Link to={`/portal/${article.categories[0].slug}`} className="hover:text-primary-600">
                      {article.categories[0].nameAr}
                    </Link>
                  </li>
                  <li>←</li>
                </>
              )}
              <li className="text-gray-900 font-semibold">{article.title}</li>
            </ol>
          </nav>

          {/* Article Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {article.categories?.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/portal/${cat.slug}`}
                  className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-200"
                >
                  {cat.icon} {cat.nameAr}
                </Link>
              ))}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-4 border-b">
              <div className="flex items-center space-x-2 space-x-reverse">
                <FiUser />
                <Link to={`/user/${article.author?.username}`} className="text-primary-600 hover:underline">
                  {article.author?.displayName}
                </Link>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <FiClock />
                <span>{new Date(article.createdAt).toLocaleDateString('ar-YE')}</span>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <FiEye />
                <span>{article.views?.toLocaleString()} مشاهدة</span>
              </div>

              {/* Action Buttons */}
              <div className="mr-auto flex items-center gap-2">
                {isEditor && (
                  <Link
                    to={`/edit/${article._id}`}
                    className="flex items-center space-x-1 space-x-reverse text-primary-600 hover:underline"
                  >
                    <FiEdit size={16} />
                    <span>تحرير</span>
                  </Link>
                )}
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-1 space-x-reverse text-gray-600 hover:text-gray-800"
                  title="طباعة"
                >
                  <FiPrinter size={16} />
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 space-x-reverse text-gray-600 hover:text-gray-800"
                  title="مشاركة"
                >
                  <FiShare2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - TOC and Tools */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-4 space-y-4">
                {/* Table of Contents */}
                <TableOfContents content={article.content} />

                {/* Tools */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-gray-800 mb-3">أدوات</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link to={`/talk/${article.slug}`} className="flex items-center space-x-2 space-x-reverse text-blue-600 hover:underline">
                        <FiMessageSquare size={14} />
                        <span>صفحة النقاش</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={`/history/${article._id}`} className="text-blue-600 hover:underline">
                        عرض التاريخ
                      </Link>
                    </li>
                    <li>
                      <button onClick={handlePrint} className="text-blue-600 hover:underline">
                        نسخة للطباعة
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Related Articles */}
                {article.relatedArticles && article.relatedArticles.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="font-bold text-gray-800 mb-3">مقالات ذات صلة</h3>
                    <ul className="space-y-2 text-sm">
                      {article.relatedArticles.map((related) => (
                        <li key={related._id}>
                          <Link
                            to={`/article/${related.slug}`}
                            className="text-blue-600 hover:underline line-clamp-2"
                          >
                            {related.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                {/* Infobox (if data exists) */}
                {article.infobox && (
                  <Infobox
                    title={article.infobox.title}
                    image={article.infobox.image}
                    data={article.infobox.data}
                  />
                )}

                {/* Summary */}
                {article.summary && (
                  <div className="bg-blue-50 border-r-4 border-blue-500 p-4 mb-6 italic">
                    <p className="text-lg text-gray-700">{article.summary}</p>
                  </div>
                )}

                {/* Article Body */}
                <div
                  className="article-content prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

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

                {/* Citations and References */}
                <CitationBox references={article.references} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePageEnhanced;
