import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHelpCircle, FiBook, FiEdit, FiSearch, FiMessageSquare, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'ما هي يمن بيديا؟',
      answer: 'يمن بيديا هي موسوعة يمنية حرة ومفتوحة المصدر، تهدف إلى جمع وتوثيق المعرفة اليمنية في جميع المجالات. تحتوي على مساعد ذكاء صناعي متكامل يساعد في البحث والكتابة.'
    },
    {
      id: 2,
      question: 'كيف يمكنني إنشاء حساب؟',
      answer: 'انقر على "إنشاء حساب" في أعلى الصفحة، ثم املأ النموذج بالمعلومات المطلوبة (اسم المستخدم، البريد الإلكتروني، كلمة المرور). بعد التسجيل يمكنك تسجيل الدخول والبدء في المساهمة.'
    },
    {
      id: 3,
      question: 'كيف أكتب مقالة جديدة؟',
      answer: 'بعد تسجيل الدخول كمحرر، انقر على "مقالة جديدة" في القائمة. اختر عنواناً مناسباً، اكتب المحتوى، أضف المراجع والتصنيفات، ثم اضغط "نشر".'
    },
    {
      id: 4,
      question: 'ما الفرق بين المستخدم والمحرر والمدير؟',
      answer: 'المستخدم العادي: يمكنه القراءة والبحث واستخدام المساعد الذكي. المحرر: يمكنه إنشاء وتحرير المقالات. المدير: يمكنه إدارة التصنيفات والمستخدمين وجميع المحتوى.'
    },
    {
      id: 5,
      question: 'كيف أستخدم المساعد الذكي؟',
      answer: 'اذهب إلى صفحة "المساعد الذكي" من القائمة، ثم اكتب سؤالك في المربع. المساعد سيبحث في الموسوعة ويقدم لك إجابة دقيقة مع مقالات ذات صلة.'
    },
    {
      id: 6,
      question: 'كيف أضيف مراجع لمقالتي؟',
      answer: 'أثناء كتابة المقالة، في قسم "المراجع"، أضف عنوان المرجع، المؤلف، الرابط إن وجد، والتاريخ. المراجع الموثوقة تزيد من مصداقية المقالة.'
    },
    {
      id: 7,
      question: 'ما هي البوابات؟',
      answer: 'البوابات هي صفحات مخصصة لكل تصنيف (مثل بوابة التاريخ، بوابة الثقافة). كل بوابة تعرض جميع المقالات في ذلك التصنيف مع إحصائيات ومقالات مميزة.'
    },
    {
      id: 8,
      question: 'كيف أصبح محرراً؟',
      answer: 'حالياً، يجب عليك إنشاء حساب أولاً. بعد ذلك، تواصل مع أحد المديرين لتحويل حسابك إلى محرر. في المستقبل سيتم إضافة نظام طلبات تلقائي.'
    },
    {
      id: 9,
      question: 'هل يمكنني تعديل مقالات الآخرين؟',
      answer: 'نعم! إذا كنت محرراً أو مديراً، يمكنك تعديل أي مقالة. هذا جزء من الفكرة التعاونية للموسوعة. لكن احرص على تحسين المحتوى وليس العبث به.'
    },
    {
      id: 10,
      question: 'ما هي المصادر الموثوقة؟',
      answer: 'المصادر الموثوقة هي المراجع الرسمية والأكاديمية والموثقة. يمكنك الاطلاع على قائمة المصادر الموثوقة في صفحة "المصادر".'
    }
  ];

  const guides = [
    {
      icon: <FiBook className="text-blue-600" size={32} />,
      title: 'البدء السريع',
      description: 'تعلم كيفية استخدام يمن بيديا في 5 دقائق',
      link: '/guide/quickstart'
    },
    {
      icon: <FiEdit className="text-green-600" size={32} />,
      title: 'دليل التحرير',
      description: 'كيف تكتب مقالة احترافية',
      link: '/guide/editing'
    },
    {
      icon: <FiSearch className="text-purple-600" size={32} />,
      title: 'البحث المتقدم',
      description: 'نصائح للحصول على أفضل نتائج بحث',
      link: '/guide/search'
    },
    {
      icon: <FiMessageSquare className="text-yellow-600" size={32} />,
      title: 'المساعد الذكي',
      description: 'كيف تستفيد من المساعد الذكي',
      link: '/ai-assistant'
    }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <FiHelpCircle className="mx-auto mb-4" size={64} />
          <h1 className="text-4xl font-bold mb-4">مركز المساعدة</h1>
          <p className="text-xl opacity-90">كل ما تحتاج معرفته عن يمن بيديا</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Quick Search */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
            <h2 className="text-xl font-bold mb-4">ابحث عن إجابة</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث في الأسئلة الشائعة..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Guides */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">الأدلة الإرشادية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {guides.map((guide, index) => (
                <a
                  key={index}
                  href={guide.link}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 text-center"
                >
                  <div className="mb-4 flex justify-center">{guide.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{guide.title}</h3>
                  <p className="text-sm text-gray-600">{guide.description}</p>
                </a>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-3xl font-bold mb-6">الأسئلة الشائعة</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-right hover:bg-gray-50 transition"
                  >
                    <span className="font-semibold text-lg">{faq.question}</span>
                    {openFaq === faq.id ? (
                      <FiChevronUp className="text-primary-600 flex-shrink-0" size={24} />
                    ) : (
                      <FiChevronDown className="text-gray-400 flex-shrink-0" size={24} />
                    )}
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="mt-12 bg-primary-600 text-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">لم تجد إجابة؟</h2>
            <p className="text-lg mb-6 opacity-90">
              تواصل معنا وسنساعدك في أقرب وقت ممكن
            </p>
            <div className="flex justify-center space-x-4 space-x-reverse">
              <Link
                to="/contact"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                اتصل بنا
              </Link>
              <Link
                to="/ai-assistant"
                className="bg-primary-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-800 transition"
              >
                اسأل المساعد الذكي
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
