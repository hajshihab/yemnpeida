import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articlesAPI, categoriesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FiSave, FiArrowRight, FiAlertCircle } from 'react-icons/fi';

const EditArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    categories: [],
    tags: '',
    status: 'draft',
    featured: false,
    infobox: {
      title: '',
      image: { url: '', alt: '' },
      data: []
    },
    sources: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadArticle();
    loadCategories();
  }, [id, isAuthenticated]);

  const loadArticle = async () => {
    try {
      const res = await articlesAPI.getById(id);
      const articleData = res.data.article;

      // Check if user can edit
      if (articleData.author._id !== user._id && user.role !== 'admin' && user.role !== 'editor') {
        alert('ليس لديك صلاحية لتحرير هذه المقالة');
        navigate('/');
        return;
      }

      setArticle(articleData);
      setFormData({
        title: articleData.title || '',
        content: articleData.content || '',
        summary: articleData.summary || '',
        categories: articleData.categories?.map(c => c._id) || [],
        tags: articleData.tags?.join(', ') || '',
        status: articleData.status || 'draft',
        featured: articleData.featured || false,
        infobox: articleData.infobox || { title: '', image: { url: '', alt: '' }, data: [] },
        sources: articleData.sources || []
      });
    } catch (error) {
      console.error('Failed to load article:', error);
      alert('فشل في تحميل المقالة');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCategoryChange = (categoryId) => {
    const newCategories = formData.categories.includes(categoryId)
      ? formData.categories.filter(c => c !== categoryId)
      : [...formData.categories, categoryId];
    setFormData({ ...formData, categories: newCategories });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('يرجى ملء العنوان والمحتوى');
      return;
    }

    setSaving(true);
    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

      await articlesAPI.update(id, {
        ...formData,
        tags
      });

      alert('تم تحديث المقالة بنجاح!');
      navigate(`/article/${article.slug}`);
    } catch (error) {
      console.error('Failed to update article:', error);
      alert('فشل في تحديث المقالة: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ]
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
        <FiAlertCircle size={64} className="mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">المقالة غير موجودة</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 space-x-reverse text-white opacity-80 hover:opacity-100 mb-4"
          >
            <FiArrowRight />
            <span>رجوع</span>
          </button>
          <h1 className="text-4xl font-bold mb-2">تحرير المقالة</h1>
          <p className="text-xl opacity-90">{article.title}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                العنوان <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 text-lg"
                placeholder="عنوان المقالة"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                الملخص <span className="text-red-500">*</span>
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                placeholder="ملخص قصير للمقالة"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                المحتوى <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  modules={quillModules}
                  className="bg-white"
                  style={{ minHeight: '400px' }}
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                التصنيفات
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <label
                    key={category._id}
                    className="flex items-center space-x-2 space-x-reverse p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category._id)}
                      onChange={() => handleCategoryChange(category._id)}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-sm">{category.nameAr}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                الوسوم
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                placeholder="وسوم مفصولة بفواصل، مثال: تاريخ، ثقافة، صنعاء"
              />
              <p className="text-sm text-gray-500 mt-1">افصل الوسوم بفواصل</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                الحالة
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              >
                <option value="draft">مسودة</option>
                <option value="pending">قيد المراجعة</option>
                {(user.role === 'admin' || user.role === 'editor') && (
                  <option value="published">منشور</option>
                )}
              </select>
            </div>

            {/* Featured (Admin/Editor only) */}
            {(user.role === 'admin' || user.role === 'editor') && (
              <div>
                <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-gray-700 font-bold">مقالة مميزة</span>
                </label>
              </div>
            )}

            {/* Revision Comment */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                ملاحظات التعديل (اختياري)
              </label>
              <input
                type="text"
                name="revisionComment"
                value={formData.revisionComment || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                placeholder="صف التغييرات التي قمت بها"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 space-x-reverse bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <FiSave />
                    <span>حفظ التغييرات</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .loading-spinner-small {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 2px solid #ffffff;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EditArticlePage;
