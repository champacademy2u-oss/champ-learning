const fs = require('fs');
const content = fs.readFileSync('index.js', 'utf-8');

console.log("=== Checking list b and register-section definition ===");
let pos = content.indexOf('id:"register-section"');
if (pos !== -1) {
  console.log("Found register-section at:", pos);
  console.log(content.substring(pos - 1500, pos));
} else {
  console.log("Not found");
}
