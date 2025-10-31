const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Article = require('../models/Article');
const User = require('../models/User');
const { authenticate, optionalAuth, isEditor } = require('../middleware/auth');

// Get all articles (with pagination and filters)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { category, tag, status, featured } = req.query;

    const filter = {};
    if (status) filter.status = status;
    else filter.status = 'published'; // Default to published only

    if (category) filter.categories = category;
    if (tag) filter.tags = tag;
    if (featured) filter.featured = featured === 'true';

    const articles = await Article.find(filter)
      .select('-content -revisions')
      .populate('author', 'username displayName avatar')
      .populate('categories', 'name nameAr slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments(filter);

    res.json({
      success: true,
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المقالات'
    });
  }
});

// Get single article by slug
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate('author', 'username displayName avatar bio')
      .populate('categories', 'name nameAr slug')
      .populate('lastEditedBy', 'username displayName')
      .populate('relatedArticles', 'title slug summary');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'المقالة غير موجودة'
      });
    }

    // Increment views
    article.views += 1;
    await article.save();

    res.json({
      success: true,
      article
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المقالة'
    });
  }
});

// Create new article
router.post('/', [authenticate, isEditor], [
  body('title').trim().notEmpty().withMessage('العنوان مطلوب'),
  body('content').notEmpty().withMessage('المحتوى مطلوب'),
  body('slug').trim().notEmpty().withMessage('الرابط مطلوب')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { title, slug, content, summary, categories, tags, status, images, references } = req.body;

    // Check if slug already exists
    const existing = await Article.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'الرابط موجود مسبقاً'
      });
    }

    const article = new Article({
      title,
      slug,
      content,
      summary,
      author: req.userId,
      categories,
      tags,
      status: status || 'draft',
      images,
      references,
      lastEditedBy: req.userId,
      lastEditedAt: new Date()
    });

    if (status === 'published') {
      article.publishedAt = new Date();
    }

    await article.save();

    // Update user contributions
    await User.findByIdAndUpdate(req.userId, {
      $inc: { contributions: 1 }
    });

    const populatedArticle = await Article.findById(article._id)
      .populate('author', 'username displayName avatar')
      .populate('categories', 'name nameAr slug');

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المقالة بنجاح',
      article: populatedArticle
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء المقالة'
    });
  }
});

// Update article
router.put('/:id', [authenticate, isEditor], async (req, res) => {
  try {
    const { title, content, summary, categories, tags, status, images, references } = req.body;

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'المقالة غير موجودة'
      });
    }

    // Update fields
    if (title) article.title = title;
    if (content) article.content = content;
    if (summary !== undefined) article.summary = summary;
    if (categories) article.categories = categories;
    if (tags) article.tags = tags;
    if (status) article.status = status;
    if (images) article.images = images;
    if (references) article.references = references;

    article.lastEditedBy = req.userId;
    article.lastEditedAt = new Date();

    if (status === 'published' && !article.publishedAt) {
      article.publishedAt = new Date();
    }

    await article.save();

    const populatedArticle = await Article.findById(article._id)
      .populate('author', 'username displayName avatar')
      .populate('categories', 'name nameAr slug')
      .populate('lastEditedBy', 'username displayName');

    res.json({
      success: true,
      message: 'تم تحديث المقالة بنجاح',
      article: populatedArticle
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث المقالة'
    });
  }
});

// Get article revisions
router.get('/:id/revisions', authenticate, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .select('title revisions')
      .populate('revisions.editor', 'username displayName');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'المقالة غير موجودة'
      });
    }

    res.json({
      success: true,
      revisions: article.revisions.reverse()
    });
  } catch (error) {
    console.error('Get revisions error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب النسخ السابقة'
    });
  }
});

// Delete article
router.delete('/:id', [authenticate, isEditor], async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'المقالة غير موجودة'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف المقالة بنجاح'
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف المقالة'
    });
  }
});

module.exports = router;
