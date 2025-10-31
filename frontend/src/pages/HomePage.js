import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI, categoriesAPI } from '../services/api';
import { FiTrendingUp, FiBookOpen, FiUsers, FiStar, FiCpu, FiEdit, FiGlobe, FiAward, FiSearch } from 'react-icons/fi';

const HomePage = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ articles: 0, editors: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [articlesRes, categoriesRes, featuredRes] = await Promise.all([
        articlesAPI.getAll({ limit: 6, status: 'published' }),
        categoriesAPI.getAll(),
        articlesAPI.getAll({ featured: true, status: 'published', limit: 3 }),
      ]);

      setRecentArticles(articlesRes.data.articles);
      setFeaturedArticles(featuredRes.data.articles);
      setCategories(categoriesRes.data.categories);

      // Calculate stats (mock data for now)
      setStats({
        articles: articlesRes.data.pagination.total,
        editors: 150,
        views: 50000,
      });
    } catch (error) {
      console.error('Failed to load data:', error);
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
      {/* Hero Section - Enhanced */}
      <div className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute transform rotate-45 -right-32 top-0 w-96 h-96 bg-white rounded-full"></div>
          <div className="absolute transform -rotate-45 -left-32 bottom-0 w-96 h-96 bg-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
            <span className="text-2xl">🇾🇪</span>
          </div>
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            مرحباً بك في<br />
            <span className="text-yellow-300">يمن بيديا</span>
          </h1>
          <p className="text-2xl mb-4 opacity-95 max-w-3xl mx-auto">
            الموسوعة اليمنية الحرة والشاملة
          </p>
          <p className="text-lg mb-10 opacity-80 max-w-2xl mx-auto">
            مع مساعد ذكاء صناعي متكامل لمساعدتك في البحث والكتابة والتحرير
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              to="/search"
              className="flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FiSearch size={20} />
              ابحث في الموسوعة
            </Link>
            <Link
              to="/ai-assistant"
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FiCpu size={20} />
              المساعد الذكي
            </Link>
            <Link
              to="/create"
              className="flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-400 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FiEdit size={20} />
              ابدأ الكتابة
            </Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/featured" className="flex items-center gap-1 hover:text-yellow-300 transition">
              <FiStar /> مقالات مميزة
            </Link>
            <Link to="/categories" className="flex items-center gap-1 hover:text-yellow-300 transition">
              <FiBookOpen /> التصنيفات
            </Link>
            <Link to="/about" className="flex items-center gap-1 hover:text-yellow-300 transition">
              <FiGlobe /> عن المشروع
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FiBookOpen className="mx-auto text-primary-600 mb-2" size={40} />
            <h3 className="text-3xl font-bold text-gray-800">{stats.articles}+</h3>
            <p className="text-gray-600">مقالة</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FiUsers className="mx-auto text-primary-600 mb-2" size={40} />
            <h3 className="text-3xl font-bold text-gray-800">{stats.editors}+</h3>
            <p className="text-gray-600">محرر</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FiTrendingUp className="mx-auto text-primary-600 mb-2" size={40} />
            <h3 className="text-3xl font-bold text-gray-800">{stats.views.toLocaleString()}+</h3>
            <p className="text-gray-600">مشاهدة</p>
          </div>
        </div>
      </div>

      {/* Featured Articles Section */}
      {featuredArticles.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 mb-8">
              <FiStar className="text-yellow-600" size={32} />
              <h2 className="text-4xl font-bold text-gray-800">مقالات مميزة</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Link
                  key={article._id}
                  to={`/article/${article.slug}`}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group transform hover:-translate-y-2"
                >
                  {article.images?.[0] && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.images[0].url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
                        <FiStar size={14} />
                        مميزة
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2 group-hover:text-primary-600 transition">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.summary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiUsers size={12} />
                        {article.author?.displayName}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiTrendingUp size={12} />
                        {article.views} مشاهدة
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/featured"
                className="inline-flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
              >
                عرض جميع المقالات المميزة
                <FiStar />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-3 text-center text-gray-800">استكشف التصنيفات</h2>
        <p className="text-center text-gray-600 mb-10">15 تصنيف يمني متخصص لاستكشاف المعرفة اليمنية</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.slice(0, 10).map((category) => (
            <Link
              key={category._id}
              to={`/category/${category.slug}`}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-center transform hover:-translate-y-1 group"
              style={{ borderTop: `4px solid ${category.color}` }}
            >
              <span className="text-5xl mb-3 block group-hover:scale-110 transition-transform">{category.icon}</span>
              <h3 className="font-bold text-gray-800 group-hover:text-primary-600 transition">{category.nameAr}</h3>
              <p className="text-xs text-gray-500 mt-1">{category.description}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:underline"
          >
            عرض جميع التصنيفات ({categories.length})
            <FiBookOpen />
          </Link>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="container mx-auto px-4 py-16 bg-white">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">أحدث المقالات</h2>
          <Link to="/articles" className="text-primary-600 hover:underline">
            عرض الكل ←
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <Link
              key={article._id}
              to={`/article/${article.slug}`}
              className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              {article.images?.[0] && (
                <img
                  src={article.images[0].url}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.categories?.slice(0, 2).map((cat) => (
                    <span
                      key={cat._id}
                      className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
                    >
                      {cat.nameAr}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.summary}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>بواسطة {article.author?.displayName}</span>
                  <span>{article.views} مشاهدة</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How to Become Editor Section */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <FiAward className="text-green-600" size={32} />
              <h2 className="text-4xl font-bold text-gray-800">كن محرراً في يمن بيديا</h2>
            </div>
            <p className="text-center text-xl text-gray-600 mb-10">
              ساهم في بناء أكبر موسوعة يمنية على الإنترنت واحصل على صلاحيات محرر متقدمة
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">1️⃣</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">سجل حسابك</h3>
                <p className="text-gray-600 text-sm">أنشئ حساب مجاني في يمن بيديا</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">2️⃣</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">اكتب مقالات</h3>
                <p className="text-gray-600 text-sm">ساهم بكتابة مقالات عالية الجودة</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">3️⃣</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">اطلب الترقية</h3>
                <p className="text-gray-600 text-sm">قدّم طلب لتصبح محرراً معتمداً</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg"
              >
                <FiEdit />
                ابدأ الآن مجاناً
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Promo */}
      <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block mb-6 p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <FiCpu className="mx-auto" size={48} />
            </div>
            <h2 className="text-5xl font-bold mb-6">المساعد الذكي يمن بيديا</h2>
            <p className="text-2xl mb-4 opacity-95">
              مساعدك الشخصي المدعوم بالذكاء الصناعي
            </p>
            <p className="text-lg mb-10 opacity-80 max-w-2xl mx-auto">
              يساعدك في البحث، الكتابة، التحرير، والإجابة على أسئلتك حول اليمن
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <FiSearch size={24} className="mx-auto mb-2" />
                <p className="font-semibold">بحث ذكي</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <FiEdit size={24} className="mx-auto mb-2" />
                <p className="font-semibold">مساعدة في الكتابة</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <FiCpu size={24} className="mx-auto mb-2" />
                <p className="font-semibold">إجابات فورية</p>
              </div>
            </div>

            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition shadow-2xl text-lg"
            >
              جرّب المساعد الذكي مجاناً
              <FiCpu />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">يمن بيديا</h3>
              <p className="text-gray-400">الموسوعة اليمنية الحرة للجميع</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">من نحن</Link></li>
                <li><Link to="/help" className="hover:text-white">المساعدة</Link></li>
                <li><Link to="/contact" className="hover:text-white">اتصل بنا</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">للمحررين</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/create" className="hover:text-white">إنشاء مقالة</Link></li>
                <li><Link to="/guidelines" className="hover:text-white">إرشادات التحرير</Link></li>
                <li><Link to="/community" className="hover:text-white">المجتمع</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">تابعنا</h4>
              <p className="text-gray-400">تابعنا على وسائل التواصل الاجتماعي</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 يمن بيديا. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
