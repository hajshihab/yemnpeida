const express = require('express');
const router = express.Router();
const Source = require('../models/Source');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get all sources
router.get('/', async (req, res) => {
  try {
    const { type, verified, isOfficial } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (verified) filter.verified = verified === 'true';
    if (isOfficial) filter.isOfficial = isOfficial === 'true';

    const sources = await Source.find(filter).sort({ reliability: -1, nameAr: 1 });

    res.json({
      success: true,
      sources
    });
  } catch (error) {
    console.error('Get sources error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المصادر'
    });
  }
});

// Get single source
router.get('/:id', async (req, res) => {
  try {
    const source = await Source.findById(req.params.id);

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'المصدر غير موجود'
      });
    }

    res.json({
      success: true,
      source
    });
  } catch (error) {
    console.error('Get source error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المصدر'
    });
  }
});

// Create source (admin only)
router.post('/', [authenticate, isAdmin], async (req, res) => {
  try {
    const source = new Source(req.body);
    await source.save();

    res.status(201).json({
      success: true,
      message: 'تم إضافة المصدر بنجاح',
      source
    });
  } catch (error) {
    console.error('Create source error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إضافة المصدر'
    });
  }
});

// Update source (admin only)
router.put('/:id', [authenticate, isAdmin], async (req, res) => {
  try {
    const source = await Source.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'المصدر غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم تحديث المصدر بنجاح',
      source
    });
  } catch (error) {
    console.error('Update source error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث المصدر'
    });
  }
});

// Delete source (admin only)
router.delete('/:id', [authenticate, isAdmin], async (req, res) => {
  try {
    const source = await Source.findByIdAndDelete(req.params.id);

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'المصدر غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف المصدر بنجاح'
    });
  } catch (error) {
    console.error('Delete source error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف المصدر'
    });
  }
});

module.exports = router;
