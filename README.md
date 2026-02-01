# AlligatorBrain 🐊

A modern, lightweight Notion replacement for daily notes and productivity. Built with Next.js, React, and TypeScript.

## Features

- 📝 **Rich Note Taking**: Create and edit notes with a clean, distraction-free interface
- 🔍 **Smart Search**: Quickly find notes by title or content
- 💾 **Auto-Save**: Notes are automatically saved to browser localStorage
- 🌓 **Dark Mode**: Automatic dark mode support based on system preferences
- ⚡ **Fast & Lightweight**: Built with Next.js for optimal performance
- 🎨 **Modern UI**: Clean, Notion-inspired interface using Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AlligatorBrain/alligatorbrain-ops.git
cd alligatorbrain-ops
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Create a new note**: Click the "+" button in the sidebar
- **Edit a note**: Click on any note in the sidebar to open it
- **Search notes**: Use the search bar at the top of the sidebar
- **Delete a note**: Click the trash icon on any note (confirmation required)

All notes are automatically saved to your browser's localStorage.

## Building for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Storage**: Browser localStorage

## License

MIT
