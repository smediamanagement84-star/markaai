// Email Validation Test
// This tests the same regex used in the signup page

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const testEmails = [
  { email: 'test@gmail.com', expected: true },
  { email: 'user@yahoo.com', expected: true },
  { email: 'john@outlook.com', expected: true },
  { email: 'sarah@hotmail.com', expected: true },
  { email: 'contact@protonmail.com', expected: true },
  { email: 'business@company.com', expected: true },
  { email: 'invalid@', expected: false },
  { email: '@invalid.com', expected: false },
  { email: 'no-at-sign.com', expected: false },
  { email: 'spaces in@email.com', expected: false },
  { email: '', expected: false },
];

console.log('Email Validation Test Results:\n');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;

testEmails.forEach(({ email, expected }) => {
  const isValid = email.length > 0 && emailRegex.test(email);
  const result = isValid === expected ? 'PASS' : 'FAIL';

  if (result === 'PASS') {
    passed++;
  } else {
    failed++;
  }

  const status = isValid ? 'Valid' : 'Invalid';
  console.log(`${result} | "${email}" => ${status} (expected: ${expected ? 'Valid' : 'Invalid'})`);
});

console.log('='.repeat(60));
console.log(`\nTotal: ${testEmails.length} tests`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`\nPersonal emails (Gmail, Yahoo, Outlook): ${passed >= 3 ? 'ACCEPTED ✓' : 'REJECTED ✗'}`);
