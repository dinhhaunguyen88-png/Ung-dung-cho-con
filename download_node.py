"""Download and extract Node.js portable for Windows x64"""
import urllib.request, zipfile, os, sys
sys.stdout.reconfigure(encoding='utf-8')

NODE_VERSION = "v22.14.0"
URL = f"https://nodejs.org/dist/{NODE_VERSION}/node-{NODE_VERSION}-win-x64.zip"
DEST = os.path.expanduser("~/.node_portable")
ZIP_PATH = os.path.join(DEST, "node.zip")

os.makedirs(DEST, exist_ok=True)

node_dir = os.path.join(DEST, f"node-{NODE_VERSION}-win-x64")
node_exe = os.path.join(node_dir, "node.exe")

if os.path.exists(node_exe):
    print(f"Node already exists at: {node_exe}")
else:
    print(f"Downloading Node.js {NODE_VERSION}...")
    print(f"URL: {URL}")
    urllib.request.urlretrieve(URL, ZIP_PATH)
    print(f"Downloaded! Extracting...")
    with zipfile.ZipFile(ZIP_PATH, 'r') as z:
        z.extractall(DEST)
    os.remove(ZIP_PATH)
    print(f"Extracted to: {node_dir}")

# Verify
print(f"\nNode exe: {node_exe}")
print(f"Exists: {os.path.exists(node_exe)}")

npm_cmd = os.path.join(node_dir, "npm.cmd")
print(f"npm.cmd: {npm_cmd}")
print(f"Exists: {os.path.exists(npm_cmd)}")

print(f"\nTo use: set PATH={node_dir};%PATH%")
