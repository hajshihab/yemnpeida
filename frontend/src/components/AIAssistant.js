import React, { useState } from 'react';
import { aiAPI } from '../services/api';
import { FiSend, FiLoader } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

const AIAssistant = ({ context = '' }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'مرحباً! أنا يمن بيديا، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟ يمكنني مساعدتك في البحث عن المعلومات، الإجابة على الأسئلة، أو مساعدتك في كتابة وتحسين المقالات.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userMessage = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await aiAPI.ask(question, context);
      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        relatedArticles: response.data.relatedArticles,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'عذراً، حدث خطأ أثناء معالجة سؤالك. الرجاء المحاولة مرة أخرى.',
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-primary-600 text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-xl font-bold">🤖 يمن بيديا - المساعد الذكي</h2>
        <p className="text-sm opacity-90">مساعدك الشخصي في الموسوعة اليمنية</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-gray-100 text-gray-800'
                  : message.isError
                  ? 'bg-red-50 text-red-800'
                  : 'bg-primary-50 text-gray-800'
              }`}
            >
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>

              {message.relatedArticles && message.relatedArticles.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm font-semibold mb-2">مقالات ذات صلة:</p>
                  <ul className="space-y-1">
                    {message.relatedArticles.map((article, idx) => (
                      <li key={idx} className="text-sm">
                        <a
                          href={`/article/${article.slug}`}
                          className="text-primary-600 hover:underline"
                        >
                          📄 {article.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-end">
            <div className="bg-primary-50 rounded-lg p-4">
              <FiLoader className="animate-spin text-primary-600" size={24} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex space-x-2 space-x-reverse">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="اسأل يمن بيديا أي سؤال..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 space-x-reverse"
          >
            <FiSend />
            <span>إرسال</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIAssistant;
