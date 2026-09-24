import os
import re
import socket
import subprocess
import sys
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8000

class ARServerHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def do_POST(self):
        if self.path == '/save-mind':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            os.makedirs('assets', exist_ok=True)
            with open('assets/targets.mind', 'wb') as f:
                f.write(post_data)
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'Saved targets.mind successfully!')
            print('[OK] Saved assets/targets.mind successfully!')
            return
        super().do_POST()

def start_http_server():
    server_address = ('0.0.0.0', PORT)
    httpd = HTTPServer(server_address, ARServerHandler)
    httpd.serve_forever()

def start_cloudflared_tunnel():
    print("[*] Launching Cloudflare Trusted HTTPS Tunnel for mobile camera...")
    cloudflared_bin = os.path.abspath('cloudflared.exe')
    if not os.path.exists(cloudflared_bin):
        print("[!] cloudflared.exe not found. Falling back to local HTTP only.")
        return

    cmd = [cloudflared_bin, 'tunnel', '--url', f'http://127.0.0.1:{PORT}']
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)

    tunnel_url = None
    for line in iter(process.stdout.readline, ''):
        # Look for the trycloudflare.com URL
        match = re.search(r'https://[a-zA-Z0-9-]+\.trycloudflare\.com', line)
        if match:
            tunnel_url = match.group(0)
            print("\n" + "=" * 65)
            print(" [SUCCESS] Trusted HTTPS URL Generated (No Security Warnings!)")
            print("=" * 65)
            print(f" >>> OPEN THIS LINK ON YOUR PHONE: <<<")
            print(f"\n     {tunnel_url}\n")
            print("=" * 65)
            print(" [Instructions]:")
            print(" 1. Open the URL above on your phone's browser (Safari or Chrome).")
            print(" 2. Tap 'Launch AR Camera' and tap 'Allow' for camera permissions.")
            print(" 3. Tap 'Target Photos' -> 'Display Photo' and point camera at the image!")
            print("=" * 65 + "\n")
            break

def run():
    # Start local HTTP server in background thread
    t = threading.Thread(target=start_http_server, daemon=True)
    t.start()

    print(f"[*] Local HTTP server running on http://localhost:{PORT}")
    start_cloudflared_tunnel()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[*] Server stopped.")

if __name__ == '__main__':
    run()
