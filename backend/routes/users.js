const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Middleware للتحقق من أن المستخدم مدير أو super admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Middleware للتحقق من أن المستخدم super admin فقط
const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied. Super Admin only.' });
  }
  next();
};

// GET all users (Admin only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const { role, editorStatus, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (role) query.role = role;
    if (editorStatus) query.editorStatus = editorStatus;
    if (search) {
      query.$or = [
        { username: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { displayName: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('editorApprovedBy', 'username displayName');

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET single user
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('editorApprovedBy', 'username displayName');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST request to become editor
router.post('/request-editor', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.role === 'editor' || user.role === 'admin' || user.role === 'super_admin') {
      return res.status(400).json({ message: 'You are already an editor or admin' });
    }

    if (user.editorStatus === 'pending') {
      return res.status(400).json({ message: 'Your editor request is already pending' });
    }

    user.editorStatus = 'pending';
    user.editorRequestDate = new Date();
    await user.save();

    res.json({ message: 'Editor request submitted successfully', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT approve/reject editor request (Admin only)
router.put('/editor-request/:id', auth, isAdmin, async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.editorStatus !== 'pending') {
      return res.status(400).json({ message: 'No pending editor request for this user' });
    }

    if (action === 'approve') {
      user.role = 'editor';
      user.editorStatus = 'approved';
      user.editorApprovedBy = req.user.id;
    } else if (action === 'reject') {
      user.editorStatus = 'rejected';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await user.save();

    res.json({
      message: `Editor request ${action}d successfully`,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT update user role (Super Admin only)
router.put('/role/:id', auth, isSuperAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'editor', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // منع تغيير دور المستخدم الرئيسي
    if (user.role === 'super_admin' && req.user.id !== user._id.toString()) {
      return res.status(403).json({ message: 'Cannot change super admin role' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE user (Super Admin only)
router.delete('/:id', auth, isSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // منع حذف المستخدم الرئيسي
    if (user.role === 'super_admin') {
      return res.status(403).json({ message: 'Cannot delete super admin' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET editor requests (Admin only)
router.get('/editor-requests/pending', auth, isAdmin, async (req, res) => {
  try {
    const requests = await User.find({ editorStatus: 'pending' })
      .select('-password')
      .sort({ editorRequestDate: -1 });

    res.json({ requests, count: requests.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET statistics (Admin only)
router.get('/stats/overview', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEditors = await User.countDocuments({ role: 'editor' });
    const totalAdmins = await User.countDocuments({
      $or: [{ role: 'admin' }, { role: 'super_admin' }]
    });
    const pendingRequests = await User.countDocuments({ editorStatus: 'pending' });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    res.json({
      totalUsers,
      totalEditors,
      totalAdmins,
      pendingRequests,
      newUsersThisMonth
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
