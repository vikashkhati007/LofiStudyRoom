# 🤝 Contributing to Lofi Player

Thank you for your interest in contributing to Lofi Player! We welcome contributions from developers of all skill levels. This guide will help you get started with contributing to our beautiful lofi music player.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Types of Contributions](#types-of-contributions)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community and Support](#community-and-support)

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a friendly, safe, and welcoming environment for all contributors, regardless of experience level, gender identity, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Expected Behavior

- ✅ Be respectful and inclusive
- ✅ Use welcoming and inclusive language
- ✅ Be collaborative and helpful
- ✅ Focus on what's best for the community
- ✅ Show empathy towards other community members

### Unacceptable Behavior

- ❌ Harassment, trolling, or discriminatory language
- ❌ Personal attacks or insults
- ❌ Publishing private information without permission
- ❌ Spam or irrelevant content

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

- **Node.js 18+** or **Bun** installed
- **Git** for version control
- A **GitHub account**
- Basic knowledge of **TypeScript**, **React**, and **Next.js**

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/lofi-player.git
   cd lofi-player
   ```

2. **Add the upstream remote**
   ```bash
   git remote add upstream https://github.com/vikashkhati007/lofi-player.git
   ```

3. **Install dependencies**
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

4. **Start the development server**
   ```bash
   npm run dev  # or yarn dev, pnpm dev, bun dev
   ```

5. **Verify setup**
   - Open [http://localhost:3000](http://localhost:3000)
   - Ensure the app loads and music plays correctly

## 🔄 Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features (e.g., `feature/add-spotify-integration`)
- `fix/` - Bug fixes (e.g., `fix/timer-notification-bug`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/audio-context-management`)
- `style/` - UI/styling changes (e.g., `style/improve-mobile-layout`)

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code patterns
   - Add comments for complex logic

3. **Test your changes**
   ```bash
   npm run build     # Ensure build works
   npm run lint      # Check for linting errors
   ```

4. **Commit with descriptive messages**
   ```bash
   git add .
   git commit -m "feat(player): add shuffle functionality to music player"
   ```

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `style` - Code formatting (no logic changes)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```bash
feat(timer): add custom work/break duration settings
fix(chat): resolve message ordering issue
docs(readme): update installation instructions
style(ui): improve glassmorphism effects
```

## 🎯 Types of Contributions

### 🆕 Feature Contributions

- **Music Features**: New audio formats, playlist management, crossfade
- **UI/UX Improvements**: New themes, animations, accessibility features
- **Productivity Tools**: Enhanced timer, task management, focus modes
- **Chat Features**: Emoji reactions, file sharing, moderation tools
- **Performance**: Audio optimization, caching, loading improvements

### 🐛 Bug Fixes

- Audio playback issues
- Timer accuracy problems
- Chat connectivity issues
- UI responsiveness bugs
- Memory leaks or performance issues

### 📖 Documentation

- Code comments and JSDoc
- README improvements
- API documentation
- Tutorial creation
- Translation of docs

### 🎨 Design Contributions

- New theme designs
- Icon improvements
- Animation enhancements
- Mobile responsiveness
- Accessibility improvements

## 📏 Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Use interfaces for object types
interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
}

// ✅ Good: Use descriptive function names
const calculateRemainingTime = (totalSeconds: number): string => {
  // Implementation
};

// ✅ Good: Use proper error handling
try {
  await audioElement.play();
} catch (error) {
  console.error('Failed to play audio:', error);
  showErrorNotification('Audio playback failed');
}
```

### React Component Guidelines

```tsx
// ✅ Good: Use proper component structure
interface PlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onTogglePlay,
  volume,
  onVolumeChange,
}) => {
  return (
    <div className="flex items-center gap-4">
      {/* Component content */}
    </div>
  );
};
```

### Styling Guidelines

- Use **Tailwind CSS** for styling
- Follow existing design patterns
- Maintain **glassmorphism** aesthetic
- Ensure **mobile responsiveness**
- Use **semantic color names**

```tsx
// ✅ Good: Consistent styling patterns
<button className="ios-glass rounded-full p-3 text-white hover:bg-white/20 transition-all duration-200">
  <Play className="h-5 w-5" />
