import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAPI } from '../services/api';
import { FiSearch } from 'react-icons/fi';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery, page = 1) => {
    if (!searchQuery || searchQuery.trim().length < 2) return;

    setLoading(true);
    try {
      const response = await searchAPI.search({ q: searchQuery, page, limit: 20 });
      setResults(response.data.results);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">البحث في يمن بيديا</h1>
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن مقالات..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-600"
              >
                <FiSearch size={24} />
              </button>
            </form>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loading-spinner"></div>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="mb-4 text-gray-600">
                عُثر على {pagination?.total} نتيجة للبحث عن "{searchParams.get('q')}"
              </div>

              <div className="space-y-4">
                {results.map((article) => (
                  <Link
                    key={article._id}
                    to={`/article/${article.slug}`}
                    className="block bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-xl font-bold text-gray-900 hover:text-primary-600">
                        {article.title}
                      </h2>
                      <span className="text-sm text-gray-500">{article.views} مشاهدة</span>
                    </div>

                    {article.summary && (
                      <p className="text-gray-600 mb-3 line-clamp-2">{article.summary}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      {article.categories?.slice(0, 2).map((cat) => (
                        <span
                          key={cat._id}
                          className="bg-primary-100 text-primary-700 px-2 py-1 rounded"
                        >
                          {cat.nameAr}
                        </span>
                      ))}

                      <span>بواسطة {article.author?.displayName}</span>
                      <span>{new Date(article.createdAt).toLocaleDateString('ar-YE')}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center mt-8 space-x-2 space-x-reverse">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => performSearch(searchParams.get('q'), page)}
                      className={`px-4 py-2 rounded ${
                        page === pagination.page
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : searchParams.get('q') ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                لا توجد نتائج للبحث عن "{searchParams.get('q')}"
              </h2>
              <p className="text-gray-600 mb-6">جرّب كلمات بحث مختلفة أو أقل تحديداً</p>
              <Link to="/" className="text-primary-600 hover:underline">
                العودة للصفحة الرئيسية
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
