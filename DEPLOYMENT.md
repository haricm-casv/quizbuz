# 🚀 QuizBuz Deployment Guide

## Architecture Overview

QuizBuz uses a **hybrid deployment model**:
- 📱 **Client PWA**: Deployed to Vercel (cloud-hosted, globally accessible)
- 💻 **Server**: Runs locally on your laptop during quiz sessions

## Why This Architecture?

1. ✅ **Easy Access**: Participants can access the PWA from anywhere via HTTPS URL
2. ✅ **No Installation**: Just share the Vercel URL, no need to serve files locally
3. ✅ **Local Control**: Server remains on your network for real-time, low-latency connections
4. ✅ **Offline Capable**: PWA caches assets for offline use after first load

## 📦 Deploying to Vercel

### Prerequisites

- [Vercel account](https://vercel.com/) (free tier works perfectly)
- [Vercel CLI](https://vercel.com/docs/cli) installed: `npm install -g vercel`
- Git repository (optional but recommended)

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   cd e:\projects\quizbuz
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? *Select your account*
   - Link to existing project? **N**
   - Project name? **quizbuz** (or your preferred name)
   - In which directory is your code located? **./client-pwa/public**
   - Want to modify settings? **N**

5. **Your PWA is now live!** 🎉
   - Vercel will provide a URL like: `https://quizbuz-xyz.vercel.app`
   - Production URL: `https://quizbuz.vercel.app` (if you own the project)

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure project:
     - **Framework Preset**: Other
     - **Root Directory**: `client-pwa/public`
     - **Build Command**: (leave empty)
     - **Output Directory**: (leave empty)
   - Click **Deploy**

3. **Your PWA is now live!** 🎉

## 🎮 How to Use After Deployment

### For Quiz Master:

1. **Start your local server**:
   ```bash
   cd server
   npm start
   ```

2. **Note your local IP** (displayed in console):
   ```
   Server running at: ws://192.168.1.100:3000
   ```

3. **Share the Vercel URL** with participants:
   ```
   https://quizbuz.vercel.app
   ```

4. **Instruct participants** to:
   - Open the Vercel URL on their phones
   - Enter the server IP: `192.168.1.100` (your local IP)
   - Enter their team name
   - Connect!

### For Participants:

1. Open `https://quizbuz.vercel.app` in your mobile browser
2. Click **Settings** (⚙️)
3. Enter:
   - **Server IP**: `192.168.1.100` (provided by quiz master)
   - **Team Name**: Your team name
4. Click **Connect & Save**
5. Wait for the round to start and BUZZ! 🎯

## 🔧 Custom Domain (Optional)

### Add a Custom Domain to Vercel:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Domains**
3. Add your domain (e.g., `quizbuz.yourdomain.com`)
4. Configure DNS records as instructed
5. Your PWA will be accessible at your custom domain!

## 🔄 Updating Your Deployment

### Using Vercel CLI:

```bash
# Deploy updates
vercel

# Deploy to production
vercel --prod
```

### Using GitHub Integration:

- Simply push to your repository
- Vercel auto-deploys on every push:
  - `main` branch → Production
  - Other branches → Preview deployments

## 🌐 Network Configuration

### Important Notes:

1. **Mixed Content Warning**:
   - Vercel serves your PWA over HTTPS
   - Local server uses WS (not WSS)
   - Modern browsers allow insecure WebSocket connections to local IPs from secure contexts

2. **Firewall Configuration**:
   - Ensure your laptop firewall allows incoming connections on port 3000
   - Windows: `Windows Defender Firewall` → `Allow an app`
   - macOS: `System Preferences` → `Security & Privacy` → `Firewall Options`

3. **Router Settings**:
   - No special configuration needed!
   - All devices must be on the same Wi-Fi network
   - Server laptop should have a static/reserved IP (optional but recommended)

## 📱 PWA Installation

### Install on Mobile:

**Android (Chrome)**:
1. Open the Vercel URL
2. Tap menu (⋮) → "Add to Home screen"
3. Confirm installation
4. App icon appears on your home screen!

**iOS (Safari)**:
1. Open the Vercel URL in Safari
2. Tap Share button → "Add to Home Screen"
3. Confirm installation
4. App icon appears on your home screen!

## 🐛 Troubleshooting Deployment

### Build Fails on Vercel

- **Check**: Ensure `client-pwa/public` contains all necessary files
- **Solution**: Verify paths in `vercel.json` are correct

### Can't Connect to Server

- **Check**: Server IP address is correct and server is running
- **Solution**: 
  - Verify laptop and phones are on same Wi-Fi
  - Check firewall settings
  - Try using laptop's IP directly: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

### Service Worker Issues

- **Check**: Service worker might be caching old versions
- **Solution**: 
  - Clear browser cache
  - Update service worker version in `sw.js`
  - Hard reload: Ctrl+Shift+R (desktop) or developer tools on mobile

### Mixed Content Warnings

- **Check**: Browser console for security warnings
- **Solution**: Local WebSocket (ws://) connections to private IPs are allowed from HTTPS

## 🎯 Alternative Deployment Options

### 1. Full Cloud Deployment (Not Recommended for this use case)

If you want to make it fully cloud-based (loses the local Wi-Fi benefit):
- Deploy server to Vercel Serverless Functions
- Use a cloud WebSocket service (Pusher, Ably, etc.)
- Note: This adds latency and requires internet!

### 2. GitHub Pages

```bash
# Build static site
cp -r client-pwa/public/* docs/

# Push to GitHub
git add docs/
git commit -m "Deploy to GitHub Pages"
git push

# Enable GitHub Pages in repository settings
```

### 3. Netlify

Similar to Vercel:
```bash
npm install -g netlify-cli
netlify deploy --dir=client-pwa/public
```

## 📊 Post-Deployment Checklist

- [ ] PWA accessible via Vercel URL
- [ ] Service worker registered successfully
- [ ] PWA installable on mobile devices
- [ ] Can connect to local server from deployed PWA
- [ ] Settings persist in localStorage
- [ ] Buzzer functionality works end-to-end
- [ ] Tested on multiple devices
- [ ] Custom domain configured (if applicable)

## 🎉 Success!

Your QuizBuz PWA is now globally accessible while maintaining the low-latency benefits of a local server. Share the Vercel URL with participants, start your local server, and enjoy your quiz! 🎯

---

**Questions or Issues?** Check the main [README.md](README.md) or open an issue on GitHub.
