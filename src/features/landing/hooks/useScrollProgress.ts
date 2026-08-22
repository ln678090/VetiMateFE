'use client';
import { useEffect, useState } from 'react';
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frameId = 0;

    function updateProgress() {
      frameId = 0;

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

      const nextProgress = scrollableHeight <= 0 ? 0 : window.scrollY / scrollableHeight;

      setProgress(Math.min(1, Math.max(0, nextProgress)));
    }

    function handleScroll() {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateProgress);
    }

    updateProgress();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);

      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);
  return progress;
}
