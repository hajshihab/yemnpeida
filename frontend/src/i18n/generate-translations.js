// Script to generate translation files for all supported languages
const fs = require('fs');
const path = require('path');

// Base translation template (simplified for quick generation)
const generateTranslation = (languageCode, languageName) => ({
  "siteName": "Yemen-Pedia",
  "siteDescription": `The Comprehensive Yemeni Encyclopedia - ${languageName}`,
  "nav": {
    "home": "Home",
    "articles": "Articles",
    "categories": "Categories",
    "about": "About",
    "login": "Login",
    "register": "Register",
    "profile": "Profile",
    "admin": "Editor Panel",
    "superAdmin": "Admin Panel",
    "logout": "Logout",
    "search": "Search...",
    "language": "Language"
  },
  "home": {
    "welcome": "Welcome to Yemen-Pedia",
    "subtitle": "A comprehensive Yemeni encyclopedia",
    "explore": "Explore Articles",
    "latestArticles": "Latest Articles",
    "featuredArticles": "Featured Articles",
    "popularCategories": "Popular Categories",
    "statistics": "Statistics",
    "totalArticles": "Articles",
    "totalCategories": "Categories",
    "totalContributors": "Contributors",
    "totalViews": "Views"
  },
  "article": {
    "readMore": "Read More",
    "views": "Views",
    "author": "Author",
    "publishedOn": "Published on",
    "category": "Category",
    "tags": "Tags",
    "sources": "Sources",
    "relatedArticles": "Related Articles",
    "edit": "Edit",
    "delete": "Delete",
    "share": "Share",
    "saveForLater": "Save for Later",
    "noArticlesFound": "No articles found",
    "loading": "Loading...",
    "error": "An error occurred",
    "createNew": "Create New Article"
  },
  "editor": {
    "title": "Article Title",
    "summary": "Article Summary",
    "content": "Article Content",
    "selectCategory": "Select Category",
    "addTags": "Add Tags",
    "addImages": "Add Images",
    "addSources": "Add Sources",
    "saveDraft": "Save as Draft",
    "publish": "Publish Article",
    "preview": "Preview",
    "cancel": "Cancel",
    "featured": "Featured Article",
    "language": "Article Language"
  },
  "auth": {
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "username": "Username",
    "fullName": "Full Name",
    "loginTitle": "Login",
    "registerTitle": "Create New Account",
    "forgotPassword": "Forgot Password?",
    "noAccount": "Don't have an account?",
    "haveAccount": "Already have an account?",
    "loginHere": "Login here",
    "registerHere": "Register here",
    "loginButton": "Login",
    "registerButton": "Register",
    "loggingIn": "Logging in...",
    "registering": "Registering..."
  },
  "admin": {
    "dashboard": "Dashboard",
    "users": "Users",
    "articles": "Articles",
    "categories": "Categories",
    "sources": "Sources",
    "statistics": "Statistics",
    "settings": "Settings",
    "pendingReview": "Pending Review",
    "approved": "Approved",
    "rejected": "Rejected",
    "role": "Role",
    "user": "User",
    "editor": "Editor",
    "admin": "Admin",
    "superAdmin": "Super Admin",
    "status": "Status",
    "actions": "Actions",
    "approve": "Approve",
    "reject": "Reject",
    "edit": "Edit",
    "delete": "Delete",
    "view": "View"
  },
  "categories": {
    "history": "History",
    "geography": "Geography",
    "culture": "Culture",
    "literature": "Literature",
    "arts": "Arts",
    "architecture": "Architecture",
    "cuisine": "Cuisine",
    "personalities": "Personalities",
    "cities": "Cities",
    "tourism": "Tourism",
    "economy": "Economy",
    "society": "Society",
    "language": "Language",
    "religion": "Religion",
    "nature": "Nature"
  },
  "footer": {
    "about": "About Yemen-Pedia",
    "aboutText": "A comprehensive open-source Yemeni encyclopedia",
    "quickLinks": "Quick Links",
    "contact": "Contact Us",
    "followUs": "Follow Us",
    "copyright": "All Rights Reserved",
    "license": "Licensed under",
    "contribute": "Contribute",
    "documentation": "Documentation",
    "apiDocs": "API Documentation"
  },
  "search": {
    "placeholder": "Search articles...",
    "results": "Search Results",
    "noResults": "No results found",
    "searchIn": "Search in",
    "allCategories": "All Categories",
    "sortBy": "Sort by",
    "relevance": "Relevance",
    "newest": "Newest",
    "oldest": "Oldest",
    "popular": "Most Popular"
  },
  "profile": {
    "myProfile": "My Profile",
    "myArticles": "My Articles",
    "savedArticles": "Saved Articles",
    "editProfile": "Edit Profile",
    "changePassword": "Change Password",
    "contributions": "Contributions",
    "joinedOn": "Joined on",
    "bio": "About me"
  },
  "ai": {
    "assistant": "AI Assistant",
    "askQuestion": "Ask a question about Yemen...",
    "thinking": "Thinking...",
    "noResponse": "I couldn't answer this question",
    "suggestions": "Suggestions",
    "improveArticle": "Improve Article",
    "generateSummary": "Generate Summary",
    "translate": "Translate"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "view": "View",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "warning": "Warning",
    "info": "Info",
    "confirm": "Confirm",
    "yes": "Yes",
    "no": "No",
    "close": "Close",
    "more": "More",
    "less": "Less",
    "all": "All",
    "none": "None",
    "select": "Select",
    "upload": "Upload",
    "download": "Download",
    "share": "Share",
    "copy": "Copy",
    "copied": "Copied"
  },
  "messages": {
    "loginSuccess": "Login successful",
    "loginError": "Login error",
    "registerSuccess": "Registration successful",
    "registerError": "Registration error",
    "articleSaved": "Article saved successfully",
    "articlePublished": "Article published successfully",
    "articleDeleted": "Article deleted",
    "confirmDelete": "Are you sure you want to delete?",
    "unauthorized": "Unauthorized",
    "notFound": "Not found",
    "serverError": "Server error"
  }
});

// Languages to generate (code: name)
const languages = {
  'es': 'Spanish / Español',
  'de': 'German / Deutsch',
  'it': 'Italian / Italiano',
  'pt': 'Portuguese / Português',
  'ru': 'Russian / Русский',
  'zh': 'Chinese / 中文',
  'ja': 'Japanese / 日本語',
  'ko': 'Korean / 한국어',
  'hi': 'Hindi / हिन्दी',
  'bn': 'Bengali / বাংলা',
  'ur': 'Urdu / اردو',
  'tr': 'Turkish / Türkçe',
  'fa': 'Persian / فارسی',
  'id': 'Indonesian / Bahasa Indonesia',
  'ms': 'Malay / Bahasa Melayu',
  'sw': 'Swahili / Kiswahili',
  'nl': 'Dutch / Nederlands'
};

const translationsDir = path.join(__dirname, 'translations');

// Create translations directory if it doesn't exist
if (!fs.existsSync(translationsDir)) {
  fs.mkdirSync(translationsDir, { recursive: true });
}

// Generate translation files
Object.entries(languages).forEach(([code, name]) => {
  const filePath = path.join(translationsDir, `${code}.json`);

  // Skip if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${name} (${code}) - already exists`);
    return;
  }

  const content = generateTranslation(code, name);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`✓ Generated ${name} (${code})`);
});

console.log('\n✅ Translation files generation complete!');
console.log(`📁 Location: ${translationsDir}`);
console.log(`🌍 Total languages: ${Object.keys(languages).length + 3} (including ar, en, fr)`);
