import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiUserCheck, FiUserX, FiShield, FiEdit, FiTrash2, FiCheck, FiX, FiClock, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

const SuperAdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [editorRequests, setEditorRequests] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEditors: 0,
    totalAdmins: 0,
    pendingRequests: 0,
    newUsersThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, user, editor, admin, pending
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'super_admin')) {
      loadData();
    }
  }, [user, filter, searchQuery]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [usersRes, requestsRes, statsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/users?role=${filter !== 'all' && filter !== 'pending' ? filter : ''}&search=${searchQuery}`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/editor-requests/pending`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/stats/overview`, config)
      ]);

      setUsers(usersRes.data.users);
      setEditorRequests(requestsRes.data.requests);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('فشل تحميل البيانات: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditorRequest = async (userId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/editor-request/${userId}`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(action === 'approve' ? 'تمت الموافقة على الطلب بنجاح!' : 'تم رفض الطلب');
      loadData();
    } catch (error) {
      console.error('Failed to handle request:', error);
      alert('فشل في معالجة الطلب: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    if (!window.confirm(`هل أنت متأكد من تغيير الدور إلى "${newRole}"؟`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/role/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('تم تغيير الدور بنجاح!');
      loadData();
    } catch (error) {
      console.error('Failed to change role:', error);
      alert('فشل في تغيير الدور: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء!')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('تم حذف المستخدم بنجاح!');
      loadData();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('فشل في حذف المستخدم: ' + (error.response?.data?.message || error.message));
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      user: { icon: <FiUsers />, text: 'مستخدم', color: 'bg-gray-100 text-gray-800' },
      editor: { icon: <FiEdit />, text: 'محرر', color: 'bg-blue-100 text-blue-800' },
      admin: { icon: <FiShield />, text: 'مدير', color: 'bg-purple-100 text-purple-800' },
      super_admin: { icon: <FiShield />, text: 'مدير رئيسي', color: 'bg-red-100 text-red-800' }
    };
    return badges[role] || badges.user;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { icon: <FiClock />, text: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
      approved: { icon: <FiCheck />, text: 'موافق عليه', color: 'bg-green-100 text-green-800' },
      rejected: { icon: <FiX />, text: 'مرفوض', color: 'bg-red-100 text-red-800' }
    };
    return badges[status] || { icon: null, text: '-', color: 'bg-gray-100 text-gray-800' };
  };

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FiAlertCircle className="mx-auto mb-4 text-red-500" size={64} />
        <h2 className="text-2xl font-bold mb-2">غير مصرح لك بالدخول</h2>
        <p className="text-gray-600">هذه الصفحة متاحة فقط للمديرين</p>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <FiShield className="text-primary-600" />
            لوحة التحكم الإدارية
          </h1>
          <p className="text-gray-600">إدارة المستخدمين والمحررين والصلاحيات</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <FiUsers className="text-blue-600" size={24} />
              <span className="text-2xl font-bold">{stats.totalUsers}</span>
            </div>
            <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <FiEdit className="text-green-600" size={24} />
              <span className="text-2xl font-bold">{stats.totalEditors}</span>
            </div>
            <p className="text-sm text-gray-600">المحررون</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <FiShield className="text-purple-600" size={24} />
              <span className="text-2xl font-bold">{stats.totalAdmins}</span>
            </div>
            <p className="text-sm text-gray-600">المديرون</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <FiClock className="text-yellow-600" size={24} />
              <span className="text-2xl font-bold">{stats.pendingRequests}</span>
            </div>
            <p className="text-sm text-gray-600">طلبات معلقة</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <FiUserCheck className="text-primary-600" size={24} />
              <span className="text-2xl font-bold">{stats.newUsersThisMonth}</span>
            </div>
            <p className="text-sm text-gray-600">مستخدمين جدد هذا الشهر</p>
          </div>
        </div>

        {/* Editor Requests */}
        {editorRequests.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FiClock className="text-yellow-600" />
              طلبات أن تصبح محرراً ({editorRequests.length})
            </h2>
            <div className="space-y-4">
              {editorRequests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                      {request.displayName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{request.displayName}</h3>
                      <p className="text-sm text-gray-600">@{request.username} • {request.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        تاريخ الطلب: {new Date(request.editorRequestDate).toLocaleDateString('ar')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditorRequest(request._id, 'approve')}
                      className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      <FiCheck /> موافقة
                    </button>
                    <button
                      onClick={() => handleEditorRequest(request._id, 'reject')}
                      className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      <FiX /> رفض
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد الإلكتروني..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">جميع المستخدمين</option>
              <option value="user">مستخدمون فقط</option>
              <option value="editor">محررون فقط</option>
              <option value="admin">مديرون فقط</option>
            </select>
            <button
              onClick={loadData}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              تحديث
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">المستخدم</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الدور</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">المساهمات</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">تاريخ التسجيل</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold">
                          {u.displayName[0]}
                        </div>
                        <div>
                          <p className="font-semibold">{u.displayName}</p>
                          <p className="text-sm text-gray-500">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(u.role).color}`}>
                        {getRoleBadge(u.role).icon}
                        {getRoleBadge(u.role).text}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.contributions || 0} مقالة</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(u.createdAt).toLocaleDateString('ar')}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'super_admin' && u.role !== 'super_admin' && (
                        <div className="flex gap-2">
                          <select
                            onChange={(e) => handleChangeRole(u._id, e.target.value)}
                            className="text-sm px-2 py-1 border border-gray-300 rounded"
                            defaultValue={u.role}
                          >
                            <option value="">تغيير الدور...</option>
                            <option value="user">مستخدم</option>
                            <option value="editor">محرر</option>
                            <option value="admin">مدير</option>
                          </select>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="text-red-600 hover:text-red-800"
                            title="حذف المستخدم"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      )}
                      {user.role === 'admin' && (u.role === 'user' || u.role === 'editor') && (
                        <span className="text-sm text-gray-500">صلاحيات محدودة</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {users.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FiUsers className="mx-auto mb-4 text-gray-400" size={64} />
            <p className="text-gray-600">لا يوجد مستخدمين بهذه المعايير</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminPanel;
