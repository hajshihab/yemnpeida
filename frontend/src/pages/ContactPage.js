import React, { useState } from 'react';
import { FiMail, FiUser, FiMessageSquare, FiSend, FiPhone, FiMapPin, FiGlobe, FiCheckCircle } from 'react-icons/fi';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    // Simulate sending (in real app, this would call an API)
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 space-x-reverse mb-4">
            <FiMail size={48} />
            <h1 className="text-4xl font-bold">اتصل بنا</h1>
          </div>
          <p className="text-xl text-center opacity-90">
            نحن هنا للاستماع إليك ومساعدتك
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">أرسل رسالة</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3 space-x-reverse text-green-800">
                  <FiCheckCircle size={24} />
                  <div>
                    <p className="font-semibold">تم إرسال رسالتك بنجاح!</p>
                    <p className="text-sm">سنقوم بالرد عليك في أقرب وقت ممكن.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <span className="flex items-center space-x-2 space-x-reverse">
                      <FiUser />
                      <span>الاسم الكامل</span>
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <span className="flex items-center space-x-2 space-x-reverse">
                      <FiMail />
                      <span>البريد الإلكتروني</span>
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <span className="flex items-center space-x-2 space-x-reverse">
                      <FiMessageSquare />
                      <span>الموضوع</span>
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                    placeholder="موضوع الرسالة"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <span className="flex items-center space-x-2 space-x-reverse">
                      <FiMessageSquare />
                      <span>الرسالة</span>
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      <span>جارٍ الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <FiSend />
                      <span>إرسال الرسالة</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">معلومات الاتصال</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <FiMail className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">البريد الإلكتروني</h4>
                    <p className="text-gray-600 text-sm">info@yemenpedia.org</p>
                    <p className="text-gray-600 text-sm">support@yemenpedia.org</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <FiPhone className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">الهاتف</h4>
                    <p className="text-gray-600 text-sm" dir="ltr">+967 1 234 567</p>
                    <p className="text-gray-600 text-sm" dir="ltr">+967 777 123 456</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <FiMapPin className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">العنوان</h4>
                    <p className="text-gray-600 text-sm">صنعاء، اليمن</p>
                    <p className="text-gray-600 text-sm">شارع الزبيري</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <FiGlobe className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">الموقع</h4>
                    <p className="text-gray-600 text-sm">www.yemenpedia.org</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">تابعنا</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    f
                  </div>
                  <span className="text-gray-700">فيسبوك</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white">
                    t
                  </div>
                  <span className="text-gray-700">تويتر</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                    i
                  </div>
                  <span className="text-gray-700">إنستغرام</span>
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">ساعات العمل</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">السبت - الخميس</span>
                  <span className="text-gray-600">8:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">الجمعة</span>
                  <span className="text-gray-600">مغلق</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-primary-800 mb-2">لديك سؤال؟</h3>
          <p className="text-gray-700 mb-4">
            قد تجد إجابتك في صفحة الأسئلة الشائعة
          </p>
          <a
            href="/help"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            اذهب إلى المساعدة
          </a>
        </div>
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

export default ContactPage;
