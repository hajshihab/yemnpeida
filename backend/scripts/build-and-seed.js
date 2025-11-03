#!/usr/bin/env node

/**
 * Yemen-Pedia Build and Seed Script
 *
 * This script is designed to run during deployment on Render
 * It performs initial database seeding with categories and sources
 *
 * Usage: node scripts/build-and-seed.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Import models
const Category = require('../models/Category');
const Source = require('../models/Source');

// Categories data
const categories = [
  { name: 'History', nameAr: 'التاريخ', slug: 'history', description: 'Yemeni history and historical events', icon: '📜' },
  { name: 'Geography', nameAr: 'الجغرافيا', slug: 'geography', description: 'Geographical features of Yemen', icon: '🗺️' },
  { name: 'Culture', nameAr: 'الثقافة', slug: 'culture', description: 'Yemeni culture and traditions', icon: '🎭' },
  { name: 'Literature', nameAr: 'الأدب', slug: 'literature', description: 'Yemeni literature and writers', icon: '📚' },
  { name: 'Art', nameAr: 'الفن', slug: 'art', description: 'Yemeni arts and crafts', icon: '🎨' },
  { name: 'Architecture', nameAr: 'العمارة', slug: 'architecture', description: 'Yemeni architecture', icon: '🏛️' },
  { name: 'Cuisine', nameAr: 'المطبخ', slug: 'cuisine', description: 'Yemeni food and cuisine', icon: '🍽️' },
  { name: 'Personalities', nameAr: 'الشخصيات', slug: 'personalities', description: 'Notable Yemeni figures', icon: '👤' },
  { name: 'Cities', nameAr: 'المدن', slug: 'cities', description: 'Yemeni cities and towns', icon: '🏙️' },
  { name: 'Tourism', nameAr: 'السياحة', slug: 'tourism', description: 'Tourist destinations in Yemen', icon: '✈️' },
  { name: 'Economics', nameAr: 'الاقتصاد', slug: 'economics', description: 'Yemeni economy', icon: '💼' },
  { name: 'Society', nameAr: 'المجتمع', slug: 'society', description: 'Yemeni society and social life', icon: '👥' },
  { name: 'Language', nameAr: 'اللغة', slug: 'language', description: 'Yemeni dialects and language', icon: '🗣️' },
  { name: 'Religion', nameAr: 'الدين', slug: 'religion', description: 'Religious aspects in Yemen', icon: '🕌' },
  { name: 'Nature', nameAr: 'الطبيعة', slug: 'nature', description: 'Natural heritage of Yemen', icon: '🌿' }
];

// Sources data
const sources = [
  {
    name: 'Yemen Times',
    nameAr: 'يمن تايمز',
    url: 'https://www.yementimes.com',
    description: 'Independent English-language newspaper',
    verified: true
  },
  {
    name: 'Saba News Agency',
    nameAr: 'وكالة سبأ للأنباء',
    url: 'https://www.saba.ye',
    description: 'Official news agency of Yemen',
    verified: true
  },
  {
    name: 'Al-Masdar Online',
    nameAr: 'المصدر أونلاين',
    url: 'https://almasdaronline.com',
    description: 'Independent Yemeni news website',
    verified: true
  },
  {
    name: 'Yemen Archive',
    nameAr: 'أرشيف اليمن',
    url: 'https://yemenarchive.org',
    description: 'Digital archive preserving Yemeni documentation',
    verified: true
  },
  {
    name: 'AIYS - American Institute for Yemeni Studies',
    nameAr: 'المعهد الأمريكي للدراسات اليمنية',
    url: 'https://www.aiys.org',
    description: 'Academic research on Yemen',
    verified: true
  },
  {
    name: 'British-Yemeni Society',
    nameAr: 'الجمعية البريطانية اليمنية',
    url: 'https://www.b-ys.org.uk',
    description: 'Cultural and educational organization',
    verified: true
  },
  {
    name: 'Yemen Data Project',
    nameAr: 'مشروع بيانات اليمن',
    url: 'https://www.yemendataproject.org',
    description: 'Independent data collection project',
    verified: true
  },
  {
    name: 'UNESCO Yemen',
    nameAr: 'اليونسكو اليمن',
    url: 'https://en.unesco.org/countries/yemen',
    description: 'UNESCO activities in Yemen',
    verified: true
  },
  {
    name: 'Yemen Heritage',
    nameAr: 'التراث اليمني',
    url: 'https://yemenheritage.org',
    description: 'Preservation of Yemeni cultural heritage',
    verified: true
  },
  {
    name: 'General Organization of Antiquities & Museums',
    nameAr: 'الهيئة العامة للآثار والمتاحف',
    url: 'http://www.yemenantiquities.org',
    description: 'Official heritage authority',
    verified: true
  }
];

async function connectToDatabase() {
  try {
    log('\n🔄 Connecting to MongoDB...', 'cyan');

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    log('✅ Successfully connected to MongoDB', 'green');
  } catch (error) {
    log(`❌ MongoDB connection error: ${error.message}`, 'red');
    throw error;
  }
}

async function seedCategories() {
  try {
    log('\n🔄 Seeding categories...', 'cyan');

    const existingCategories = await Category.countDocuments();

    if (existingCategories > 0) {
      log(`⚠️  Found ${existingCategories} existing categories, skipping seed`, 'yellow');
      return;
    }

    await Category.insertMany(categories);
    log(`✅ Successfully seeded ${categories.length} categories`, 'green');
  } catch (error) {
    log(`❌ Error seeding categories: ${error.message}`, 'red');
    throw error;
  }
}

async function seedSources() {
  try {
    log('\n🔄 Seeding sources...', 'cyan');

    const existingSources = await Source.countDocuments();

    if (existingSources > 0) {
      log(`⚠️  Found ${existingSources} existing sources, skipping seed`, 'yellow');
      return;
    }

    await Source.insertMany(sources);
    log(`✅ Successfully seeded ${sources.length} sources`, 'green');
  } catch (error) {
    log(`❌ Error seeding sources: ${error.message}`, 'red');
    throw error;
  }
}

async function createIndexes() {
  try {
    log('\n🔄 Creating database indexes...', 'cyan');

    // This will create indexes defined in the models
    await Category.createIndexes();
    await Source.createIndexes();

    log('✅ Database indexes created successfully', 'green');
  } catch (error) {
    log(`⚠️  Warning: Error creating indexes: ${error.message}`, 'yellow');
    // Don't throw - indexes might already exist
  }
}

async function verifySeeding() {
  try {
    log('\n🔄 Verifying seeding...', 'cyan');

    const categoryCount = await Category.countDocuments();
    const sourceCount = await Source.countDocuments();

    log(`📊 Database Statistics:`, 'blue');
    log(`   - Categories: ${categoryCount}`, 'blue');
    log(`   - Sources: ${sourceCount}`, 'blue');

    if (categoryCount === 0 || sourceCount === 0) {
      throw new Error('Database seeding verification failed - no data found');
    }

    log('\n✅ Database verification completed successfully', 'green');
  } catch (error) {
    log(`❌ Verification error: ${error.message}`, 'red');
    throw error;
  }
}

async function main() {
  try {
    log('\n' + '='.repeat(60), 'cyan');
    log('🚀 Yemen-Pedia Database Initialization', 'cyan');
    log('='.repeat(60) + '\n', 'cyan');

    // Connect to database
    await connectToDatabase();

    // Seed data
    await seedCategories();
    await seedSources();

    // Create indexes
    await createIndexes();

    // Verify
    await verifySeeding();

    log('\n' + '='.repeat(60), 'green');
    log('✅ Build and seed process completed successfully!', 'green');
    log('='.repeat(60) + '\n', 'green');

    process.exit(0);
  } catch (error) {
    log('\n' + '='.repeat(60), 'red');
    log('❌ Build and seed process failed!', 'red');
    log(`Error: ${error.message}`, 'red');
    log('='.repeat(60) + '\n', 'red');

    process.exit(1);
  } finally {
    // Close database connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      log('🔌 Database connection closed', 'cyan');
    }
  }
}

// Run the script
main();
