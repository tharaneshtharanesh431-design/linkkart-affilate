'use client';

import { useEffect, useState } from 'react';

export function ActiveBackground() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-br from-white via-[#e0f2fe] to-[#bfdbfe]">
      {/* Animated blue blobs using highly performant radial gradients instead of expensive CSS blur filters */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(96,165,250,0.3)_0%,transparent_60%)] rounded-full animate-blob pointer-events-none will-change-transform" />
      <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(147,197,253,0.3)_0%,transparent_60%)] rounded-full animate-blob animation-delay-2000 pointer-events-none will-change-transform" />
      <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] bg-[radial-gradient(circle,rgba(125,211,252,0.3)_0%,transparent_60%)] rounded-full animate-blob animation-delay-4000 pointer-events-none will-change-transform" />
    </div>
  );
}
