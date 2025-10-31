const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parent', 'name nameAr slug')
      .sort({ order: 1, nameAr: 1 });

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب التصنيفات'
    });
  }
});

// Get category by slug
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parent', 'name nameAr slug');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'التصنيف غير موجود'
      });
    }

    res.json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب التصنيف'
    });
  }
});

// Create category (admin only)
router.post('/', [authenticate, isAdmin], async (req, res) => {
  try {
    const { name, nameAr, slug, description, parent, icon, color, order } = req.body;

    const category = new Category({
      name,
      nameAr,
      slug,
      description,
      parent,
      icon,
      color,
      order
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'تم إنشاء التصنيف بنجاح',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء التصنيف'
    });
  }
});

// Update category (admin only)
router.put('/:id', [authenticate, isAdmin], async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'التصنيف غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم تحديث التصنيف بنجاح',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث التصنيف'
    });
  }
});

// Delete category (admin only)
router.delete('/:id', [authenticate, isAdmin], async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'التصنيف غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف التصنيف بنجاح'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف التصنيف'
    });
  }
});

module.exports = router;
