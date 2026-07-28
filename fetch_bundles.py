import urllib.request
import re
import os
import json

def fetch_bundles():
    js_url = 'https://champacademy.asia/assets/index-Cp5r5y2k.js'
    css_url = 'https://champacademy.asia/assets/index-CeWfe1qj.css'
    
    print('Fetching JS bundle...')
    with urllib.request.urlopen(js_url) as response:
        js_text = response.read().decode('utf-8')
    with open('index.js', 'w', encoding='utf-8') as f:
        f.write(js_text)
        
    print('Fetching CSS bundle...')
    with urllib.request.urlopen(css_url) as response:
        css_text = response.read().decode('utf-8')
    with open('index.css', 'w', encoding='utf-8') as f:
        f.write(css_text)
        
    print('Saved bundles index.js and index.css')

if __name__ == '__main__':
    fetch_bundles()
