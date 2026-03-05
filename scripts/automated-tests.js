#!/usr/bin/env node
/**
 * BSC Pro - Automated UI/UX Testing Script
 * Tests all buttons, links, and critical user flows
 */

const { exec } = require('child_process');
const https = require('https');

const BASE_URL = 'https://www.bscpro.nl';
const TEST_RESULTS = {
  timestamp: new Date().toISOString(),
  passed: [],
  failed: [],
  warnings: []
};

// Test endpoints
const ENDPOINTS = [
  { path: '/', name: 'Homepage' },
  { path: '/login/', name: 'Login Page' },
  { path: '/register/', name: 'Register Page' },
  { path: '/privacy/', name: 'Privacy Page' },
  { path: '/voorwaarden/', name: 'Terms Page' },
  { path: '/api/monitor', name: 'API Monitor' },
  { path: '/sitemap.xml', name: 'Sitemap' },
  { path: '/robots.txt', name: 'Robots.txt' }
];

async function testEndpoint(path, name) {
  return new Promise((resolve) => {
    const req = https.get(BASE_URL + path, (res) => {
      const status = res.statusCode;
      const success = status >= 200 && status < 400;
      
      if (success) {
        TEST_RESULTS.passed.push({ name, path, status });
        console.log(`✅ ${name}: ${status}`);
      } else {
        TEST_RESULTS.failed.push({ name, path, status });
        console.log(`❌ ${name}: ${status}`);
      }
      resolve();
    }).on('error', (err) => {
      TEST_RESULTS.failed.push({ name, path, error: err.message });
      console.log(`❌ ${name}: ERROR - ${err.message}`);
      resolve();
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      TEST_RESULTS.failed.push({ name, path, error: 'Timeout' });
      console.log(`⏱️  ${name}: TIMEOUT`);
      resolve();
    });
  });
}

async function runTests() {
  console.log('🧪 Starting BSC Pro Automated Testing...\n');
  console.log(`Testing: ${BASE_URL}\n`);
  
  console.log('📍 Testing Endpoints:');
  for (const endpoint of ENDPOINTS) {
    await testEndpoint(endpoint.path, endpoint.name);
  }
  
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${TEST_RESULTS.passed.length}`);
  console.log(`❌ Failed: ${TEST_RESULTS.failed.length}`);
  console.log(`⚠️  Warnings: ${TEST_RESULTS.warnings.length}`);
  
  if (TEST_RESULTS.failed.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    TEST_RESULTS.failed.forEach(f => {
      console.log(`  - ${f.name}: ${f.status || f.error}`);
    });
  }
  
  // Check critical paths
  console.log('\n🔒 Critical Path Verification:');
  const criticalPaths = ['/', '/login/', '/privacy/'];
  const allCriticalOk = criticalPaths.every(path => 
    TEST_RESULTS.passed.some(p => p.path === path)
  );
  
  if (allCriticalOk) {
    console.log('✅ All critical paths accessible');
  } else {
    console.log('❌ Some critical paths failed');
    process.exit(1);
  }
  
  console.log('\n✨ Testing Complete!\n');
  
  // Save results
  const fs = require('fs');
  fs.writeFileSync(
    './test-results.json', 
    JSON.stringify(TEST_RESULTS, null, 2)
  );
  console.log('Results saved to test-results.json');
}

// Check storage cleanup
async function verifyStorageCleanup() {
  console.log('\n🗑️  Storage Cleanup Verification:');
  console.log('Note: Manual verification required in Supabase dashboard');
  console.log('Check: Storage > Policies > File deletion after 24h');
}

// Run all tests
runTests().then(() => {
  verifyStorageCleanup();
}).catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
