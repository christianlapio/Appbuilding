# Crayo AI Clone - AI-Powered Short Video Creator

A full-stack web application that automatically creates engaging short-form videos (YouTube Shorts, TikToks, Instagram Reels) using AI. Built with Next.js, Express, and integrated with OpenAI GPT-4 and ElevenLabs APIs.

## 🚀 Features

### ✅ Implemented (MVP)
- **AI Script Generation**: GPT-4 powered script creation from user prompts
- **Multi-step UI**: Clean, guided user experience with progress tracking
- **Voice Selection**: Integration with ElevenLabs for AI voiceovers
- **Background Assets**: Video and music selection system
- **Responsive Design**: Modern UI with Tailwind CSS
- **API Architecture**: RESTful backend with proper error handling

### 🚧 In Progress
- **FFmpeg Video Rendering**: Video composition and export
- **Caption Synchronization**: Auto-generated captions with timing
- **Asset Management**: Background video and music libraries

### 📋 Planned Features
- **Real Video Export**: 9:16 vertical MP4 generation
- **Advanced Captions**: Styled text with animations
- **User Authentication**: Project saving and management
- **Template System**: Pre-built video templates
- **Batch Processing**: Multiple video generation

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations and transitions
- **React Hot Toast** - User notifications
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **OpenAI API** - GPT-4 for script generation
- **ElevenLabs API** - Text-to-speech voiceovers
- **Axios** - HTTP client

### Future Integrations
- **FFmpeg** - Video processing and rendering
- **Firebase/Supabase** - Database and authentication
- **Pexels API** - Stock video backgrounds
- **Whisper API** - Audio transcription

## 📁 Project Structure

```
crayo-ai-clone/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Helper functions
│   ├── uploads/             # File storage
│   └── package.json
├── src/                     # Next.js frontend
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   │   └── steps/           # Multi-step wizard components
│   ├── lib/                 # Utilities and API client
│   └── types/               # TypeScript definitions
├── public/                  # Static assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key (for script generation)
- ElevenLabs API key (for voiceovers)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crayo-ai-clone
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**

   **Backend** (`backend/.env`):
   ```env
   # API Keys
   OPENAI_API_KEY=your_openai_api_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend** (`.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

5. **Start the development servers**

   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

## 📖 API Documentation

### Script Generation
```http
POST /api/script/generate
Content-Type: application/json

{
  "prompt": "How to stay focused while working from home",
  "duration": 60,
  "tone": "energetic"
}
```

### Voice Generation
```http
POST /api/voice/generate
Content-Type: application/json

{
  "script": "Your video script here...",
  "voiceId": "voice-id-from-elevenlabs",
  "speed": 1.0,
  "stability": 0.5
}
```

### Get Available Voices
```http
GET /api/voice/list
```

### Get Background Assets
```http
GET /api/assets/background-videos
GET /api/assets/music
```

## 🎯 User Flow

1. **Prompt Input**: User enters video topic/prompt
2. **Script Generation**: AI generates engaging script using GPT-4
3. **Script Review**: User can edit and customize the script
4. **Voice Selection**: Choose from available AI voices
5. **Background Selection**: Pick background video and optional music
6. **Preview & Generate**: Review settings and generate final video

## 🔧 Development

### Available Scripts

**Frontend**:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**Backend**:
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Start production server

### Code Style
- ESLint + Prettier for code formatting
- TypeScript for type safety
- Conventional commit messages
- Component-based architecture

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Create new project on Railway or Heroku
2. Connect GitHub repository
3. Set environment variables
4. Deploy with automatic builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Environment Variables

### Required
- `OPENAI_API_KEY` - OpenAI API key for GPT-4
- `ELEVENLABS_API_KEY` - ElevenLabs API key for TTS

### Optional
- `PORT` - Backend server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

## 🐛 Known Issues

- Video generation is currently simulated (FFmpeg integration pending)
- File uploads are stored locally (cloud storage integration needed)
- No user authentication system yet
- Limited background video/music library

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Basic UI and API structure
- ✅ Script generation with GPT-4
- ✅ Voice selection and generation
- ✅ Background asset selection

### Phase 2 (Next)
- 🚧 FFmpeg video rendering
- 🚧 Caption generation and synchronization
- 🚧 Real video export functionality

### Phase 3 (Future)
- 📋 User authentication and project saving
- 📋 Advanced caption styling and animations
- 📋 Template system
- 📋 Batch video processing
- 📋 Analytics and usage tracking

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- ElevenLabs for voice synthesis
- Tailwind CSS for styling framework
- Next.js team for the amazing framework
- All the open-source contributors

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/crayo-ai-clone/issues) page
2. Create a new issue with detailed description
3. Join our community discussions

---

**Built with ❤️ by [Your Name]**

*Creating viral content has never been easier!*
