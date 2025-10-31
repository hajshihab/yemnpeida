const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const User = require('../models/User');

async function createSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yemenpedia');
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      console.log('⚠️  Super Admin already exists!');
      console.log('Username:', existingSuperAdmin.username);
      console.log('Email:', existingSuperAdmin.email);
      await mongoose.connection.close();
      return;
    }

    // Create super admin
    const superAdmin = new User({
      username: 'admin',
      email: 'admin@yemenpedia.com',
      password: 'Admin123!@#', // تأكد من تغيير كلمة المرور لاحقاً
      displayName: 'المدير الرئيسي',
      role: 'super_admin',
      verified: true,
      bio: 'المدير الرئيسي لموسوعة يمن بيديا'
    });

    await superAdmin.save();
    console.log('\n✅ Super Admin created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Username: admin');
    console.log('Email: admin@yemenpedia.com');
    console.log('Password: Admin123!@#');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Please change the password immediately after first login!');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createSuperAdmin();
