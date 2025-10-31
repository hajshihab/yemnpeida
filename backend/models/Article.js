const mongoose = require('mongoose');

const revisionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: ''
  },
  editor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  editedAt: {
    type: Date,
    default: Date.now
  }
});

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    maxlength: 500
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  language: {
    type: String,
    default: 'ar',
    enum: ['ar', 'en']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  revisions: [revisionSchema],
  relatedArticles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }],
  images: [{
    url: String,
    caption: String,
    alt: String
  }],
  references: [{
    title: String,
    url: String,
    author: String,
    date: Date
  }],
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastEditedAt: {
    type: Date
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for text search (removed language specific index)
articleSchema.index({ title: 'text', content: 'text', tags: 'text' }, { default_language: 'none' });

// Index for slug lookup
articleSchema.index({ slug: 1 });

// Pre-save middleware to add revision
articleSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.revisions.push({
      content: this.content,
      editor: this.lastEditedBy,
      editedAt: this.lastEditedAt || new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
