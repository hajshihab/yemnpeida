import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { articlesAPI, categoriesAPI, aiAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiEye, FiX, FiLoader } from 'react-icons/fi';

const ArticleEditor = ({ articleId = null, initialData = null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    summary: '',
    categories: [],
    tags: [],
    status: 'draft',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0600-\u06FF-]/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const getAISuggestions = async () => {
    if (!formData.content) return;

    setLoadingAI(true);
    try {
      const response = await aiAPI.suggestImprovements(formData.content, formData.title);
      setAiSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (status) => {
    setLoading(true);
    setError('');

    try {
      const data = { ...formData, status };

      if (articleId) {
        await articlesAPI.update(articleId, data);
      } else {
        await articlesAPI.create(data);
      }

      navigate('/my-articles');
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          {articleId ? 'تحرير المقالة' : 'مقالة جديدة'}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">العنوان *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                placeholder="عنوان المقالة"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-semibold mb-2">الرابط (Slug)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                placeholder="article-slug"
                required
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-semibold mb-2">الملخص</label>
              <textarea
                value={formData.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                rows="3"
                placeholder="ملخص مختصر للمقالة"
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-semibold mb-2">المحتوى *</label>
              <div className="border border-gray-300 rounded-lg" dir="rtl">
                <ReactQuill
                  value={formData.content}
                  onChange={(value) => handleChange('content', value)}
                  modules={modules}
                  theme="snow"
                  className="min-h-[400px]"
                  placeholder="ابدأ بكتابة المقالة..."
                />
              </div>
            </div>

            {/* AI Suggestions */}
            <div>
              <button
                type="button"
                onClick={getAISuggestions}
                disabled={loadingAI || !formData.content}
                className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loadingAI ? <FiLoader className="animate-spin" /> : <span>🤖</span>}
                <span>احصل على اقتراحات المساعد الذكي</span>
              </button>

              {aiSuggestions && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold mb-2">اقتراحات يمن بيديا:</h3>
                  <div className="prose prose-sm">{aiSuggestions}</div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Categories */}
            <div>
              <label className="block text-sm font-semibold mb-2">التصنيفات</label>
              <select
                multiple
                value={formData.categories}
                onChange={(e) =>
                  handleChange(
                    'categories',
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                size="5"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.nameAr}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">اضغط Ctrl لاختيار أكثر من تصنيف</p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold mb-2">الوسوم</label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                placeholder="وسم1, وسم2, وسم3"
              />
              <p className="text-xs text-gray-500 mt-1">افصل الوسوم بفواصل</p>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full flex items-center justify-center space-x-2 space-x-reverse bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                {showPreview ? <FiX /> : <FiEye />}
                <span>{showPreview ? 'إخفاء المعاينة' : 'معاينة'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 space-x-reverse bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
              >
                <FiSave />
                <span>حفظ كمسودة</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmit('published')}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 space-x-reverse bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                <FiSave />
                <span>نشر المقالة</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="mt-6 p-6 border-t">
            <h2 className="text-xl font-bold mb-4">معاينة المقالة</h2>
            <div className="prose max-w-none">
              <h1>{formData.title}</h1>
              {formData.summary && <p className="text-lg text-gray-600">{formData.summary}</p>}
              <div dangerouslySetInnerHTML={{ __html: formData.content }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleEditor;
