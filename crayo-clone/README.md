# Crayo Clone - AI-Powered Short-Form Video Creator

A full-stack web application that allows users to automatically create short-form videos (YouTube Shorts, TikToks, Reels) using AI. Built with modern technologies and a clean, intuitive interface.

## 🚀 Features

- **AI Script Generation**: Generate engaging scripts using GPT-4 from prompts or YouTube URLs
- **Natural Voiceovers**: Multiple AI voices with different accents and tones (ElevenLabs integration)
- **Smart Background Selection**: Auto-select background videos based on script content
- **Customizable Captions**: Style your captions with different fonts, colors, animations, and positions
- **Background Music**: Add royalty-free music with adjustable volume
- **9:16 Vertical Format**: Perfect for TikTok, YouTube Shorts, and Instagram Reels
- **Export Ready Videos**: Download your finished videos in MP4 format

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - API calls

### Backend
- **Node.js + Express** - Server framework
- **TypeScript** - Type safety
- **OpenAI API** - GPT-4 for script generation
- **ElevenLabs API** - Text-to-speech
- **FFmpeg** - Video processing
- **Multer** - File handling

## 📁 Project Structure

```
crayo-clone/
├── frontend/              # Next.js frontend application
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── lib/             # API client and utilities
│   └── types/           # TypeScript types
│
└── backend/              # Express backend API
    ├── src/
    │   ├── routes/      # API routes
    │   ├── controllers/ # Route controllers
    │   ├── services/    # Business logic
    │   └── types/       # TypeScript types
    └── generated/       # Generated video/audio files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- FFmpeg installed on your system
- API Keys:
  - OpenAI API key (for GPT-4)
  - ElevenLabs API key (for text-to-speech)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crayo-clone
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create `.env` file in backend directory:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```
PORT=3001
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
FRONTEND_URL=http://localhost:3000
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Usage

1. **Create Script**: Enter a prompt or YouTube URL, select tone
2. **Choose Voice**: Select from available AI voices and generate voiceover
3. **Select Background**: Choose background video and music
4. **Style Captions**: Customize caption appearance and animations
5. **Export**: Generate and download your video

## 🔧 API Endpoints

### Script Generation
- `POST /api/script/generate` - Generate script from prompt/URL
- `POST /api/script/transcript` - Extract YouTube transcript

### Voiceover
- `GET /api/voiceover/voices` - Get available voices
- `POST /api/voiceover/generate` - Generate voiceover
- `GET /api/voiceover/preview/:voiceId` - Preview voice

### Video
- `GET /api/video/backgrounds` - Get background videos
- `GET /api/video/music` - Get background music
- `POST /api/video/auto-select-background` - Auto-select background
- `POST /api/video/generate` - Generate final video

## 🎨 Customization

### Adding Background Videos/Music
Edit the arrays in `backend/src/services/media.service.ts` to add your own background videos and music tracks.

### Styling
The frontend uses Tailwind CSS. Modify the color scheme and styling in the component files.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔮 Future Enhancements

- User authentication and project saving
- More video effects and transitions
- Custom avatar generation
- Video templates
- Social media direct upload
- Analytics dashboard