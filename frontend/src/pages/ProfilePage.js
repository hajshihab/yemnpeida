import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articlesAPI } from '../services/api';
import { FiUser, FiEdit3, FiSave, FiX, FiAward, FiBook, FiEye } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, updateProfile, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    avatar: ''
  });
  const [userArticles, setUserArticles] = useState([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    contributions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setFormData({
        displayName: user.displayName || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
      loadUserData();
    }
  }, [user, isAuthenticated, authLoading, navigate]);

  const loadUserData = async () => {
    try {
      // Load user's articles
      const response = await articlesAPI.getAll({ author: user._id, limit: 10 });
      const articles = response.data.articles || [];
      setUserArticles(articles);

      // Calculate stats
      const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
      setStats({
        totalArticles: articles.length,
        totalViews,
        contributions: user.contributions || 0
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
      alert('تم تحديث الملف الشخصي بنجاح!');
    } else {
      alert(result.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const getRoleBadge = (role) => {
    const badges = {
      admin: { text: 'مدير', color: 'bg-red-100 text-red-800', icon: '👑' },
      editor: { text: 'محرر', color: 'bg-blue-100 text-blue-800', icon: '✍️' },
      user: { text: 'عضو', color: 'bg-gray-100 text-gray-800', icon: '👤' }
    };
    return badges[role] || badges.user;
  };

  const roleBadge = getRoleBadge(user?.role);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800"></div>
            <div className="px-8 pb-8">
              <div className="flex items-start -mt-16 mb-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-6xl">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <FiUser className="text-gray-400" />
                    )}
                  </div>
                  <span className={`absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${roleBadge.color}`}>
                    {roleBadge.icon}
                  </span>
                </div>

                {/* Info */}
                <div className="mr-6 mt-16 flex-1">
                  {!isEditing ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-3xl font-bold text-gray-900">{user?.displayName}</h1>
                          <p className="text-gray-600">@{user?.username}</p>
                        </div>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center space-x-2 space-x-reverse bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                        >
                          <FiEdit3 />
                          <span>تحرير الملف</span>
                        </button>
                      </div>
                      <div className="mt-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${roleBadge.color}`}>
                          {roleBadge.icon} {roleBadge.text}
                        </span>
                      </div>
                      {user?.bio && (
                        <p className="mt-4 text-gray-700">{user.bio}</p>
                      )}
                    </>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">الاسم</label>
                        <input
                          type="text"
                          value={formData.displayName}
                          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">نبذة عني</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                          rows="3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">رابط الصورة</label>
                        <input
                          type="url"
                          value={formData.avatar}
                          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          type="submit"
                          className="flex items-center space-x-2 space-x-reverse bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                        >
                          <FiSave />
                          <span>حفظ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex items-center space-x-2 space-x-reverse bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                          <FiX />
                          <span>إلغاء</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 space-x-reverse text-primary-600 mb-2">
                    <FiBook size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{stats.totalArticles}</div>
                  <div className="text-sm text-gray-600">مقالة</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 space-x-reverse text-green-600 mb-2">
                    <FiEye size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{stats.totalViews.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">مشاهدة</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 space-x-reverse text-yellow-600 mb-2">
                    <FiAward size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{stats.contributions}</div>
                  <div className="text-sm text-gray-600">مساهمة</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Articles */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">أحدث المقالات</h2>
            {userArticles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FiBook className="mx-auto mb-4" size={48} />
                <p>لم تكتب أي مقالات بعد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userArticles.map((article) => (
                  <a
                    key={article._id}
                    href={`/article/${article.slug}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{article.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{article.summary}</p>
                      </div>
                      <div className="mr-4 text-right text-sm text-gray-500">
                        <div>{article.views} مشاهدة</div>
                        <div className={`mt-1 px-2 py-1 rounded text-xs ${
                          article.status === 'published' ? 'bg-green-100 text-green-800' :
                          article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {article.status === 'published' ? 'منشور' : 'مسودة'}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
