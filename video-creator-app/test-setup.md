# Video Creator AI - Test Setup Guide

## 🚀 Quick Test Instructions

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Open the Application
Navigate to http://localhost:3000 in your browser.

### 3. Test the Application Flow

#### Step 1: Script Generation
- Enter a topic like "How to stay focused" or "5 productivity tips"
- Click "Generate Script"
- Verify that a script is generated and displayed
- Click "Continue to Voice Selection"

#### Step 2: Voice Selection
- Verify that 5 voice options are displayed
- Select a voice (e.g., "Rachel")
- Click "Generate Preview" to test voice generation
- Click "Continue to Customization"

#### Step 3: Video Customization
- Select a background video (e.g., "Abstract Waves")
- Select background music (e.g., "Upbeat Energy")
- Click "Continue to Preview & Export"

#### Step 4: Preview & Export
- Click "Start Generation"
- Watch the progress steps:
  - Generating Voiceover
  - Creating Captions
  - Rendering Video
- Verify that the video is generated and can be downloaded

## 🔧 Environment Variables Required

Make sure you have set up your `.env.local` file with:

```env
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🐛 Common Issues & Solutions

### 1. API Key Issues
- **Error**: "Failed to generate script"
- **Solution**: Verify your OpenAI API key is correct and has credits

### 2. Voice Generation Issues
- **Error**: "Failed to generate voiceover"
- **Solution**: Verify your ElevenLabs API key is correct

### 3. Video Rendering Issues
- **Error**: "Failed to render video"
- **Solution**: Ensure FFmpeg is installed on your system

### 4. TypeScript Errors
- **Error**: Compilation errors
- **Solution**: Run `npx tsc --noEmit` to check for type errors

## 📋 Expected Behavior

### Frontend
- ✅ Multi-step form with progress indicator
- ✅ Script generation with GPT-4
- ✅ Voice selection with preview
- ✅ Background video and music selection
- ✅ Video generation with progress tracking
- ✅ Download functionality

### Backend APIs
- ✅ `/api/generate-script` - Script generation
- ✅ `/api/generate-voiceover` - Voice generation
- ✅ `/api/render-video` - Video rendering

## 🎯 Success Criteria

The application is working correctly if:
1. You can generate a script from a topic
2. You can select and preview AI voices
3. You can customize background videos and music
4. You can generate and download a final video
5. The video is in 9:16 format suitable for social media

## 📞 Troubleshooting

If you encounter issues:
1. Check the browser console for errors
2. Check the terminal for server errors
3. Verify all API keys are set correctly
4. Ensure FFmpeg is installed and accessible
5. Check network connectivity for API calls