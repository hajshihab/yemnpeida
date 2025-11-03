import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiEdit, FiHome, FiBook, FiStar, FiActivity, FiInfo, FiHelpCircle, FiFileText } from 'react-icons/fi';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <span className="text-2xl font-bold text-primary-600">يمن بيديا</span>
            <span className="text-sm text-gray-600">🇾🇪</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث في يمن بيديا..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {/* Language Switcher */}
            <LanguageSwitcher />

            <Link to="/" className="flex items-center space-x-1 space-x-reverse text-gray-700 hover:text-primary-600">
              <FiHome />
              <span>{t('nav.home')}</span>
            </Link>

            <Link to="/categories" className="flex items-center space-x-1 space-x-reverse text-gray-700 hover:text-primary-600">
              <FiBook />
              <span>التصنيفات</span>
            </Link>

            <Link to="/featured" className="flex items-center space-x-1 space-x-reverse text-gray-700 hover:text-primary-600">
              <FiStar />
              <span>مميزة</span>
            </Link>

            <Link to="/stats" className="flex items-center space-x-1 space-x-reverse text-gray-700 hover:text-primary-600">
              <FiActivity />
              <span>الإحصائيات</span>
            </Link>

            <Link to="/sources" className="flex items-center space-x-1 space-x-reverse text-gray-700 hover:text-primary-600">
              <FiFileText />
              <span>المصادر</span>
            </Link>

            <div className="relative group">
              <button className="flex items-center space-x-1 space-x-reverse text-gray-700 hover:text-primary-600">
                <FiInfo />
                <span>المزيد</span>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  حول يمن بيديا
                </Link>
                <Link to="/help" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  مساعدة
                </Link>
                <Link to="/ai-assistant" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  المساعد الذكي
                </Link>
                <Link to="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  اتصل بنا
                </Link>
              </div>
            </div>

            {isAuthenticated ? (
              <>
                <Link to="/create" className="flex items-center space-x-1 space-x-reverse bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                  <FiEdit />
                  <span>مقالة جديدة</span>
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 space-x-reverse text-gray-700 hover:text-primary-600">
                    <FiUser />
                    <span>{user?.displayName}</span>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      الملف الشخصي
                    </Link>
                    <Link to="/my-articles" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      مقالاتي
                    </Link>
                    {(user?.role === 'editor' || user?.role === 'admin' || user?.role === 'super_admin') && (
                      <Link to="/admin" className="block px-4 py-2 text-primary-600 hover:bg-gray-100 font-semibold">
                        لوحة المحرر
                      </Link>
                    )}
                    {(user?.role === 'admin' || user?.role === 'super_admin') && (
                      <Link to="/super-admin" className="block px-4 py-2 text-purple-600 hover:bg-gray-100 font-semibold">
                        لوحة الإدارة
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-right px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center space-x-2 space-x-reverse"
                    >
                      <FiLogOut />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  تسجيل الدخول
                </Link>
                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث في يمن بيديا..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </form>

            <div className="space-y-2">
              <Link to="/" className="block py-2 text-gray-700 hover:text-primary-600">
                الرئيسية
              </Link>
              <Link to="/categories" className="block py-2 text-gray-700 hover:text-primary-600">
                التصنيفات
              </Link>
              <Link to="/featured" className="block py-2 text-gray-700 hover:text-primary-600">
                مقالات مميزة
              </Link>
              <Link to="/stats" className="block py-2 text-gray-700 hover:text-primary-600">
                الإحصائيات
              </Link>
              <Link to="/sources" className="block py-2 text-gray-700 hover:text-primary-600">
                المصادر
              </Link>
              <Link to="/about" className="block py-2 text-gray-700 hover:text-primary-600">
                حول يمن بيديا
              </Link>
              <Link to="/help" className="block py-2 text-gray-700 hover:text-primary-600">
                مساعدة
              </Link>
              <Link to="/ai-assistant" className="block py-2 text-gray-700 hover:text-primary-600">
                المساعد الذكي
              </Link>
              <Link to="/contact" className="block py-2 text-gray-700 hover:text-primary-600">
                اتصل بنا
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/create" className="block py-2 text-primary-600 font-semibold">
                    مقالة جديدة
                  </Link>
                  <Link to="/profile" className="block py-2 text-gray-700">
                    الملف الشخصي
                  </Link>
                  <Link to="/my-articles" className="block py-2 text-gray-700">
                    مقالاتي
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-right py-2 text-red-600"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 text-gray-700">
                    تسجيل الدخول
                  </Link>
                  <Link to="/register" className="block py-2 text-primary-600 font-semibold">
                    إنشاء حساب
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
