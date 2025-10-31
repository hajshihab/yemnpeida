const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const categorySchema = new mongoose.Schema({
  name: String,
  nameAr: String,
  slug: String,
  description: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  icon: String,
  color: String,
  order: Number
});

const Category = mongoose.model('Category', categorySchema);

const yemenCategories = [
  {
    name: 'History',
    nameAr: 'التاريخ',
    slug: 'history',
    description: 'تاريخ اليمن عبر العصور',
    icon: '📜',
    color: '#8B4513',
    order: 1
  },
  {
    name: 'Geography',
    nameAr: 'الجغرافيا',
    slug: 'geography',
    description: 'جغرافية اليمن ومدنه ومحافظاته',
    icon: '🗺️',
    color: '#2E8B57',
    order: 2
  },
  {
    name: 'Culture',
    nameAr: 'الثقافة',
    slug: 'culture',
    description: 'الثقافة والتراث اليمني',
    icon: '🎭',
    color: '#9370DB',
    order: 3
  },
  {
    name: 'Literature',
    nameAr: 'الأدب',
    slug: 'literature',
    description: 'الأدب والشعر اليمني',
    icon: '📚',
    color: '#CD853F',
    order: 4
  },
  {
    name: 'Art',
    nameAr: 'الفنون',
    slug: 'art',
    description: 'الفنون اليمنية التقليدية والحديثة',
    icon: '🎨',
    color: '#FF6347',
    order: 5
  },
  {
    name: 'Architecture',
    nameAr: 'العمارة',
    slug: 'architecture',
    description: 'العمارة اليمنية التقليدية',
    icon: '🏛️',
    color: '#B8860B',
    order: 6
  },
  {
    name: 'Food',
    nameAr: 'المطبخ',
    slug: 'food',
    description: 'المطبخ اليمني والأطباق التقليدية',
    icon: '🍽️',
    color: '#FF8C00',
    order: 7
  },
  {
    name: 'Personalities',
    nameAr: 'الشخصيات',
    slug: 'personalities',
    description: 'الشخصيات اليمنية البارزة',
    icon: '👤',
    color: '#4169E1',
    order: 8
  },
  {
    name: 'Cities',
    nameAr: 'المدن',
    slug: 'cities',
    description: 'مدن اليمن ومحافظاته',
    icon: '🏙️',
    color: '#20B2AA',
    order: 9
  },
  {
    name: 'Tourism',
    nameAr: 'السياحة',
    slug: 'tourism',
    description: 'المواقع السياحية والأثرية',
    icon: '🏔️',
    color: '#32CD32',
    order: 10
  },
  {
    name: 'Economy',
    nameAr: 'الاقتصاد',
    slug: 'economy',
    description: 'الاقتصاد اليمني والموارد',
    icon: '💰',
    color: '#FFD700',
    order: 11
  },
  {
    name: 'Society',
    nameAr: 'المجتمع',
    slug: 'society',
    description: 'المجتمع اليمني والعادات',
    icon: '👥',
    color: '#708090',
    order: 12
  },
  {
    name: 'Language',
    nameAr: 'اللغة',
    slug: 'language',
    description: 'اللغة واللهجات اليمنية',
    icon: '🗣️',
    color: '#DC143C',
    order: 13
  },
  {
    name: 'Religion',
    nameAr: 'الدين',
    slug: 'religion',
    description: 'الدين والمساجد التاريخية',
    icon: '🕌',
    color: '#006400',
    order: 14
  },
  {
    name: 'Nature',
    nameAr: 'الطبيعة',
    slug: 'nature',
    description: 'الطبيعة والحياة البرية',
    icon: '🌿',
    color: '#228B22',
    order: 15
  }
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yemenpedia');
    console.log('✅ Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️ Cleared existing categories');

    // Insert new categories
    const result = await Category.insertMany(yemenCategories);
    console.log(`✅ Inserted ${result.length} categories`);

    console.log('\n📚 Categories created:');
    result.forEach(cat => {
      console.log(`   ${cat.icon} ${cat.nameAr} (${cat.slug})`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedCategories();
