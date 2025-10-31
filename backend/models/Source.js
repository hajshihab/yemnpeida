const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  nameAr: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['government', 'academic', 'news', 'book', 'website', 'archive', 'other'],
    default: 'website'
  },
  website: {
    type: String
  },
  description: {
    type: String
  },
  logo: {
    type: String
  },
  reliability: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  country: {
    type: String,
    default: 'Yemen'
  },
  language: {
    type: String,
    default: 'ar'
  },
  verified: {
    type: Boolean,
    default: false
  },
  // For National Center and official sources
  isOfficial: {
    type: Boolean,
    default: false
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String
  },
  articlesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Source', sourceSchema);
