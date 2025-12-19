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
    <main className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        {!showAR ? (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-5">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-50 tracking-tight">
                GitLens <span className="text-indigo-400">AR</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Transform GitHub data into immersive 3D experiences with custom visualization algorithms
              </p>
              <p className="text-sm text-slate-500 italic">
                Featuring unique pulsing animations, wave effects, and dynamic sizing
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-slate-700/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="repoUrl" className="block text-base font-medium text-slate-300 mb-3">
                    Repository URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="repoUrl"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-100 placeholder-slate-500"
                      placeholder="https://github.com/username/repo"
                      required
                    />
                    {error && (
                      <p className="absolute -bottom-6 left-0 text-rose-400 text-sm">
                        {error}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

              <div className="mt-8 border-t border-slate-700 pt-6">
                <h3 className="text-base font-medium text-slate-300 mb-5">What you'll see</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: '3D Branch Trees', desc: 'Visualize branches in 3D space' },
                    { title: 'Commit Timeline', desc: 'See commit history floating in AR' },
                    { title: 'Contributor Avatars', desc: 'View contributor activity in space' },
                    { title: 'Visual Effects', desc: 'Beautiful animations for code changes' },
                  ].map((feature, i) => (
                    <div key={i} className="bg-slate-900/40 rounded-xl p-4 hover:bg-slate-900/60 transition-all duration-200 border border-slate-800">
                      <h4 className="font-medium text-slate-200 mb-1">{feature.title}</h4>
                      <p className="text-sm text-slate-400">{feature.desc}</p>
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
                className="flex items-center space-x-2 text-slate-400 hover:text-slate-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-2 bg-slate-800/60 px-4 py-2 rounded-xl hover:bg-slate-700/60 transition-colors duration-200 border border-slate-700"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <div className="relative bg-slate-950/40 rounded-2xl overflow-hidden min-h-[600px] border border-slate-800">
              <ARVisualization repoUrl={repoUrl} />
              <Footer />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
