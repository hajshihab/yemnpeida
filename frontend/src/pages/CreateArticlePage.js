import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ArticleEditor from '../components/ArticleEditor';

const CreateArticlePage = () => {
  const { isAuthenticated, isEditor, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isEditor) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          ليس لديك صلاحية التحرير
        </h1>
        <p className="text-gray-600 mb-6">
          الرجاء التواصل مع الإدارة للحصول على صلاحيات المحرر
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ArticleEditor />
    </div>
  );
};

export default CreateArticlePage;
