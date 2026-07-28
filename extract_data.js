const fs = require('fs');
const content = fs.readFileSync('index.js', 'utf-8');

// Find curriculum/lessons. Let's find Chinese text arrays or objects with "num" etc.
// In the grep output, we saw things like:
// const e = ["靠策略，让努力有方向", "靠系统，让成果可复制", "靠模式，让生意能放大"]
// Let's search for "Module" or "10堂" or "课程" or sections.

console.log("=== Matching some curriculum characters ===");
const lessonsRegex = /\{num:"([^"]+)"[^\}]+t(?:ag)?:/g;
let match;
const matches = [];

// Let's run regex to find Chinese characters or objects that might be the 10 modules
const regex = /\{num:"\d+"[^}]+\}/g;
let found;
while ((found = regex.exec(content)) !== null) {
  console.log(found[0]);
}

console.log("=== Searching for testimonials ===");
const testRegex = /\{name:"[^"]+"[^}]+\}/g;
while ((found = testRegex.exec(content)) !== null) {
  console.log(found[0]);
}

console.log("=== Searching for FAQ ===");
const faqRegex = /\{q:"[^"]+"[^}]+\}/g;
while ((found = faqRegex.exec(content)) !== null) {
  console.log(found[0]);
}
