import React from 'react';
import { FiBookmark, FiExternalLink, FiCalendar, FiUser } from 'react-icons/fi';

const CitationBox = ({ references }) => {
  if (!references || references.length === 0) return null;

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ar-YE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="mt-8 pt-6 border-t-2 border-gray-300">
      <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 space-x-reverse">
        <FiBookmark className="text-primary-600" />
        <span>المراجع والمصادر</span>
      </h2>

      <div className="space-y-4">
        {references.map((ref, index) => (
          <div
            key={index}
            className="bg-gray-50 border-r-4 border-primary-500 p-4 rounded-lg hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Reference Number */}
                <span className="inline-block bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                  [{index + 1}]
                </span>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {ref.url ? (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline flex items-center space-x-2 space-x-reverse"
                    >
                      <span>{ref.title}</span>
                      <FiExternalLink size={16} />
                    </a>
                  ) : (
                    ref.title
                  )}
                </h3>

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {ref.author && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <FiUser size={14} />
                      <span>{ref.author}</span>
                    </div>
                  )}

                  {ref.publisher && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <FiBookmark size={14} />
                      <span>{ref.publisher}</span>
                    </div>
                  )}

                  {ref.date && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <FiCalendar size={14} />
                      <span>{formatDate(ref.date)}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {ref.description && (
                  <p className="mt-2 text-sm text-gray-700">{ref.description}</p>
                )}

                {/* Access Date */}
                {ref.accessDate && (
                  <p className="mt-2 text-xs text-gray-500">
                    تاريخ الوصول: {formatDate(ref.accessDate)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Citation Template */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 كيفية الاستشهاد بهذه المقالة:</h4>
        <div className="bg-white p-3 rounded border border-blue-200 text-sm font-mono">
          <p className="text-gray-700">
            "عنوان المقالة"، يمن بيديا، تاريخ الوصول:{' '}
            {new Date().toLocaleDateString('ar-YE')}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CitationBox;
