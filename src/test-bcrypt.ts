import bcrypt from 'bcryptjs';

async function testBcrypt() {
    const password = "test1234";
    
    // Create hash
    const hash = await bcrypt.hash(password, 10);
    console.log('Original password:', password);
    console.log('Created hash:', hash);
    
    // Test comparison
    const result = await bcrypt.compare(password, hash);
    console.log('Comparison result:', result);
    
    // Test with your existing hash
    const existingHash = '$2a$10$W4kLRfaLrCtNfoaJoFoUM.SvocTxIIOV2P2uSqprwFFP3ip1BZZG6';
    const resultWithExisting = await bcrypt.compare(password, existingHash);
    console.log('Comparison with existing hash:', resultWithExisting);
}

testBcrypt().catch(console.error);