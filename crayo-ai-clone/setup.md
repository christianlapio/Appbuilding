# Quick Setup Guide

## 🚀 Getting Started

This Crayo AI Clone is ready to run! Follow these steps:

### 1. Start the Backend Server

```bash
cd backend
node test-server.js
```

The backend will run on `http://localhost:3001`

### 2. Start the Frontend (New Terminal)

```bash
# From the root directory
npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Test the Application

1. Open http://localhost:3000 in your browser
2. Enter a video prompt (e.g., "How to stay focused while working from home")
3. Follow the guided steps to create your video

## 🎯 Current Status

### ✅ Working Features
- **Multi-step UI**: Complete guided video creation flow
- **Script Generation**: Mock AI script generation (real GPT-4 integration ready)
- **Voice Selection**: Mock voice selection (real ElevenLabs integration ready)
- **Background Selection**: Video and music asset selection
- **Responsive Design**: Modern, mobile-friendly interface

### 🚧 Demo Mode
- Currently running in demo mode with mock API responses
- To enable real AI features, add your API keys to `backend/.env`:
  ```
  OPENAI_API_KEY=your_actual_openai_key
  ELEVENLABS_API_KEY=your_actual_elevenlabs_key
  ```

### 📋 Next Steps
- Add FFmpeg for actual video rendering
- Implement real caption generation and synchronization
- Add file upload and storage
- Integrate with cloud services

## 🛠 Architecture

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **APIs**: OpenAI GPT-4 + ElevenLabs TTS (ready for integration)
- **Styling**: Modern, responsive design with step-by-step wizard

## 🎬 Demo Features

Even in demo mode, you can experience:
- Complete user flow from prompt to video preview
- Professional UI/UX design
- Realistic API interactions (with mock responses)
- Responsive design that works on all devices

---

**Ready to create viral content? Start the servers and visit http://localhost:3000!**