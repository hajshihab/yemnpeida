import React from 'react';
import AIAssistant from '../components/AIAssistant';

const AIAssistantPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">المساعد الذكي - يمن بيديا</h1>
          <p className="text-gray-600">
            اطرح أسئلتك حول اليمن واحصل على إجابات دقيقة من المساعد الذكي المتخصص
          </p>
        </div>

        <div className="h-[600px]">
          <AIAssistant />
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="font-bold text-lg mb-3">💡 نصائح لاستخدام المساعد الذكي:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• اطرح أسئلة واضحة ومحددة للحصول على إجابات أفضل</li>
            <li>• يمكن للمساعد مساعدتك في البحث عن المعلومات في الموسوعة</li>
            <li>• استخدم المساعد لتحسين مقالاتك والحصول على اقتراحات</li>
            <li>• المساعد متخصص في المعلومات اليمنية والموسوعية</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
