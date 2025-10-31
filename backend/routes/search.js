const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { optionalAuth } = require('../middleware/auth');

// Search articles
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { q, category, tag, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال كلمة بحث (حرفين على الأقل)'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build search query
    const searchQuery = {
      $text: { $search: q },
      status: 'published'
    };

    if (category) {
      searchQuery.categories = category;
    }

    if (tag) {
      searchQuery.tags = tag;
    }

    // Execute search
    const articles = await Article.find(
      searchQuery,
      { score: { $meta: 'textScore' } }
    )
      .select('title slug summary tags createdAt views')
      .populate('author', 'username displayName')
      .populate('categories', 'name nameAr slug')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Article.countDocuments(searchQuery);

    res.json({
      success: true,
      query: q,
      results: articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء البحث'
    });
  }
});

// Autocomplete suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const suggestions = await Article.find({
      title: { $regex: q, $options: 'i' },
      status: 'published'
    })
      .select('title slug')
      .limit(5);

    res.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الاقتراحات'
    });
  }
});

module.exports = router;
