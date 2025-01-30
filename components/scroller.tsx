import React, { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';

interface MessagesContainerProps {
  children: React.ReactNode;
}

export const MessagesContainer: React.FC<MessagesContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousChildrenLength = useRef(0);

  useEffect(() => {
    if (containerRef.current && children) {
      const container = containerRef.current;
      const isNearBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 200;
      
      if (isNearBottom) {
        setTimeout(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth"
          });
        }, 50);
      }
    }
    previousChildrenLength.current = React.Children.count(children);
  }, [React.Children.count(children)]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth"
    >
      <AnimatePresence initial={false}>
        {children}
      </AnimatePresence>
    </div>
  );
};