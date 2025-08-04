"use client";

import { useState } from 'react';
import { Download, Loader2, CheckCircle, Video, Share2 } from 'lucide-react';
import { ProjectState } from '@/types';
import { videoAPI } from '@/lib/api';

interface ExportStepProps {
  projectState: ProjectState;
  updateProjectState: (updates: Partial<ProjectState>) => void;
}

export default function ExportStep({ projectState, updateProjectState }: ExportStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleGenerateVideo = async () => {
    if (!projectState.scriptData || !projectState.voiceoverData || 
        !projectState.selectedBackground || !projectState.selectedMusic) {
      setError('Missing required data. Please complete all previous steps.');
      return;
    }

    setError('');
    setIsGenerating(true);
    setProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const response = await videoAPI.generate({
        script: projectState.scriptData.script,
        voiceoverUrl: projectState.voiceoverData.audioUrl,
        backgroundVideoId: projectState.selectedBackground.id,
        backgroundMusicId: projectState.selectedMusic.id,
        captionStyle: projectState.captionStyle,
        musicVolume: projectState.musicVolume
      });

      if (response.success) {
        setProgress(100);
        updateProjectState({ videoData: response.data });
      }
    } catch (err) {
      setError('Failed to generate video. Please try again.');
      console.error(err);
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (projectState.videoData) {
      const link = document.createElement('a');
      link.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${projectState.videoData.videoUrl}`;
      link.download = `crayo-video-${Date.now()}.mp4`;
      link.click();
    }
  };

  const getProjectSummary = () => {
    if (!projectState.scriptData || !projectState.selectedVoice || 
        !projectState.selectedBackground || !projectState.selectedMusic) {
      return null;
    }

    return {
      title: projectState.scriptData.title,
      duration: projectState.scriptData.duration,
      voice: projectState.selectedVoice.name,
      background: projectState.selectedBackground.name,
      music: projectState.selectedMusic.name
    };
  };

  const summary = getProjectSummary();

  return (
    <div className="space-y-6">
      {/* Project Summary */}
      {summary && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Project Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Title:</span>
              <span>{summary.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duration:</span>
              <span>~{summary.duration} seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Voice:</span>
              <span>{summary.voice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Background:</span>
              <span>{summary.background}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Music:</span>
              <span>{summary.music}</span>
            </div>
          </div>
        </div>
      )}

      {/* Generate/Download Section */}
      {!projectState.videoData ? (
        <div className="text-center">
          {!isGenerating ? (
            <>
              <p className="text-gray-400 mb-6">
                Ready to create your video? Click below to start the rendering process.
              </p>
              <button
                onClick={handleGenerateVideo}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity"
              >
                <Video className="h-6 w-6" />
                <span>Generate Video</span>
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-purple-400 mx-auto" />
              <p className="text-lg">Generating your video...</p>
              <p className="text-sm text-gray-400">This may take a minute</p>
              
              {/* Progress Bar */}
              <div className="max-w-md mx-auto">
                <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">{Math.round(progress)}%</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Video Generated Successfully!</h3>
            <p className="text-gray-400">Your video is ready to download</p>
          </div>

          {/* Video Preview */}
          <div className="max-w-md mx-auto">
            <div className="aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden">
              <video
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${projectState.videoData.videoUrl}`}
                controls
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-gray-800 rounded-lg p-4 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Format:</span>
                <p className="font-medium">{projectState.videoData.format.toUpperCase()}</p>
              </div>
              <div>
                <span className="text-gray-400">Resolution:</span>
                <p className="font-medium">{projectState.videoData.resolution}</p>
              </div>
              <div>
                <span className="text-gray-400">Duration:</span>
                <p className="font-medium">{projectState.videoData.duration}s</p>
              </div>
              <div>
                <span className="text-gray-400">Aspect Ratio:</span>
                <p className="font-medium">9:16 (Vertical)</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Download className="h-5 w-5" />
              <span>Download Video</span>
            </button>
            <button
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-600 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>

          {/* Create Another */}
          <div className="text-center pt-6">
            <a
              href="/create"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Create Another Video →
            </a>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 max-w-md mx-auto">
          {error}
        </div>
      )}
    </div>
  );
}