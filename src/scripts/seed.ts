import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database';
import User from '../models/User';
import Product from '../models/Product';
import Purchase from '../models/Purchase';
import Sale from '../models/Sale';
import MentorshipPlan from '../models/MentorshipPlan';
import MentorshipClient from '../models/MentorshipClient';
import Expense from '../models/Expense';
import InventoryLot from '../models/InventoryLot';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Purchase.deleteMany({}),
      Sale.deleteMany({}),
      MentorshipPlan.deleteMany({}),
      MentorshipClient.deleteMany({}),
      Expense.deleteMany({}),
      InventoryLot.deleteMany({})
    ]);
    
    console.log('Cleared all existing data from MongoDB Atlas');
    
    // Create a single user account for login
    const user = await User.create({
      email: 'admin@herbalife.com',
      password: 'admin123',
      name: 'Herbalife Admin',
      role: 'admin'
    });
    console.log('Created admin user account');
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('🗄️  Connected to MongoDB Atlas');
    console.log('🧹 All collections cleared of mock data');
    console.log('👤 Admin user created');
    console.log('\n🔑 Login credentials:');
    console.log('   Email: admin@herbalife.com');
    console.log('   Password: admin123');
    console.log('\n🎯 You can now add real data through the app interface!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();