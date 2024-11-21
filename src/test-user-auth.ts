const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dbConnect = require('./lib/mongodb');

async function testUserAuth() {
    await dbConnect();
    
    const testEmail = 'test3@example.com';
    const testPassword = 'test1234';
    
    // Delete any existing test user
    await User.deleteOne({ email: testEmail });
    
    // Create hash
    console.log('Creating hash...');
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    console.log('Hash created:', hashedPassword);
    
    // Create user directly
    const user = await User.create({
        name: 'Test User',
        email: testEmail,
        password: hashedPassword
    });
    console.log('User created with ID:', user._id);
    
    // Fetch user and verify password
    const fetchedUser = await User.findOne({ email: testEmail }).select('+password');
    console.log('Fetched user password hash:', fetchedUser.password);
    
    // Test password comparison
    const isMatch = await bcrypt.compare(testPassword, fetchedUser.password);
    console.log('Password comparison result:', isMatch);
    
    // Cleanup
    await mongoose.disconnect();
}

testUserAuth().catch(console.error);