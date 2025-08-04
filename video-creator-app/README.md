# Video Creator AI

A full-stack web application for creating AI-powered short-form videos similar to Crayo.ai. Generate engaging content for TikTok, Instagram Reels, and YouTube Shorts with just a few clicks.

## 🚀 Features

- **AI Script Generation**: Create engaging scripts using GPT-4
- **AI Voiceover**: Generate natural-sounding voiceovers with ElevenLabs
- **Background Videos**: Choose from curated stock video backgrounds
- **Background Music**: Add royalty-free music to enhance your content
- **Auto Captions**: Automatically generate synchronized captions
- **9:16 Format**: Optimized for social media platforms
- **One-Click Export**: Download your video ready for sharing

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Services**: OpenAI GPT-4, ElevenLabs TTS
- **Video Processing**: FFmpeg
- **UI/UX**: Framer Motion, Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- FFmpeg installed on your system
- OpenAI API key
- ElevenLabs API key

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd video-creator-app
npm install
```

### 2. Environment Setup

Copy the `.env.local` file and add your API keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:

```env
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
Download from [FFmpeg official website](https://ffmpeg.org/download.html)

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage Guide

### Step 1: Script Generation
- Enter a topic or paste a YouTube URL
- Click "Generate Script" to create engaging content
- Edit the script if needed

### Step 2: Voice Selection
- Choose from 5+ AI voices
- Preview the voice with your script
- Select the perfect voice for your content

### Step 3: Video Customization
- Select background videos from the library
- Add background music
- Preview your choices

### Step 4: Export
- Review your video settings
- Click "Start Generation" to create your video
- Download the final MP4 file

## 🔧 API Endpoints

### `/api/generate-script`
- **POST**: Generate scripts using GPT-4
- **Body**: `{ prompt?: string, youtubeUrl?: string }`

### `/api/generate-voiceover`
- **POST**: Generate voiceovers using ElevenLabs
- **Body**: `{ script: string, voiceId?: string }`
- **GET**: Get available voices

### `/api/render-video`
- **POST**: Render final video with FFmpeg
- **Body**: `{ audioBase64: string, backgroundVideo?: string, captions: Caption[], backgroundMusic?: string }`

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── generate-script/
│   │   ├── generate-voiceover/
│   │   └── render-video/
│   ├── components/             # React components
│   │   ├── ScriptInput.tsx
│   │   ├── VoiceSelection.tsx
│   │   ├── VideoCustomization.tsx
│   │   └── VideoPreview.tsx
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   └── page.tsx               # Main page
```

## 🔑 API Keys Setup

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Add to your `.env.local` file

### ElevenLabs API Key
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Create an account or sign in
3. Navigate to Profile > API Key
4. Copy your API key
5. Add to your `.env.local` file

## 🎨 Customization

### Adding New Voices
Edit the `AVAILABLE_VOICES` array in `/api/generate-voiceover/route.ts`:

```typescript
const AVAILABLE_VOICES = [
  { id: 'voice_id', name: 'Voice Name', description: 'Description' },
  // Add more voices...
];
```

### Adding Background Videos
Add new videos to the `BACKGROUND_VIDEOS` array in `VideoCustomization.tsx`:

```typescript
const BACKGROUND_VIDEOS: BackgroundVideo[] = [
  {
    id: 'unique_id',
    name: 'Video Name',
    path: '/path/to/video.mp4',
    thumbnail: '/path/to/thumbnail.jpg',
    category: 'category'
  },
  // Add more videos...
];
```

## 🐛 Troubleshooting

### FFmpeg Issues
- Ensure FFmpeg is installed and accessible from command line
- Check if the `ffmpeg` command works in terminal
- For Windows, add FFmpeg to your PATH

### API Key Issues
- Verify API keys are correctly set in `.env.local`
- Check API key permissions and quotas
- Ensure keys are not expired

### Video Generation Fails
- Check browser console for errors
- Verify all required fields are filled
- Ensure sufficient API credits

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Ensure FFmpeg is available in your deployment environment
- Set up environment variables
- Configure build settings for Next.js

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review API documentation for OpenAI and ElevenLabs

---

**Note**: This is an MVP version. Future updates will include user authentication, project saving, more customization options, and advanced video editing features.
