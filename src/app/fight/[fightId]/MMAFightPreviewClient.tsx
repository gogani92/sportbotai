'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Fighter {
  id: string;
  name: string;
  photo: string;
  isWinner: boolean;
}

interface MMAFight {
  id: string;
  eventName: string;
  date: string;
  category: string;
  isMainCard: boolean;
  status: string;
  fighter1: Fighter;
  fighter2: Fighter;
}

interface MMAFightPreviewClientProps {
  fightId: string;
}

export default function MMAFightPreviewClient({ fightId }: MMAFightPreviewClientProps) {
  const [fight, setFight] = useState<MMAFight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFight() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/mma/fights');
        if (!response.ok) throw new Error('Failed to fetch fights');
        
        const data = await response.json();
        const foundFight = data.fights?.find((f: MMAFight) => f.id === fightId);
        
        if (!foundFight) {
          setError('Fight not found');
        } else {
          setFight(foundFight);
        }
      } catch (err) {
        console.error('Error fetching fight:', err);
        setError('Failed to load fight data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchFight();
  }, [fightId]);

  const handleAnalyze = async () => {
    if (!fight) return;
    
    setIsAnalyzing(true);
    setAnalysis(null);
    
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: 'mma',
          homeTeam: fight.fighter1.name,
          awayTeam: fight.fighter2.name,
          league: 'UFC',
          matchDate: fight.date,
          eventName: fight.eventName,
          category: fight.category,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const data = await response.json();
      setAnalysis(data.analysis || data.message || 'Analysis complete');
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalysis('Failed to generate analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/icons/icon-72x72.png';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading fight data...</p>
        </div>
      </div>
    );
  }

  if (error || !fight) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Fight Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'This fight could not be found.'}</p>
          <Link href="/matches" className="btn-primary">
            Browse Matches
          </Link>
        </div>
      </div>
    );
  }

  const fightDate = new Date(fight.date);
  const formattedDate = fightDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-bg-primary border-b border-divider">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Link */}
          <Link href="/matches" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Matches
          </Link>
          
          {/* Event Name */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium mb-4">
              🥊 UFC
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{fight.eventName}</h1>
            <p className="text-gray-400">{formattedDate}</p>
            {fight.category && (
              <span className="inline-block mt-2 px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                {fight.category}
              </span>
            )}
            {fight.isMainCard && (
              <span className="inline-block ml-2 mt-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                Main Card
              </span>
            )}
          </div>

          {/* Fighters */}
          <div className="flex items-center justify-center gap-8 md:gap-16">
            {/* Fighter 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4">
                <Image
                  src={fight.fighter1.photo || '/icons/icon-72x72.png'}
                  alt={fight.fighter1.name}
                  fill
                  className="object-cover rounded-full bg-gray-700 border-4 border-gray-600"
                  onError={handleImageError}
                  unoptimized
                />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">{fight.fighter1.name}</h2>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-gray-600">VS</span>
            </div>

            {/* Fighter 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4">
                <Image
                  src={fight.fighter2.photo || '/icons/icon-72x72.png'}
                  alt={fight.fighter2.name}
                  fill
                  className="object-cover rounded-full bg-gray-700 border-4 border-gray-600"
                  onError={handleImageError}
                  unoptimized
                />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">{fight.fighter2.name}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!analysis && !isAnalyzing && (
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              className="btn-primary text-lg px-8 py-4"
            >
              🔍 Generate AI Analysis
            </button>
            <p className="text-gray-500 text-sm mt-4">
              Get AI-powered insights on this UFC matchup
            </p>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Fight...</h3>
            <p className="text-gray-400">Researching fighter records, recent performance, and matchup data</p>
          </div>
        )}

        {analysis && (
          <div className="bg-bg-card rounded-2xl border border-divider p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🧠</span> AI Analysis
            </h3>
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 whitespace-pre-wrap">{analysis}</div>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                ⚠️ This analysis is for educational purposes only. Fight outcomes are unpredictable. 
                Never bet more than you can afford to lose. If you or someone you know has a gambling problem, 
                please call 1-800-GAMBLER.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
