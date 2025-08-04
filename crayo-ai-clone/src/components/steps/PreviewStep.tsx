'use client';

import { useState } from 'react';
import { ProjectState } from '@/types';
import { Download, ArrowLeft, Loader2, Play, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface PreviewStepProps {
  projectState: ProjectState;
  updateProjectState: (updates: Partial<ProjectState>) => void;
  onPrev: () => void;
}

export default function PreviewStep({ projectState, updateProjectState, onPrev }: PreviewStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'completed' | 'error'>('idle');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const generateVideo = async () => {
    if (!projectState.script || !projectState.selectedVoice || !projectState.selectedBackgroundVideo) {
      toast.error('Missing required components for video generation');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('generating');
    setGenerationProgress(0);

    try {
      // Simulate video generation progress
      const progressSteps = [
        { progress: 20, message: 'Generating captions...' },
        { progress: 40, message: 'Processing voiceover...' },
        { progress: 60, message: 'Compositing video layers...' },
        { progress: 80, message: 'Adding background music...' },
        { progress: 100, message: 'Finalizing video...' }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setGenerationProgress(step.progress);
        toast.loading(step.message, { id: 'generation-progress' });
      }

      // Simulate successful completion
      setGenerationStatus('completed');
      setVideoUrl('/demo-video.mp4'); // Placeholder URL
      toast.dismiss('generation-progress');
      toast.success('Video generated successfully!');

    } catch (error: unknown) {
      console.error('Video generation error:', error);
      setGenerationStatus('error');
      toast.dismiss('generation-progress');
      toast.error('Failed to generate video. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = () => {
    if (!videoUrl) return;
    
    // In a real implementation, this would trigger a file download
    toast.success('Video download started!');
  };

  const resetAndStartOver = () => {
    updateProjectState({
      prompt: '',
      script: '',
      selectedVoice: null,
      selectedBackgroundVideo: null,
      selectedMusic: null,
      captions: [],
      audioUrl: '',
      audioDuration: 0,
    });
    window.location.reload(); // Simple reset for demo
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {generationStatus === 'completed' ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : generationStatus === 'error' ? (
              <AlertCircle className="w-8 h-8 text-red-600" />
            ) : (
              <Play className="w-8 h-8 text-green-600" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {generationStatus === 'completed' ? 'Video Ready!' : 'Preview & Generate'}
          </h2>
          <p className="text-gray-600">
            {generationStatus === 'completed' 
              ? 'Your video has been generated successfully. Preview and download below.'
              : 'Review your video settings and generate the final video.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Preview</h3>
            <div className="aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden relative">
              {generationStatus === 'completed' && videoUrl ? (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-semibold">Video Preview</p>
                    <p className="text-sm opacity-75">Click to play</p>
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                    <p className="text-lg font-semibold">Generating Video...</p>
                    <div className="w-48 bg-gray-700 rounded-full h-2 mt-4">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                    <p className="text-sm mt-2">{generationProgress}% Complete</p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Preview will appear here</p>
                    <p className="text-sm">Generate video to see preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Summary</h3>
            <div className="space-y-4">
              {/* Prompt */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Original Prompt</h4>
                <p className="text-sm text-gray-700">{projectState.prompt}</p>
              </div>

              {/* Script */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Script</h4>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {projectState.script.substring(0, 150)}
                  {projectState.script.length > 150 ? '...' : ''}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {projectState.script.split(' ').length} words
                </p>
              </div>

              {/* Voice */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Selected Voice</h4>
                <p className="text-sm text-gray-700">
                  {projectState.selectedVoice?.name} ({projectState.selectedVoice?.gender}, {projectState.selectedVoice?.accent})
                </p>
              </div>

              {/* Background */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Background</h4>
                <p className="text-sm text-gray-700 mb-1">
                  Video: {projectState.selectedBackgroundVideo?.title}
                </p>
                <p className="text-sm text-gray-700">
                  Music: {projectState.selectedMusic?.title || 'None'}
                </p>
              </div>

              {/* Video Specs */}
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h4 className="font-medium text-indigo-900 mb-2">Video Specifications</h4>
                <div className="text-sm text-indigo-800 space-y-1">
                  <p>• Format: 9:16 vertical (1080x1920)</p>
                  <p>• Duration: ~{Math.round(projectState.audioDuration || 45)} seconds</p>
                  <p>• Quality: HD (1080p)</p>
                  <p>• File type: MP4</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generation Status */}
        {generationStatus === 'error' && (
          <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <h4 className="font-semibold text-red-900">Generation Failed</h4>
            </div>
            <p className="text-sm text-red-800 mt-1">
              There was an error generating your video. Please try again or contact support if the issue persists.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onPrev}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-3">
            {generationStatus === 'completed' ? (
              <>
                <button
                  onClick={resetAndStartOver}
                  className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Create Another
                </button>
                <button
                  onClick={downloadVideo}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Video</span>
                </button>
              </>
            ) : (
              <button
                onClick={generateVideo}
                disabled={isGenerating || !projectState.script || !projectState.selectedVoice || !projectState.selectedBackgroundVideo}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Generate Video</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Tips */}
        {generationStatus === 'idle' && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">🎬 Generation Tips:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Video generation typically takes 2-5 minutes</li>
              <li>• Don&apos;t close this tab while generating</li>
              <li>• The final video will be optimized for social media</li>
              <li>• You can download the video multiple times</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}