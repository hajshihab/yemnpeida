import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiGlobe, FiBook, FiFileText, FiArchive, FiStar } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SourcesPage = () => {
  const [sources, setSources] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSources();
  }, [filter]);

  const loadSources = async () => {
    try {
      const params = {};
      if (filter === 'official') params.isOfficial = true;
      if (filter === 'verified') params.verified = true;

      const response = await axios.get(`${API_URL}/sources`, { params });
      setSources(response.data.sources || []);
    } catch (error) {
      console.error('Failed to load sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'government': return '🏛️';
      case 'academic': return '🎓';
      case 'news': return '📰';
      case 'book': return '📚';
      case 'archive': return '📦';
      default: return '🌐';
    }
  };

  const getTypeName = (type) => {
    const types = {
      government: 'حكومي',
      academic: 'أكاديمي',
      news: 'إخباري',
      book: 'كتاب',
      archive: 'أرشيف',
      website: 'موقع',
      other: 'أخرى'
    };
    return types[type] || type;
  };

  const getReliabilityStars = (reliability) => {
    return Array(5).fill(0).map((_, i) => (
      <FiStar
        key={i}
        className={i < reliability ? 'text-yellow-500 fill-current' : 'text-gray-300'}
        size={16}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const officialSources = sources.filter(s => s.isOfficial);
  const verifiedSources = sources.filter(s => s.verified && !s.isOfficial);
  const otherSources = sources.filter(s => !s.verified);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">📚 المصادر والمراجع</h1>
          <p className="text-xl text-center opacity-90 max-w-3xl mx-auto">
            مصادر موثوقة للمعلومات اليمنية من جهات حكومية، أكاديمية، وإخبارية معتمدة
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex justify-center space-x-4 space-x-reverse mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            الكل ({sources.length})
          </button>
          <button
            onClick={() => setFilter('official')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'official'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            مصادر رسمية ({officialSources.length})
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === 'verified'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            موثقة ({verifiedSources.length})
          </button>
        </div>

        {/* Official Sources */}
        {(filter === 'all' || filter === 'official') && officialSources.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 space-x-reverse">
              <span>🏛️</span>
              <span>مصادر حكومية رسمية</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {officialSources.map((source) => (
                <SourceCard key={source._id} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* Verified Sources */}
        {(filter === 'all' || filter === 'verified') && verifiedSources.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 space-x-reverse">
              <FiCheckCircle className="text-green-600" />
              <span>مصادر موثقة</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verifiedSources.map((source) => (
                <SourceCard key={source._id} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* Other Sources */}
        {filter === 'all' && otherSources.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">مصادر أخرى</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherSources.map((source) => (
                <SourceCard key={source._id} source={source} />
              ))}
            </div>
          </div>
        )}

        {sources.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">لا توجد مصادر حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SourceCard = ({ source }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'government': return '🏛️';
      case 'academic': return '🎓';
      case 'news': return '📰';
      case 'book': return '📚';
      case 'archive': return '📦';
      default: return '🌐';
    }
  };

  const getTypeName = (type) => {
    const types = {
      government: 'حكومي',
      academic: 'أكاديمي',
      news: 'إخباري',
      book: 'كتاب',
      archive: 'أرشيف',
      website: 'موقع',
      other: 'أخرى'
    };
    return types[type] || type;
  };

  const getReliabilityStars = (reliability) => {
    return Array(5).fill(0).map((_, i) => (
      <FiStar
        key={i}
        className={i < reliability ? 'text-yellow-500 fill-current' : 'text-gray-300'}
        size={16}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
      {/* Badges */}
      <div className="flex items-center space-x-2 space-x-reverse mb-3">
        <span className="text-2xl">{getTypeIcon(source.type)}</span>
        {source.isOfficial && (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
            رسمي
          </span>
        )}
        {source.verified && (
          <FiCheckCircle className="text-green-600" size={18} />
        )}
      </div>

      {/* Name */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{source.nameAr}</h3>
      <p className="text-sm text-gray-500 mb-3">{source.name}</p>

      {/* Description */}
      {source.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{source.description}</p>
      )}

      {/* Type */}
      <div className="flex items-center space-x-2 space-x-reverse mb-2">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          {getTypeName(source.type)}
        </span>
      </div>

      {/* Reliability */}
      <div className="flex items-center space-x-1 space-x-reverse mb-4">
        {getReliabilityStars(source.reliability)}
      </div>

      {/* Website */}
      {source.website && (
        <a
          href={source.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 space-x-reverse text-primary-600 hover:underline text-sm"
        >
          <FiGlobe size={16} />
          <span>زيارة الموقع</span>
        </a>
      )}
    </div>
  );
};

export default SourcesPage;
