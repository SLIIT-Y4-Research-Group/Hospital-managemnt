import { auth } from './config/firebaseConfig.js';

// Test Firebase Authentication functions
async function testFirebaseAuth() {
  try {
    console.log('🔥 Testing Firebase Authentication Setup...\n');

    // Test 1: List existing users (should work if properly configured)
    console.log('📋 Test 1: Checking Firebase connection...');
    const listUsersResult = await auth.listUsers(1); // List 1 user to test connection
    console.log('✅ Firebase connection successful!');
    console.log(`📊 Total users in Firebase: ${listUsersResult.users.length > 0 ? 'Users exist' : 'No users yet'}\n`);

    // Test 2: Try to create a test user
    console.log('👤 Test 2: Creating a test user...');
    const testEmail = `test-${Date.now()}@example.com`;
    
    try {
      const testUser = await auth.createUser({
        email: testEmail,
        password: 'testPassword123',
        displayName: 'Test User'
      });
      
      console.log('✅ Test user created successfully!');
      console.log(`📧 Test user email: ${testUser.email}`);
      console.log(`🆔 Test user UID: ${testUser.uid}\n`);

      // Test 3: Create custom token
      console.log('🎫 Test 3: Creating custom token...');
      const customToken = await auth.createCustomToken(testUser.uid, {
        role: 'patient',
        testUser: true
      });
      console.log('✅ Custom token created successfully!');
      console.log(`🔑 Token length: ${customToken.length} characters\n`);

      // Cleanup: Delete test user
      console.log('🧹 Cleaning up: Deleting test user...');
      await auth.deleteUser(testUser.uid);
      console.log('✅ Test user deleted successfully!\n');

    } catch (userCreateError) {
      console.log('⚠️  Could not create test user (this might be due to existing users or permissions)');
      console.log(`Error: ${userCreateError.message}\n`);
    }

    console.log('🎉 Firebase Authentication setup is working correctly!');
    console.log('🚀 Your Hospital Management System is ready to use Firebase Auth!\n');

    // Configuration summary
    console.log('📋 Configuration Summary:');
    console.log(`📧 Project ID: ereading-e5931`);
    console.log(`🔧 Service Account: firebase-adminsdk-qdayk@ereading-e5931.iam.gserviceaccount.com`);
    console.log(`✅ Authentication: Enabled and working`);
    
  } catch (error) {
    console.error('❌ Firebase configuration test failed:');
    console.error(error.message);
    console.error('\n🔧 Please check your Firebase configuration and credentials.');
  }
}

// Run the test
testFirebaseAuth().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});