'use client';

import React from 'react';
import { Fab, useTheme, Zoom, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';

interface FloatingActionButtonProps {
  href: string;
  icon?: React.ReactNode;
  tooltip?: string;
}

/**
 * 悬浮操作按钮组件
 * 默认为添加按钮，支持自定义图标和链接
 */
export default function FloatingActionButton({ 
  href, 
  icon = <AddIcon />, 
  tooltip = '发布新内容' 
}: FloatingActionButtonProps) {
  const router = useRouter();
  const theme = useTheme();
  
  const handleClick = () => {
    router.push(href);
  };
  
  return (
    <Zoom in={true} timeout={300}>
      <Tooltip title={tooltip} placement="left">
        <Fab
          color="secondary"
          aria-label={tooltip}
          onClick={handleClick}
          sx={{
            position: 'fixed',
            bottom: { xs: 80, md: 32 },
            right: 16,
            zIndex: 1000,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 3px 8px rgba(0,0,0,0.5)'
              : '0 3px 8px rgba(0,0,0,0.3)',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 4px 12px rgba(0,0,0,0.6)'
                : '0 4px 12px rgba(0,0,0,0.4)',
            },
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          }}
        >
          {icon}
        </Fab>
      </Tooltip>
    </Zoom>
  );
} 