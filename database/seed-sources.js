const mongoose = require('mongoose');
require('dotenv').config({ path: '../backend/.env' });

const sourceSchema = new mongoose.Schema({
  name: String,
  nameAr: String,
  type: String,
  website: String,
  description: String,
  logo: String,
  reliability: Number,
  country: String,
  language: String,
  verified: Boolean,
  isOfficial: Boolean,
  contactInfo: Object,
  articlesCount: Number
});

const Source = mongoose.model('Source', sourceSchema);

const yemenSources = [
  {
    name: 'National Information Center',
    nameAr: 'المركز الوطني للمعلومات',
    type: 'government',
    website: 'https://www.nic.gov.ye',
    description: 'المركز الوطني للمعلومات - الجهة الحكومية الرسمية المسؤولة عن المعلومات في اليمن',
    reliability: 5,
    country: 'Yemen',
    language: 'ar',
    verified: true,
    isOfficial: true,
    contactInfo: {
      email: 'info@nic.gov.ye',
      address: 'صنعاء، اليمن'
    },
    articlesCount: 0
  },
  {
    name: 'Yemeni Ministry of Culture',
    nameAr: 'وزارة الثقافة اليمنية',
    type: 'government',
    website: 'https://www.yemen-culture.gov.ye',
    description: 'وزارة الثقافة - مصدر موثوق للمعلومات الثقافية والتراثية',
    reliability: 5,
    country: 'Yemen',
    language: 'ar',
    verified: true,
    isOfficial: true,
    articlesCount: 0
  },
  {
    name: 'Sana\'a University',
    nameAr: 'جامعة صنعاء',
    type: 'academic',
    website: 'https://www.su.edu.ye',
    description: 'جامعة صنعاء - أكبر جامعة في اليمن ومصدر للأبحاث الأكاديمية',
    reliability: 5,
    country: 'Yemen',
    language: 'ar',
    verified: true,
    isOfficial: false,
    articlesCount: 0
  },
  {
    name: 'Yemen Archive',
    nameAr: 'أرشيف اليمن',
    type: 'archive',
    website: 'https://www.yemenarchive.org',
    description: 'أرشيف رقمي للوثائق والصور التاريخية اليمنية',
    reliability: 4,
    country: 'Yemen',
    language: 'ar',
    verified: true,
    isOfficial: false,
    articlesCount: 0
  },
  {
    name: 'Yemen Times',
    nameAr: 'يمن تايمز',
    type: 'news',
    website: 'https://www.yementimes.com',
    description: 'صحيفة يمنية مستقلة',
    reliability: 4,
    country: 'Yemen',
    language: 'ar',
    verified: true,
    isOfficial: false,
    articlesCount: 0
  },
  {
    name: 'Yemen Heritage',
    nameAr: 'تراث اليمن',
    type: 'website',
    description: 'موقع متخصص في التراث اليمني',
    reliability: 4,
    country: 'Yemen',
    language: 'ar',
    verified: false,
    isOfficial: false,
    articlesCount: 0
  },
  {
    name: 'General Organization of Antiquities and Museums',
    nameAr: 'الهيئة العامة للآثار والمتاحف',
    type: 'government',
    description: 'الجهة المسؤولة عن الآثار والمتاحف في اليمن',
    reliability: 5,
    country: 'Yemen',
    language: 'ar',
    verified: true,
    isOfficial: true,
    articlesCount: 0
  },
  {
    name: 'Yemen Central Statistical Organization',
    nameAr: 'الجهاز المركزي للإحصاء',
    type: 'government',
    description: 'مصدر الإحصاءات الرسمية في اليمن',
    reliability: 5,
    country: 'Yemen',
    language: 'ar',
    verified: true,
    isOfficial: true,
    articlesCount: 0
  },
  {
    name: 'Yemen Encyclopedia - Al-Mawsoo\'a Al-Yamaniya',
    nameAr: 'الموسوعة اليمنية',
    type: 'book',
    description: 'الموسوعة اليمنية الشاملة',
    reliability: 5,
    country: 'Yemen',
    language: 'ar',
    verified: true,
    isOfficial: false,
    articlesCount: 0
  },
  {
    name: 'Yemen Tourism Promotion Board',
    nameAr: 'مجلس الترويج السياحي اليمني',
    type: 'government',
    description: 'الجهة المسؤولة عن السياحة في اليمن',
    reliability: 5,
    country: 'Yemen',
    language: 'ar',
    verified: true,
    isOfficial: true,
    articlesCount: 0
  }
];

async function seedSources() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yemenpedia');
    console.log('✅ Connected to MongoDB');

    // Clear existing sources
    await Source.deleteMany({});
    console.log('🗑️ Cleared existing sources');

    // Insert new sources
    const result = await Source.insertMany(yemenSources);
    console.log(`✅ Inserted ${result.length} sources`);

    console.log('\n📚 Sources created:');
    result.forEach(source => {
      const officialBadge = source.isOfficial ? '🏛️ [رسمي]' : '';
      const verifiedBadge = source.verified ? '✓' : '';
      console.log(`   ${verifiedBadge} ${source.nameAr} ${officialBadge}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedSources();
