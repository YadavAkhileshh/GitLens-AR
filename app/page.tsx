'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Footer from '../components/Footer';

// Dynamically import AR component to avoid SSR issues
const ARVisualization = dynamic(() => import('../components/ARVisualization'), {
  ssr: false,
});

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [showAR, setShowAR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate GitHub URL format
    const urlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/;
    if (!urlPattern.test(repoUrl)) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowAR(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setShowAR(false);
    setRepoUrl('');
    setError('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white p-4">
      <div className="container mx-auto max-w-4xl">
        {!showAR ? (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                GitLens AR
              </h1>
              <p className="text-xl text-gray-300">
                Experience your GitHub repositories in Augmented Reality
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 md:p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="repoUrl" className="block text-lg font-medium text-gray-200 mb-2">
                    GitHub Repository URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="repoUrl"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                      placeholder="https://github.com/username/repo"
                      required
                    />
                    {error && (
                      <p className="absolute -bottom-6 left-0 text-red-400 text-sm">
                        {error}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold text-white shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'View in AR'
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: '3D Branch Trees', desc: 'Visualize branches in 3D space' },
                    { title: 'Commit Timeline', desc: 'See commit history floating in AR' },
                    { title: 'Contributor Avatars', desc: 'View contributor activity in space' },
                    { title: 'Visual Effects', desc: 'Beautiful animations for code changes' },
                  ].map((feature, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors duration-200">
                      <h4 className="font-medium text-purple-400">{feature.title}</h4>
                      <p className="text-sm text-gray-300">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Share Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative bg-black/30 rounded-xl overflow-hidden min-h-[600px]">
              <ARVisualization repoUrl={repoUrl} />
              <Footer />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
