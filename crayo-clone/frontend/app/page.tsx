import Link from 'next/link';
import { Sparkles, Video, Zap, Mic } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Video className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Crayo Clone
            </span>
          </div>
          <Link
            href="/create"
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Start Creating
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Create Viral Short Videos with AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8">
            Turn your ideas into engaging TikToks, Reels, and YouTube Shorts in minutes
          </p>
          <Link
            href="/create"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-5 w-5" />
            <span>Create Your First Video</span>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-purple-600/50 transition-colors">
            <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Script Generation</h3>
            <p className="text-gray-400">
              Generate engaging scripts with GPT-4 from just a simple prompt or YouTube URL
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-pink-600/50 transition-colors">
            <div className="bg-pink-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Mic className="h-6 w-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Natural Voiceovers</h3>
            <p className="text-gray-400">
              Choose from multiple AI voices with different accents and tones for your content
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-purple-600/50 transition-colors">
            <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Export</h3>
            <p className="text-gray-400">
              Get your video ready in minutes with captions, music, and perfect 9:16 format
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-12 max-w-3xl mx-auto border border-purple-600/30">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Amazing Videos?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Join thousands of creators making viral content with AI
          </p>
          <Link
            href="/create"
            className="inline-flex items-center space-x-2 bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <Video className="h-5 w-5" />
            <span>Start Creating Now</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500">
        <p>Built with ❤️ using Next.js, Node.js, and AI</p>
      </footer>
    </div>
  );
}
