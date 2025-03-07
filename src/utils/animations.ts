
import { useEffect } from 'react';

type AnimationOptions = {
  duration?: number;
  delay?: number;
  easing?: string;
  once?: boolean;
};

export const fadeIn = (options: AnimationOptions = {}) => {
  const {
    duration = 500,
    delay = 0,
    easing = 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
    once = false,
  } = options;

  return {
    opacity: 0,
    transition: {
      opacity: {
        duration: duration / 1000,
        delay: delay / 1000,
        easing,
      },
    },
    animate: {
      opacity: 1,
    },
    initial: {
      opacity: 0,
    },
    once,
  };
};

export const slideUp = (options: AnimationOptions = {}) => {
  const {
    duration = 500,
    delay = 0,
    easing = 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
    once = false,
  } = options;

  return {
    opacity: 0,
    transform: 'translateY(20px)',
    transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
    animate: {
      opacity: 1,
      transform: 'translateY(0)',
    },
    once,
  };
};

export const scaleIn = (options: AnimationOptions = {}) => {
  const {
    duration = 400,
    delay = 0,
    easing = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    once = false,
  } = options;

  return {
    opacity: 0,
    transform: 'scale(0.95)',
    transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
    animate: {
      opacity: 1,
      transform: 'scale(1)',
    },
    once,
  };
};

// Hook for timed animation trigger
export const useAnimationFrame = (callback: (time: number) => void) => {
  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      callback(deltaTime);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
};

// Generate a staggered animation delay for lists
export const staggeredDelay = (index: number, baseDelay: number = 50) => {
  return index * baseDelay;
};
