'use client';

import { useState, useRef, useEffect } from 'react';

export default function FormAnalyzer() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setAnalysis(null);
    }
  };

  const analyzeForm = async () => {
    if (!videoFile) return;
    
    setAnalyzing(true);
    
    // Simulate AI analysis (in production, this would use MediaPipe/TensorFlow)
    setTimeout(() => {
      const mockAnalysis = {
        overallScore: Math.floor(Math.random() * 30) + 70,
        keyPoints: [
          {
            name: 'Arm Angle',
            score: Math.floor(Math.random() * 30) + 70,
            feedback: 'Good arm slot. Maintain 3/4 arm angle for optimal velocity.',
            status: 'good'
          },
          {
            name: 'Hip Rotation',
            score: Math.floor(Math.random() * 30) + 60,
            feedback: 'Hips could rotate more explosively. Focus on driving from back leg.',
            status: 'warning'
          },
          {
            name: 'Stride Length',
            score: Math.floor(Math.random() * 30) + 75,
            feedback: 'Excellent stride length. Maintain this for power generation.',
            status: 'good'
          },
          {
            name: 'Follow Through',
            score: Math.floor(Math.random() * 30) + 65,
            feedback: 'Finish could be more complete. Extend through release point.',
            status: 'warning'
          },
          {
            name: 'Balance',
            score: Math.floor(Math.random() * 30) + 80,
            feedback: 'Great balance throughout delivery. Keep weight centered.',
            status: 'excellent'
          }
        ],
        recommendations: [
          'Increase hip rotation speed with medicine ball drills',
          'Work on follow-through extension',
          'Maintain current arm slot and balance'
        ]
      };
      
      setAnalysis(mockAnalysis);
      setAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.good;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">AI Form Analyzer</h2>
      <p className="text-center text-gray-600 mb-8">
        Upload a video of your throw and get instant AI-powered feedback on your mechanics
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Video Upload Section */}
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Throwing Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {videoUrl && (
            <div className="mb-4">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full rounded-lg shadow"
              />
            </div>
          )}

          {videoFile && !analyzing && !analysis && (
            <button
              onClick={analyzeForm}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Analyze Form
            </button>
          )}

          {analyzing && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Analyzing your throwing mechanics...</p>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        <div>
          {analysis && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Overall Form Score</h3>
                <div className={`text-5xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}/100
                </div>
              </div>

              {/* Key Points */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Mechanics Breakdown</h3>
                <div className="space-y-4">
                  {analysis.keyPoints.map((point: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{point.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getScoreColor(point.score)}`}>
                            {point.score}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(point.status)}`}>
                            {point.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{point.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span className="text-sm text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setAnalysis(null);
                  setVideoUrl('');
                  setVideoFile(null);
                }}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                Analyze Another Video
              </button>
            </div>
          )}

          {!analysis && !analyzing && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600">Upload a video to get started</p>
              <p className="text-sm text-gray-500 mt-2">
                Best results: Side view, full body visible, good lighting
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold mb-2">How it works</h3>
        <p className="text-sm text-gray-700">
          Our AI analyzes your throwing mechanics using computer vision to detect body positions, 
          joint angles, and movement patterns. It compares your form against professional biomechanics 
          data to provide personalized feedback and recommendations.
        </p>
      </div>
    </div>
  );
}