</button>
```

### File Organization

```
src/
├── app/
│   ├── components/          # Page-specific components
│   │   ├── dynamic-island.tsx
│   │   └── world-chat.tsx
│   ├── globals.css         # Global styles
│   └── page.tsx           # Main page
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   └── player/           # Player-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── types/               # TypeScript type definitions
```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure your code follows our standards**
2. **Test thoroughly on different devices**
3. **Update documentation if needed**
4. **Add screenshots for UI changes**
5. **Rebase your branch on latest main**

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Audio playback works
- [ ] Timer functionality works
- [ ] Chat features work

## Screenshots (if applicable)
[Add screenshots here]

## Additional Notes
Any additional information or context.
```

### Review Process

1. **Automated checks** must pass (linting, build)
2. **Code review** by maintainers
3. **Testing** on multiple devices
4. **Approval** from at least one maintainer
5. **Merge** after all checks pass

## 🐛 Issue Guidelines

### Bug Reports

Use our bug report template:

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
Add screenshots if applicable.

**Environment**
- OS: [e.g., Windows 10, macOS Big Sur]
- Browser: [e.g., Chrome 96, Firefox 94]
- Device: [e.g., Desktop, iPhone 12]
```

### Feature Requests

```markdown
**Feature Description**
Describe the feature you'd like to see.

**Use Case**
Explain how this feature would be used.

**Alternative Solutions**
Describe alternatives you've considered.

**Additional Context**
Any other context or screenshots.
```

## 🏷️ Labels and Milestones

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `documentation` - Improvements to docs
- `ui/ux` - User interface and experience
- `performance` - Performance improvements
- `accessibility` - Accessibility improvements

### Priority Labels

- `priority: high` - Critical issues
- `priority: medium` - Important features
- `priority: low` - Nice to have

## 🎵 Adding Music and Assets

### Music Contributions

1. **Ensure proper licensing** (Creative Commons, public domain, or explicit permission)
2. **Use appropriate formats** (MP3, OGG, WebM)
3. **Optimize file sizes** (aim for <5MB per track)
4. **Add metadata** in the playlist configuration

```typescript
const newTrack = {
  title: "Your Track Title",
  artist: "Artist Name",
  src: "/music/your-track.mp3",
  duration: 180, // in seconds
  license: "CC BY 4.0", // License information
};
```

### Video/Image Assets

- **Optimize for web** (use appropriate compression)
- **Ensure licensing compliance**
- **Maintain aspect ratios** for themes
- **Test on different screen sizes**

## 🌟 Recognition

### Contributors

All contributors will be:

- **Listed** in our contributors section
- **Mentioned** in release notes for significant contributions
- **Invited** to our contributor Discord (coming soon)
- **Eligible** for contributor swag (for major contributions)

### How to Get Started

1. **Browse issues** labeled `good first issue`
2. **Join discussions** on existing issues
3. **Propose new features** via issues
4. **Improve documentation**
5. **Help with testing** on different devices

## 📞 Community and Support

### Getting Help

- 💬 **GitHub Discussions** - General questions and ideas
- 🐛 **GitHub Issues** - Bug reports and feature requests
- 📧 **Email** - For security issues or private matters

### Communication

- Be respectful and constructive
- Search existing issues before creating new ones
- Provide clear, detailed information
- Follow up on your contributions

## 📚 Resources

### Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

### Project-Specific Guides

- [Audio Context API Guide](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

---

## 🙏 Thank You!

Thank you for taking the time to contribute to Lofi Player! Every contribution, no matter how small, helps make this project better for everyone. We appreciate your efforts to improve the study and work experience for our community.

**Happy coding! 🎵✨**

---

*For questions about this contributing guide, please [open an issue](https://github.com/vikashkhati007/lofi-player/issues) or reach out to the maintainers.*
