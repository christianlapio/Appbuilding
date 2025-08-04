"use client";

import { useState } from 'react';
import { Type, Palette, Move, Sparkles } from 'lucide-react';
import { ProjectState, CaptionStyle } from '@/types';

interface CaptionsStepProps {
  projectState: ProjectState;
  updateProjectState: (updates: Partial<ProjectState>) => void;
}

const fontFamilies = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Bebas Neue', label: 'Bebas Neue' }
];

const animations = [
  { value: 'none', label: 'None' },
  { value: 'fade', label: 'Fade In' },
  { value: 'slide', label: 'Slide Up' },
  { value: 'pop', label: 'Pop In' }
];

const positions = [
  { value: 'top', label: 'Top' },
  { value: 'center', label: 'Center' },
  { value: 'bottom', label: 'Bottom' }
];

const presetStyles: { name: string; style: Partial<CaptionStyle> }[] = [
  {
    name: 'Classic White',
    style: {
      fontFamily: 'Arial',
      fontSize: 48,
      fontColor: '#FFFFFF',
      backgroundColor: '#000000',
      animation: 'fade',
      position: 'center'
    }
  },
  {
    name: 'Bold & Bright',
    style: {
      fontFamily: 'Bebas Neue',
      fontSize: 56,
      fontColor: '#FFFF00',
      backgroundColor: undefined,
      animation: 'pop',
      position: 'center'
    }
  },
  {
    name: 'Minimal',
    style: {
      fontFamily: 'Helvetica',
      fontSize: 42,
      fontColor: '#FFFFFF',
      backgroundColor: undefined,
      animation: 'slide',
      position: 'bottom'
    }
  },
  {
    name: 'TikTok Style',
    style: {
      fontFamily: 'Montserrat',
      fontSize: 52,
      fontColor: '#FFFFFF',
      backgroundColor: '#000000',
      animation: 'pop',
      position: 'center'
    }
  }
];

export default function CaptionsStep({ projectState, updateProjectState }: CaptionsStepProps) {
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>(projectState.captionStyle);
  const [showBackgroundColor, setShowBackgroundColor] = useState(!!captionStyle.backgroundColor);

  const handleStyleChange = (updates: Partial<CaptionStyle>) => {
    const newStyle = { ...captionStyle, ...updates };
    setCaptionStyle(newStyle);
    updateProjectState({ captionStyle: newStyle });
  };

  const applyPreset = (preset: Partial<CaptionStyle>) => {
    const newStyle = { ...captionStyle, ...preset };
    setCaptionStyle(newStyle);
    updateProjectState({ captionStyle: newStyle });
    setShowBackgroundColor(!!preset.backgroundColor);
  };

  const toggleBackgroundColor = () => {
    const newShowBg = !showBackgroundColor;
    setShowBackgroundColor(newShowBg);
    handleStyleChange({ 
      backgroundColor: newShowBg ? '#000000' : undefined 
    });
  };

  return (
    <div className="space-y-6">
      {/* Preset Styles */}
      <div>
        <h3 className="text-sm font-medium mb-3">Quick Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {presetStyles.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.style)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Customize Style</h3>

        {/* Font Family */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            <Type className="inline h-4 w-4 mr-1" />
            Font Family
          </label>
          <select
            value={captionStyle.fontFamily}
            onChange={(e) => handleStyleChange({ fontFamily: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
          >
            {fontFamilies.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Font Size: {captionStyle.fontSize}px
          </label>
          <input
            type="range"
            min="24"
            max="72"
            value={captionStyle.fontSize}
            onChange={(e) => handleStyleChange({ fontSize: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              <Palette className="inline h-4 w-4 mr-1" />
              Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={captionStyle.fontColor}
                onChange={(e) => handleStyleChange({ fontColor: e.target.value })}
                className="h-10 w-20 bg-gray-800 border border-gray-700 rounded cursor-pointer"
              />
              <input
                type="text"
                value={captionStyle.fontColor}
                onChange={(e) => handleStyleChange({ fontColor: e.target.value })}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showBackgroundColor}
                onChange={toggleBackgroundColor}
                className="h-4 w-4 text-purple-600 bg-gray-800 border-gray-700 rounded"
              />
              {showBackgroundColor && (
                <>
                  <input
                    type="color"
                    value={captionStyle.backgroundColor || '#000000'}
                    onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
                    className="h-10 w-20 bg-gray-800 border border-gray-700 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={captionStyle.backgroundColor || '#000000'}
                    onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Animation */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            <Sparkles className="inline h-4 w-4 mr-1" />
            Animation
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {animations.map((anim) => (
              <button
                key={anim.value}
                onClick={() => handleStyleChange({ animation: anim.value as CaptionStyle['animation'] })}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  captionStyle.animation === anim.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {anim.label}
              </button>
            ))}
          </div>
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            <Move className="inline h-4 w-4 mr-1" />
            Position
          </label>
          <div className="grid grid-cols-3 gap-2">
            {positions.map((pos) => (
              <button
                key={pos.value}
                onClick={() => handleStyleChange({ position: pos.value as CaptionStyle['position'] })}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  captionStyle.position === pos.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-sm font-medium mb-4">Preview</h3>
        <div className="relative aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden max-w-xs mx-auto">
          {/* Mock video background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20" />
          
          {/* Caption preview */}
          <div
            className={`absolute inset-x-0 flex items-center justify-center p-4 ${
              captionStyle.position === 'top' ? 'top-8' :
              captionStyle.position === 'bottom' ? 'bottom-8' :
              'top-1/2 -translate-y-1/2'
            }`}
          >
            <div
              style={{
                fontFamily: captionStyle.fontFamily,
                fontSize: `${captionStyle.fontSize * 0.4}px`,
                color: captionStyle.fontColor,
                backgroundColor: captionStyle.backgroundColor,
                padding: captionStyle.backgroundColor ? '8px 16px' : '0',
                borderRadius: '4px'
              }}
              className="text-center"
            >
              Your Amazing Caption Text
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #9333ea;
          cursor: pointer;
          border-radius: 50%;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #9333ea;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }
      `}</style>
    </div>
  );
}