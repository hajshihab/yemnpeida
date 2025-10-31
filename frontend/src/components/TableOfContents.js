import React, { useState, useEffect } from 'react';
import { FiList } from 'react-icons/fi';

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Extract headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h1, h2, h3');

    const extractedHeadings = Array.from(headingElements).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1)),
    }));

    setHeadings(extractedHeadings);
  }, [content]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2 space-x-reverse">
          <FiList className="text-primary-600" />
          <h3 className="font-bold text-gray-800">المحتويات</h3>
        </div>
        <button className="text-gray-600 hover:text-gray-800">
          {isOpen ? '▼' : '▲'}
        </button>
      </div>

      {/* TOC List */}
      {isOpen && (
        <ol className="mt-3 space-y-2 list-decimal mr-5">
          {headings.map((heading, index) => (
            <li
              key={index}
              className={`text-sm cursor-pointer hover:text-primary-600 ${
                heading.level === 2 ? 'mr-0' : heading.level === 3 ? 'mr-4' : 'mr-0'
              }`}
              onClick={() => scrollToHeading(heading.id)}
            >
              <a className="text-blue-600 hover:underline">{heading.text}</a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default TableOfContents;
