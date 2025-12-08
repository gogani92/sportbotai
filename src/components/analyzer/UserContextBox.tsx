/**
 * User Context Box Component
 * 
 * Displays analysis.userContext with user's pick, stake,
 * and AI comment on the pick (neutral, never advisory).
 */

'use client';

import { UserContext } from '@/types';

interface UserContextBoxProps {
  userContext: UserContext;
}

export default function UserContextBox({ userContext }: UserContextBoxProps) {
  const { userPick, userStake, pickComment } = userContext;

  // Don't render if no user context provided
  if (!userPick && userStake === 0) {
    return null;
  }

  return (
    <div className="card bg-blue-50 border-2 border-blue-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Your Selection
      </h3>

      {/* User Pick and Stake */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {userPick && (
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <p className="text-xs text-gray-500 mb-1">Your Pick</p>
            <p className="text-xl font-bold text-blue-700">{userPick}</p>
          </div>
        )}
        
        {userStake > 0 && (
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <p className="text-xs text-gray-500 mb-1">Stake</p>
            <p className="text-xl font-bold text-blue-700">
              {userStake} <span className="text-sm font-normal text-gray-500">units</span>
            </p>
          </div>
        )}
      </div>

      {/* Pick Comment */}
      {pickComment && (
        <div className="p-4 bg-white rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Analysis of Your Pick
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {pickComment}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-blue-600 mt-4 text-center">
        This is a neutral analysis of your selection, not advice. All decisions are your own responsibility.
      </p>
    </div>
  );
}
