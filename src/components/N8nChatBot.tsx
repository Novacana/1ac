
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface N8nChatBotProps {
  className?: string;
}

const N8nChatBot: React.FC<N8nChatBotProps> = ({ className }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Ensure the iframe loads securely
    if (iframeRef.current) {
      iframeRef.current.onload = () => {
        console.log('N8n Chat iframe loaded successfully');
      };
    }
  }, []);

  return (
    <div className={cn('fixed bottom-4 right-4 z-50', className)}>
      <iframe
        ref={iframeRef}
        src="https://n8n-tejkg.ondigitalocean.app/webhook/066ad635-ecfa-470c-8761-5d200b645136/chat"
        className="w-[400px] h-[600px] border rounded-lg shadow-lg bg-background"
        style={{ border: '1px solid var(--border)' }}
      />
    </div>
  );
};

export default N8nChatBot;
