// hooks/useElevenLabsScript.ts
import { useEffect } from 'react';

export const useElevenLabsScript = () => {
  useEffect(() => {
    const loadScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src*="elevenlabs"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      
      // Add error handling
      script.onerror = () => {
        console.error('Failed to load ElevenLabs widget script');
      };
      
      document.body.appendChild(script);
    };

    // Load script when component mounts
    loadScript();

    // Clean up if needed (though usually we keep the script)
    return () => {
      // Optional cleanup
    };
  }, []);
};