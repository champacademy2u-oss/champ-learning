const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const assetUrls = [
  "https://champacademy.asia/assets/award-new-1-C3Y2cp_f.png",
  "https://champacademy.asia/assets/award-new-2-BpMC7iD1.png",
  "https://champacademy.asia/assets/award-new-3-BTWH93N1.png",
  "https://champacademy.asia/assets/award-new-4-BfK9GSpp.png",
  "https://champacademy.asia/assets/award-new-5-B5hF7GYR.png",
  "https://champacademy.asia/assets/award-new-6-pgimpSB3.png",
  "https://champacademy.asia/assets/award-new-7-8hRPMg1x.png",
  "https://champacademy.asia/assets/benefit-1-Cxe8rXEd.png",
  "https://champacademy.asia/assets/capability-1-7u4pQpTX.png",
  "https://champacademy.asia/assets/capability-2-BJq1KBdl.png",
  "https://champacademy.asia/assets/capability-3-Dy69MBie.png",
  "https://champacademy.asia/assets/experience-1-new-aYy-fgNY.png",
  "https://champacademy.asia/assets/experience-10-DoycUaE0.png",
  "https://champacademy.asia/assets/experience-2-new-DZ2jgsRw.png",
  "https://champacademy.asia/assets/experience-3-CAbq5sOX.png",
  "https://champacademy.asia/assets/experience-4-SUVlcIyy.png",
  "https://champacademy.asia/assets/experience-5-Pfje2xCr.png",
  "https://champacademy.asia/assets/experience-6-Cq7ajyVF.png",
  "https://champacademy.asia/assets/experience-7-IzWGSBgF.png",
  "https://champacademy.asia/assets/experience-8-BKA8DXfR.png",
  "https://champacademy.asia/assets/experience-9-BDn9UQ1d.png",
  "https://champacademy.asia/assets/faq-bg-BdueriB7.jpg",
  "https://champacademy.asia/assets/hero-background-CgUbRfkl.png",
  "https://champacademy.asia/assets/hero-instructor-updated-D8zo6JTK.png",
  "https://champacademy.asia/assets/hrdc-logo-CsenaheX.png",
  "https://champacademy.asia/assets/leverage-pattern-tTCXtwN8.jpg",
  "https://champacademy.asia/assets/media-1-CS7KlS13.jpg",
  "https://champacademy.asia/assets/media-2-s1IZhFdT.jpg",
  "https://champacademy.asia/assets/media-3-C_kEueQm.jpg"
];

// Read JS and CSS content safely
let jsContent = '';
let cssContent = '';
try {
  jsContent = fs.readFileSync('index.js', 'utf-8');
} catch (e) {}
try {
  cssContent = fs.readFileSync('index.css', 'utf-8');
} catch (e) {}

const allUrls = new Set(assetUrls);

const relativeRegex = /\/assets\/[a-zA-Z0-9_\-\.]+\.(png|jpg|jpeg|svg|webp|gif|mp4|ico)/g;
let match;
while ((match = relativeRegex.exec(jsContent)) !== null) {
  allUrls.add(`https://champacademy.asia${match[0]}`);
}
while ((match = relativeRegex.exec(cssContent)) !== null) {
  allUrls.add(`https://champacademy.asia${match[0]}`);
}

const urls = Array.from(allUrls);
console.log(`Found ${urls.length} URLs to download.`);

const destDir = path.join(__dirname, 'public', 'assets');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadSync(url) {
  const filename = path.basename(url);
  const dest = path.join(destDir, filename);

  if (fs.existsSync(dest)) {
    console.log(`Already exists: ${filename}`);
    return;
  }

  console.log(`Downloading ${url} -> ${dest}`);
  try {
    execSync(`curl -s -L -o "${dest}" "${url}"`);
    console.log(`Successfully downloaded ${filename}`);
  } catch (err) {
    console.error(`Failed loading ${url}:`, err.message);
  }
}

urls.forEach(url => downloadSync(url));
console.log('All downloads completed!');
