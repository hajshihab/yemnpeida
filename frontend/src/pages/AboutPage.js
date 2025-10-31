import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiUsers, FiHeart, FiTrendingUp, FiGlobe, FiAward } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🇾🇪 عن يمن بيديا</h1>
          <p className="text-2xl opacity-90">الموسوعة اليمنية الحرة للجميع</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Mission */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3 space-x-reverse">
              <FiBook className="text-primary-600" />
              <span>مهمتنا</span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              <strong>يمن بيديا</strong> هي موسوعة يمنية حرة ومفتوحة المصدر، تهدف إلى جمع وتوثيق المعرفة اليمنية
              في مكان واحد. نسعى لتوفير مصدر موثوق وشامل للمعلومات عن اليمن في جميع المجالات: التاريخ، الجغرافيا،
              الثقافة، الأدب، الفن، وغيرها.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              مع دعم <strong>مساعد ذكاء صناعي متكامل</strong> يساعد القراء في البحث والاستكشاف، ويساعد المحررين
              في الكتابة والتحسين.
            </p>
          </div>

          {/* Values */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6">قيمنا</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3 space-x-reverse">
                <FiGlobe className="text-blue-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-2">الحرية والانفتاح</h3>
                  <p className="text-gray-600">موسوعة حرة ومفتوحة للجميع، يمكن لأي شخص المساهمة والتحرير.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <FiAward className="text-yellow-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-2">الجودة والدقة</h3>
                  <p className="text-gray-600">نحرص على المعلومات الموثوقة والمدعومة بمراجع موثوقة.</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 space-x-reverse">
                <FiUsers className="text-green-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-2">المجتمع</h3>
                  <p className="text-gray-600">نبني مجتمعاً من المحررين والقراء المهتمين باليمن.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <FiHeart className="text-red-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg mb-2">حب اليمن</h3>
                  <p className="text-gray-600">كل ما نفعله من أجل حفظ التراث اليمني ونشر المعرفة.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6">ما يميز يمن بيديا؟</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">مساعد ذكاء صناعي</h3>
                  <p className="text-gray-600">مساعد "يمن بيديا" الذكي يساعدك في البحث والاستكشاف والكتابة.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">15 تصنيف يمني متخصص</h3>
                  <p className="text-gray-600">من التاريخ والجغرافيا إلى الثقافة والفن والمطبخ اليمني.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                  <span className="text-2xl">🏛️</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">مصادر رسمية موثوقة</h3>
                  <p className="text-gray-600">قاعدة بيانات من المصادر اليمنية الرسمية والأكاديمية.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                  <span className="text-2xl">📖</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">واجهة احترافية</h3>
                  <p className="text-gray-600">تصميم عصري بنكهة يمنية، مع دعم كامل للغة العربية.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-center">إحصائيات المنصة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">15</div>
                <div className="opacity-90">تصنيف</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">10+</div>
                <div className="opacity-90">مصادر موثوقة</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">∞</div>
                <div className="opacity-90">مقالات</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1</div>
                <div className="opacity-90">مساعد ذكي</div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6">من نحن؟</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              يمن بيديا مشروع مجتمعي مفتوح المصدر. نحن مجموعة من المحررين والمطورين المتطوعين الذين
              يؤمنون بأهمية توثيق التراث والمعرفة اليمنية.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              يمكنك المساهمة معنا! سواء كنت محرراً، مطوراً، مصمماً، أو مهتماً بالتراث اليمني،
              لديك مكان معنا.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-primary-600 text-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">انضم إلينا!</h2>
            <p className="text-lg mb-6 opacity-90">
              ساهم في بناء أكبر موسوعة يمنية على الإنترنت
            </p>
            <div className="flex justify-center space-x-4 space-x-reverse">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                إنشاء حساب
              </Link>
              <Link
                to="/create"
                className="bg-primary-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-800 transition"
              >
                ابدأ الكتابة
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
