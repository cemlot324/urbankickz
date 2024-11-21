import bcrypt from 'bcryptjs';

async function testHash() {
    // Test 1: Simple hash and compare
    const password = "test1234";
    const hash1 = await bcrypt.hash(password, 10);
    console.log('\nTest 1:');
    console.log('Password:', password);
    console.log('Hash:', hash1);
    console.log('Compare result:', await bcrypt.compare(password, hash1));

    // Test 2: Compare with your existing hash
    const existingHash = '$2a$10$ss9SzW8ITpB/mH/9WYorVOgMT9566KYJxSRPM6HbzCGYuqK529R4.';
    console.log('\nTest 2:');
    console.log('Password:', password);
    console.log('Existing hash:', existingHash);
    console.log('Compare with existing:', await bcrypt.compare(password, existingHash));

    // Test 3: Different rounds
    const hash2 = await bcrypt.hash(password, 12);
    console.log('\nTest 3:');
    console.log('Hash with 12 rounds:', hash2);
    console.log('Compare result:', await bcrypt.compare(password, hash2));
}

testHash().catch(console.error);