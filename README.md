# VideoGrab

A modern video downloader web application built with React, TypeScript, and Express. Download videos from YouTube, Vimeo, Dailymotion, Facebook, and Twitter.

![VideoGrab Screenshot](https://via.placeholder.com/800x400?text=VideoGrab+Interface)

## Features

- **Multi-Platform Support** - Download from YouTube, Vimeo, Dailymotion, Facebook, and Twitter
- **Format Selection** - Choose between MP4, WebM, or Audio-only MP3
- **Quality Options** - Select from 1080p HD, 720p, 480p, or 360p
- **Progress Tracking** - Real-time download progress with visual feedback
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works beautifully on desktop and mobile

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **Build Tool**: Vite
- **State Management**: TanStack Query

## Running in GitHub Codespaces

1. **Open in Codespaces**
   - Go to the repository on GitHub
   - Click the green **Code** button
   - Select **Codespaces** tab
   - Click **Create codespace on main**

2. **Wait for Setup**
   - Codespaces will automatically install dependencies
   - The dev server will start automatically

3. **Access the App**
   - A notification will appear when the app is ready
   - Click **Open in Browser** to view the app
   - Or check the **PORTS** tab and click the port 5000 link

## Running Locally

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/kushllll/VideoGrab.git
cd VideoGrab

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5000`

## Project Structure

```
VideoGrab/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── pages/         # Page components
│   └── index.html
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage interface
├── shared/                 # Shared types and schemas
│   └── schema.ts
└── package.json
```

## API Endpoints

- `POST /api/parse-url` - Parse video URL and get video information
- `POST /api/download` - Start a download request
- `GET /api/download/:id/status` - Get download status

## License

2025 DMCA

## Note

This application is for educational purposes. Please respect copyright laws and only download content you have permission to download.
