import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

async function main() {
  const jsUrl = 'https://champacademy.asia/assets/index-Cp5r5y2k.js';
  const cssUrl = 'https://champacademy.asia/assets/index-CeWfe1qj.css';
  
  console.log('Fetching JS bundle...');
  const jsRes = await fetch(jsUrl);
  const jsText = await jsRes.text();
  fs.writeFileSync('index.js', jsText);
  
  console.log('Fetching CSS bundle...');
  const cssRes = await fetch(cssUrl);
  const cssText = await cssRes.text();
  fs.writeFileSync('index.css', cssText);
  
  console.log('Saved bundles.');
}

main().catch(console.error);
