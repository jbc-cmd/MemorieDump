# 📸 Memorie AR - Mobile Photo-to-Video Scanner

An Augmented Reality (WebAR) mobile application that recognizes physical photo targets through your phone's camera and plays corresponding videos anchored in 3D AR space directly over the photos.

---
just another day 
---- 

## ✨ Features

- 🎯 **Multi-Photo AR Tracking**: Point your mobile camera at any target photo, and the app will track its 3D position and orientation in real time.
- 🎬 **Overlay 3D Video Player**: Automatically plays the matching video mapped directly over the detected photo with smooth perspective projection.
- 📱 **Zero Install / Cross-Platform**: Works directly in mobile browsers (iOS Safari, Android Chrome) via WebAR (MindAR.js + Three.js).
- 🎨 **Preset Targets & On-Screen Testing**: Includes ready-to-test photo targets that you can display on a screen or print out to test immediately.
- 🛠️ **Custom AR Memory Studio**: Allows you to upload any custom photo from your phone/computer and link any custom video (e.g. wedding photos, vacation memories, art posters) with on-the-fly client-side AR compilation.
- 🔊 **Mobile Audio & Gesture Handling**: Seamless unmute and playback handling compliant with iOS/Android media autoplay policies.

---

## 🚀 Quick Start

### 1. Start the Local Server
Run the included Python server:
```bash
python server.py
```

### 2. Open on Desktop / Mobile
- **Desktop**: Open `http://localhost:8000` (or `https://localhost:8443`) in Chrome / Edge.
- **Mobile Phone (Same Wi-Fi network)**:
  Open the HTTPS link displayed in the terminal:
  `https://<YOUR-LOCAL-IP>:8443`
  *(Note: Since it uses a local self-signed certificate, tap "Advanced" -> "Proceed to site" to grant camera access).*

---

## 🎯 How to Test

1. Tap **"Launch AR Camera"** and allow camera permissions.
2. Click **"Target Photos"** in the bottom action bar.
3. Tap **"Display Photo"** on any sample target (e.g., *Neon Cyberpunk Metropolis*, *Marine Dolphin*, or *Deep Space*).
4. Aim your camera at the photo on your screen or printed paper:
   - The scanner reticle turns green (*Target Locked*).
   - The video begins playing seamlessly directly on top of the photo in 3D AR view!
5. Move the camera around to see the video stick to the photo in 3D space.

---

## 🛠️ Adding Your Own Custom Photo & Video

1. In the bottom bar, tap **"Custom Memory"** (`+`).
2. Select or drag & drop your **Target Photo** (e.g., a photo of a painting, poster, or postcard).
3. Select or drag & drop your **Video Clip** (`.mp4`, `.webm`, `.mov`).
4. Enter a memory title and tap **"Compile & Add to AR Scanner"**.
5. The in-browser AR compiler will process your photo into tracking feature points in a few seconds and immediately add it to your live AR scanner!
