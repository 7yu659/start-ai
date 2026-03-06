import React from 'react';

interface AdSlotProps {
  code: string;
  className?: string;
  label?: string;
}

export default function AdSlot({ code, className = '', label = 'Advertisement' }: AdSlotProps) {
  if (!code) return null;

  return (
    <div className={`my-8 flex flex-col items-center justify-center ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">{label}</span>
      <div 
        className="w-full max-w-[728px] min-h-[90px] bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden"
        dangerouslySetInnerHTML={{ __html: code }}
      />
    </div>
  );
}
