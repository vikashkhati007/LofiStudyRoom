# 🎵 LofiStudyRoom

LofiStudyRoom is a modern, feature-rich web app designed to create the ultimate ambient environment for students, professionals, and creators. Enjoy curated lofi study music, customizable themes, and ambient sounds that boost focus, concentration, and productivity. Whether you’re preparing for exams, working remotely, or relaxing after a long day, LofiStudyRoom delivers seamless study sessions with beautiful visuals and powerful productivity tools like Pomodoro timers and a global chat.

## ✨ Features

### 🎧 Music Player
- **Multi-theme playlists**: Study Lofi and Ambient collections
- **Playback controls**: Play, pause, skip, and volume control
- **Variable speed**: Adjust playback speed (0.75x, 1x, 1.25x)
- **Seamless transitions**: Auto-play next track with smooth transitions

### 🌅 Dynamic Themes
- **Visual backgrounds**: Immersive video backgrounds for each theme
- **Theme-based playlists**: Curated music collections for different moods
- **Smooth switching**: Instant theme changes with visual feedback

### 🌧️ Ambient Sounds
- **Rain sounds**: Adjustable rain audio for focus
- **Fire crackling**: Cozy fireplace ambiance
- **Ocean waves**: Calming wave sounds
- **Individual volume controls**: Mix and match ambient sounds

### ⏱️ Pomodoro Timer
- **Work/break sessions**: Customizable durations (1-60 minutes)
- **Voice notifications**: Audio countdown alerts
- **Visual feedback**: Progress display with session indicators
- **Desktop notifications**: Browser notifications for session completion

### 💬 World Chat
- **Real-time messaging**: Connect with other users globally
- **Floating interface**: Non-intrusive chat window
- **Unread indicators**: Message count badges
- **Smooth animations**: Elegant message transitions

### 🎨 Beautiful UI
- **iOS-style glass effects**: Modern glassmorphism design
- **Dynamic islands**: iPhone-inspired notification system
- **Responsive design**: Works seamlessly on all devices
- **Smooth animations**: Framer Motion powered transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vikashkhati007/lofi-player.git
   cd lofi-player
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using yarn
   yarn install
   
   # Using pnpm
   pnpm install
   
   # Using bun
   bun install
   ```

3. **Start the development server**
   ```bash
   # Using npm
   npm run dev
   
   # Using yarn
   yarn dev
   
   # Using pnpm
   pnpm dev
   
   # Using bun
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library
- **Backend**: [Appwrite](https://appwrite.io/) - Backend as a Service for chat functionality
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icon pack
- **Forms**: [React Hook Form](https://react-hook-form.com/) - Performant forms with validation

## 📁 Project Structure

```
lofi-player/
├── app/                    # Next.js app directory
│   ├── components/         # Page-specific components
│   │   ├── dynamic-island.tsx
│   │   ├── timer-dynamic-island.tsx
│   │   ├── toast-notification.tsx
│   │   └── world-chat.tsx
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page component
├── components/             # Reusable UI components
│   ├── ui/                 # Shadcn/ui components
│   └── theme-provider.tsx  # Theme context provider
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── public/                 # Static assets
│   ├── music/              # Audio files
│   ├── videos/             # Background videos
│   └── *.mp3               # Ambient sound files
├── styles/                 # Additional stylesheets
└── types/                  # TypeScript type definitions
```

## 🎵 Adding Music

1. **Place audio files** in the `public/music/` directory
2. **Update playlists** in `app/page.tsx`:
   ```typescript
   const themePlaylists = {
     "study-lofi": [
       {
         title: "Your Track Title",
         artist: "Artist Name",
         src: "/music/your-track.mp3",
       },
       // Add more tracks...
     ],
   };
   ```

## 🎨 Customizing Themes

Add new themes by updating the themes array in `app/page.tsx`:

```typescript
const themes = [
  {
    id: "your-theme",
    name: "Your Theme Name",
    video: "/videos/your-video.mp4",
    color: "from-your-color/20 to-your-color/20",
  },
];
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## 🙏 Acknowledgments

- **Music**: Curated lofi and ambient tracks for the perfect study atmosphere
- **Design inspiration**: Modern iOS design patterns and glassmorphism
- **Community**: Thanks to all contributors and users

## 📞 Support

If you encounter any issues or have questions:

- 🐛 [Report bugs](https://github.com/vikashkhati007/lofi-player/issues)
- 💡 [Request features](https://github.com/vikashkhati007/lofi-player/issues)
- 💬 [Join discussions](https://github.com/vikashkhati007/lofi-player/discussions)

---

<div align="center">
  <p>Made with ❤️ for the study and work community</p>
  <p>
    <a href="#-lofi-player">⬆️ Back to top</a>
  </p>
</div>
