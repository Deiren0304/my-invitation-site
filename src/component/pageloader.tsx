'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(pathname);
  
  // Instantly trigger the loader BEFORE the browser paints the new page.
  // This intercepts the click and prevents the split-second "flash" gap.
  if (pathname !== currentPath) {
    setLoading(true);
    setCurrentPath(pathname);
  }

  const isFirstMount = useRef(true);

  // Lock scrolling while the loader is active
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [loading]);

  // Handle the countdown timer
  useEffect(() => {
    // Note: loading is already true here because of the interceptor above!
    const delay = isFirstMount.current ? 3000 : 1200;
    
    const timer = setTimeout(() => {
      setLoading(false);
      isFirstMount.current = false;
    }, delay);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Inject a forced theme-matching background globally from inside the loader */}
      <style dangerouslySetInnerHTML={{ __html: `body { background-color: #F5EBE1 !important; }` }} />

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            // Hardcoded inline styles guarantee a solid theme screen over EVERYTHING
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: '#F5EBE1', // Matches your wedding cream theme
              zIndex: 999999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0,
              padding: 0,
            }}
          >
            {/* Logo / Custom Image */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <Image
                src="/monoss.png" // 🔴 CHANGE THIS TO YOUR IMAGE FILE NAME
                alt="Arlan & Rei Marie"
                width={180}
                height={180}
                priority
                className="object-contain drop-shadow-sm mb-4"
              />
            </motion.div>

            {/* Elegant rotating loader ring */}
            <motion.div
              className="mt-6 h-10 w-10 border-[3px] border-[#B58382]/20 border-t-[#844C44] rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}