/**
 * Warnings Section Component
 * 
 * Displays meta.warnings as a list of alert messages.
 */

'use client';

interface WarningsSectionProps {
  warnings: string[];
}

export default function WarningsSection({ warnings }: WarningsSectionProps) {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <div className="card bg-slate-50 border border-slate-200">
      <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Analysis Warnings
      </h3>
      
      <ul className="space-y-2">
        {warnings.map((warning, index) => (
          <li 
            key={index} 
            className="flex items-start gap-2 text-sm text-slate-600 p-2 bg-white rounded border border-slate-200"
          >
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {warning}
          </li>
        ))}
      </ul>
    </div>
  );
}
