import re
import os
import urllib.request
import urllib.parse

def extract_and_download_assets():
    # Read index.js and index.css
    content_js = ""
    if os.path.exists("index.js"):
        with open("index.js", "r", encoding="utf-8") as f:
            content_js = f.read()
            
    content_css = ""
    if os.path.exists("index.css"):
        with open("index.css", "r", encoding="utf-8") as f:
            content_css = f.read()
            
    # Regex to find paths inside assets/
    # The original URL structure could be like /assets/name-hash.png or googleapis storage.
    # Let's search for any matches like:
    # 1. /assets/...
    # 2. http://... or https://... with png, jpg, jpeg, svg, webp, mp4
    
    asset_matches = set()
    
    # Let's search for anything matching /assets/[a-zA-Z0-9_\-\.]+\.(png|jpg|jpeg|svg|webp|gif|mp4)
    pattern_relative = re.compile(r'/assets/[a-zA-Z0-9_\-\.]+\.(?:png|jpg|jpeg|svg|webp|gif|mp4)')
    for match in pattern_relative.findall(content_js):
        asset_matches.add(match)
    for match in pattern_relative.findall(content_css):
        asset_matches.add(match)
        
    # Also find URLs
    pattern_absolute = re.compile(r'https?://[a-zA-Z0-9_\-\./]+\.(?:png|jpg|jpeg|svg|webp|gif|mp4)')
    for match in pattern_absolute.findall(content_js):
        asset_matches.add(match)
    for match in pattern_absolute.findall(content_css):
        asset_matches.add(match)
        
    print(f"Found {len(asset_matches)} unique asset references.")
    
    os.makedirs("public/assets", exist_ok=True)
    
    # Download them
    # Let's use urllib without verifying SSL if it fails, or curl, or just standard download
    # Since earlier standard urllib failed due to TLS, we'll try to curl them or disable SSL verification.
    import ssl
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    downloaded = 0
    failed = 0
    
    for asset in sorted(list(asset_matches)):
        if asset.startswith("/assets/"):
            url = "https://champacademy.asia" + asset
            filename = asset.split("/")[-1]
        else:
            url = asset
            filename = asset.split("/")[-1]
            # If it is a third-party host, we can also put it in public/assets or keep it absolute.
            # But the primary website assets are under champacademy.asia/assets/
            if "champacademy.asia" not in url:
                # Skip third party urls or download them if they are local assets
                print(f"Skipping third-party absolute url: {url}")
                continue
                
        dest_path = os.path.join("public/assets", filename)
        
        # Check if already downloaded
        if os.path.exists(dest_path):
            print(f"Already exists: {filename}")
            downloaded += 1
            continue
            
        print(f"Downloading {url} to {dest_path}...")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
                with open(dest_path, 'wb') as out_file:
                    out_file.write(response.read())
            print(f"Successfully downloaded {filename}")
            downloaded += 1
        except Exception as e:
            print(f"Failed to download {url}: {e}")
            failed += 1
            
    print(f"Finished: {downloaded} downloaded, {failed} failed.")

if __name__ == '__main__':
    extract_and_download_assets()
