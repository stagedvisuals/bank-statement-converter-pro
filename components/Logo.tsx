import React from 'react';

export const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full border-2 border-[#00b8d9] flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00b8d9" strokeWidth="2">
        <path d="M4 4h16v16H4zM4 12h16M12 4v16" />
      </svg>
    </div>
    <span className="text-2xl font-black text-slate-900 dark:text-white">
      BSC<span className="text-[#00b8d9]">PRO</span>
    </span>
  </div>
);
