// ElevenLabsWidget.tsx
import { useEffect } from 'react';

const ElevenLabsWidget = () => {
  useEffect(() => {
    // Check if the widget script is already loaded
    const existingScript = document.querySelector('script[src*="elevenlabs"]');
    
    if (existingScript) {
      // If script exists, the widget should auto-initialize
      return;
    }

    // Load the ElevenLabs widget script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    
    // Add error handling
    script.onerror = () => {
      console.error('Failed to load ElevenLabs widget script');
    };
    
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Render the custom element */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <elevenlabs-convai
              agent-id="agent_3901kchs84zkf0dt6qf97k4f5f0a"
              variant="expanded"
              style="width: 100%; height: 100%; border: none;"
            >
            </elevenlabs-convai>
          `
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
    </div>
  );
};

export default ElevenLabsWidget;