// Build script to prepare public directory for Vercel
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Files and directories to copy
// NOTE: Do NOT copy the 'api' directory - it must stay in root for Vercel to detect serverless functions
const itemsToCopy = [
  'index.html',
  'about.html',
  'comments.js',
  'config.js',
  'script.js',
  'styles.css',
  'images',
  'database',
  'CNAME'
];

// Copy PDFs
const pdfs = fs.readdirSync(__dirname).filter(file => file.endsWith('.pdf'));
itemsToCopy.push(...pdfs);

// Copy function
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    files.forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy all items
itemsToCopy.forEach(item => {
  const src = path.join(__dirname, item);
  const dest = path.join(publicDir, item);
  if (fs.existsSync(src)) {
    try {
      copyRecursive(src, dest);
      console.log(`Copied: ${item}`);
    } catch (err) {
      console.error(`Error copying ${item}:`, err.message);
    }
  }
});

console.log('Build complete!');

