'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { VideoProject, GenerationStep } from '@/types';

interface VideoPreviewProps {
  project: Partial<VideoProject>;
  onPrevious: () => void;
  generationSteps: GenerationStep[];
  setGenerationSteps: (steps: GenerationStep[] | ((prev: GenerationStep[]) => GenerationStep[])) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const INITIAL_STEPS: GenerationStep[] = [
  { id: 'voiceover', title: 'Generating Voiceover', description: 'Creating AI voiceover from script', status: 'pending' },
  { id: 'captions', title: 'Creating Captions', description: 'Generating synchronized captions', status: 'pending' },
  { id: 'render', title: 'Rendering Video', description: 'Combining all elements into final video', status: 'pending' },
];

export default function VideoPreview({ 
  project, 
  onPrevious, 
  generationSteps, 
  setGenerationSteps, 
  isProcessing, 
  setIsProcessing 
}: VideoPreviewProps) {
  const [finalVideo, setFinalVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const startGeneration = async () => {
    if (!project.script || !project.voiceId) {
      alert('Please complete the previous steps first.');
      return;
    }

    setIsProcessing(true);
    setGenerationSteps(INITIAL_STEPS);

    try {
      // Step 1: Generate voiceover
      setGenerationSteps(prev => 
        prev.map(step => 
          step.id === 'voiceover' ? { ...step, status: 'processing' as const } : step
        )
      );

      const voiceoverResponse = await fetch('/api/generate-voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: project.script,
          voiceId: project.voiceId,
        }),
      });

      if (!voiceoverResponse.ok) throw new Error('Voiceover generation failed');
      const voiceoverData = await voiceoverResponse.json();

      setGenerationSteps(prev => 
        prev.map(step => 
          step.id === 'voiceover' ? { ...step, status: 'completed' as const } : step
        )
      );

      // Step 2: Generate captions
      setGenerationSteps(prev => 
        prev.map(step => 
          step.id === 'captions' ? { ...step, status: 'processing' as const } : step
        )
      );

      // Simple caption generation based on script
      const captions = generateCaptions(project.script || '');

      setGenerationSteps(prev => 
        prev.map(step => 
          step.id === 'captions' ? { ...step, status: 'completed' as const } : step
        )
      );

      // Step 3: Render final video
      setGenerationSteps(prev => 
        prev.map(step => 
          step.id === 'render' ? { ...step, status: 'processing' as const } : step
        )
      );

      const renderResponse = await fetch('/api/render-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: voiceoverData.audio,
          backgroundVideo: project.backgroundVideo?.path,
          captions: captions,
          backgroundMusic: project.backgroundMusic?.path,
          outputFileName: 'final-video.mp4',
        }),
      });

      if (!renderResponse.ok) throw new Error('Video rendering failed');
      const renderData = await renderResponse.json();

      setFinalVideo(renderData.video);
      setGenerationSteps(prev => 
        prev.map(step => 
          step.id === 'render' ? { ...step, status: 'completed' as const } : step
        )
      );

    } catch (error) {
      console.error('Generation error:', error);
      setGenerationSteps(prev => 
        prev.map(step => 
          step.status === 'processing' ? { ...step, status: 'error' as const } : step
        )
      );
      alert('Failed to generate video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateCaptions = (script: string): any[] => {
    // Simple caption generation - split script into sentences
    const sentences = script.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const captions: any[] = [];
    const durationPerSentence = 60 / sentences.length; // Assume 60 second video

    sentences.forEach((sentence, index) => {
      captions.push({
        text: sentence.trim(),
        startTime: index * durationPerSentence,
        endTime: (index + 1) * durationPerSentence,
        y: 1400 + (index % 2) * 60, // Alternate between two lines
      });
    });

    return captions;
  };

  const playVideo = () => {
    if (finalVideo) {
      const video = new Audio(`data:video/mp4;base64,${finalVideo}`);
      video.play();
      setIsPlaying(true);
      video.onended = () => setIsPlaying(false);
    }
  };

  const downloadVideo = () => {
    if (finalVideo) {
      const link = document.createElement('a');
      link.href = `data:video/mp4;base64,${finalVideo}`;
      link.download = 'video-creator-ai-video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Preview & Export
        </h2>
        <p className="text-lg text-gray-600">
          Review your video and download the final result
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Video Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Final Video</h3>
          
          {finalVideo ? (
            <div className="space-y-4">
              <div className="aspect-[9/16] bg-black rounded-lg flex items-center justify-center">
                <video
                  src={`data:video/mp4;base64,${finalVideo}`}
                  className="w-full h-full object-cover rounded-lg"
                  controls
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={playVideo}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </button>
                <button
                  onClick={downloadVideo}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          ) : (
            <div className="aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600">Video will appear here after generation</p>
              </div>
            </div>
          )}
        </div>

        {/* Generation Progress */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Generation Progress</h3>
          
          {!isProcessing && !finalVideo && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Ready to generate your video?</p>
              <button
                onClick={startGeneration}
                className="bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Start Generation
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-4">
              {generationSteps.map((step) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-3 p-3 rounded-lg border"
                >
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{step.title}</p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {finalVideo && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-800 font-medium">Video generated successfully!</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Video Details:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Duration: ~60 seconds</li>
                  <li>• Format: MP4 (9:16)</li>
                  <li>• Quality: HD (1080x1920)</li>
                  <li>• Voice: {project.voiceId}</li>
                  {project.backgroundVideo && (
                    <li>• Background: {project.backgroundVideo.name}</li>
                  )}
                  {project.backgroundMusic && (
                    <li>• Music: {project.backgroundMusic.name}</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        {finalVideo && (
          <button
            onClick={downloadVideo}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Video
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">📱 Export Tips</h3>
        <ul className="text-blue-800 space-y-2">
          <li>• Your video is optimized for TikTok, Instagram Reels, and YouTube Shorts</li>
          <li>• The 9:16 aspect ratio ensures perfect display on mobile devices</li>
          <li>• Download and share directly to your social media platforms</li>
          <li>• You can create multiple variations by going back and changing settings</li>
        </ul>
      </div>
    </div>
  );
}