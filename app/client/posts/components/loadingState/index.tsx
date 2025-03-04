'use client';

import React from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';

interface LoadingStateProps {
  loading: boolean;
  error: string;
  children: React.ReactNode;
}

/**
 * 加载状态和错误处理组件
 */
const LoadingState: React.FC<LoadingStateProps> = ({ 
  loading, 
  error, 
  children 
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      {children}
    </>
  );
};

export default LoadingState; 