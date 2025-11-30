const fs = require('fs');
const path = require('path');

// Simple script to help convert woff2 to ttf/otf
// Note: This script provides instructions. Actual conversion requires external tools.

const fontsDir = path.join(__dirname, '../assets/fonts');
const fontFiles = [
  'UberMove-Regular.woff2',
  'UberMove-Bold.woff2'
];

console.log('📝 Font Conversion Instructions:');
console.log('');
console.log('React Native requires .ttf or .otf files, not .woff2');
console.log('');
console.log('To convert your fonts:');
console.log('1. Visit: https://cloudconvert.com/woff2-to-ttf');
console.log('2. Upload each .woff2 file');
console.log('3. Convert to .ttf format');
console.log('4. Download and place in assets/fonts/ with these names:');
console.log('   - UberMove-Regular.ttf');
console.log('   - UberMove-Bold.ttf');
console.log('');
console.log('Or use FontForge: https://fontforge.org/');
console.log('');

// Check if files exist
fontFiles.forEach(file => {
  const filePath = path.join(fontsDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ Found: ${file}`);
  } else {
    console.log(`✗ Missing: ${file}`);
  }
});

console.log('');
console.log('After conversion, restart your Expo server: npx expo start --clear');

