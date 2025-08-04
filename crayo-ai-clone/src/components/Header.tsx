'use client';

import { Video, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Video className="w-8 h-8 text-indigo-600" />
              <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crayo AI</h1>
              <p className="text-sm text-gray-500 -mt-1">Create Viral Videos</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#" 
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Templates
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Pricing
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Help
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}