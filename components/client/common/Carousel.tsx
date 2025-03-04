'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, IconButton, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Link from 'next/link';

export interface CarouselItem {
  id: string | number;
  content: React.ReactNode;
  link?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoplayInterval?: number;
  height?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
}

/**
 * 自定义轮播图组件
 * 不依赖任何外部库，只使用React和MUI基础组件
 */
export default function Carousel({ 
  items, 
  autoplayInterval = 5000,
  height = 400
}: CarouselProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme();
  const maxSteps = items.length;
  
  // 转换高度为响应式样式
  const heightStyle = typeof height === 'object' 
    ? { 
        height: {
          xs: height.xs || 200,
          sm: height.sm || height.xs || 300,
          md: height.md || height.sm || height.xs || 400,
          lg: height.lg || height.md || height.sm || height.xs || 400,
          xl: height.xl || height.lg || height.md || height.sm || height.xs || 400
        } 
      }
    : { height };
  
  // 处理自动播放
  useEffect(() => {
    const startAutoplay = () => {
      if (maxSteps <= 1) return;
      
      timerRef.current = setInterval(() => {
        if (!isPaused) {
          setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
        }
      }, autoplayInterval);
    };
    
    startAutoplay();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [maxSteps, autoplayInterval, isPaused]);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
  };
  
  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };
  
  // 暂停自动播放
  const handleMouseEnter = () => {
    setIsPaused(true);
  };
  
  // 恢复自动播放
  const handleMouseLeave = () => {
    setIsPaused(false);
  };
  
  // 如果只有一项，不显示箭头
  if (items.length <= 1) {
    const item = items[0] || { id: 'empty', content: null };
    return (
      <Paper 
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          ...heightStyle,
        }}
      >
        {item.link ? (
          <Link href={item.link} style={{ display: 'block', height: '100%' }}>
            <Box sx={{ height: '100%' }}>
              {item.content}
            </Box>
          </Link>
        ) : (
          <Box sx={{ height: '100%' }}>
            {item.content}
          </Box>
        )}
      </Paper>
    );
  }
  
  return (
    <Paper 
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        ...heightStyle,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box
        sx={{
          display: 'flex',
          transition: 'transform 0.5s ease',
          height: '100%',
          width: `${items.length * 100}%`,
          transform: `translateX(-${(activeStep * 100) / items.length}%)`,
        }}
      >
        {items.map((item) => (
          <Box 
            key={item.id} 
            sx={{ 
              width: `${100 / items.length}%`,
              height: '100%',
              flexShrink: 0 
            }}
          >
            {item.link ? (
              <Link href={item.link} style={{ display: 'block', height: '100%' }}>
                <Box sx={{ height: '100%' }}>
                  {item.content}
                </Box>
              </Link>
            ) : (
              <Box sx={{ height: '100%' }}>
                {item.content}
              </Box>
            )}
          </Box>
        ))}
      </Box>
      
      <IconButton
        onClick={handleBack}
        sx={{
          position: 'absolute',
          left: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.5)',
          color: 'text.primary',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.8)',
          },
          zIndex: 1,
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
        }}
        size="small"
      >
        <ChevronLeftIcon />
      </IconButton>
      
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.5)',
          color: 'text.primary',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.8)',
          },
          zIndex: 1,
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
        }}
        size="small"
      >
        <ChevronRightIcon />
      </IconButton>
      
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        {items.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: index === activeStep ? 'primary.main' : 'rgba(255, 255, 255, 0.7)',
              margin: '0 4px',
              transition: 'all 0.3s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.2)',
              },
            }}
            onClick={() => handleStepChange(index)}
          />
        ))}
      </Box>
    </Paper>
  );
} 