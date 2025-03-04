'use client';

import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { SiteQuicklinks } from '@/dataModel/types';

// 默认表情符号函数，提供一些图标
const getDefaultEmoji = (index: number) => {
  const emojis = ['📚', '🏫', '📝', '👥', '📊', '🔍', '📅', '📣', '🎓', '💡'];
  return emojis[index % emojis.length];
};

interface QuickLinkAreaProps {
  quickLinks: SiteQuicklinks[];
}

/**
 * 首页金刚区/快捷链接组件
 */
const QuickLinkArea: React.FC<QuickLinkAreaProps> = ({ quickLinks }) => {
  // 默认快捷链接
  const defaultQuickLinks = [
    { id: 1, name: '课程表', icon_url: '📚', link: '/client/courses' },
    { id: 2, name: '讨论区', icon_url: '💬', link: '/client/posts' },
    { id: 3, name: '通知', icon_url: '📣', link: '/client/notifications' },
    { id: 4, name: '个人中心', icon_url: '👤', link: '/client/profile' },
    { id: 5, name: '校历', icon_url: '📅', link: '/client/calendar' },
    { id: 6, name: '资源库', icon_url: '📁', link: '/client/resources' },
    { id: 7, name: '帮助', icon_url: '❓', link: '/client/help' },
    { id: 8, name: '设置', icon_url: '⚙️', link: '/client/settings' }
  ];

  // 要显示的链接列表
  const linksToShow = quickLinks.length > 0 ? quickLinks : defaultQuickLinks;

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={1.5}>
        {linksToShow.map((link, index) => (
          <Grid item xs={3} sm={3} md={1.5} key={link.id || index}>
            <Link 
              href={link.link || '#'} 
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  textAlign: 'center', 
                  p: 1.5,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 2
                  }
                }}
              >
                <Box 
                  sx={{ 
                    fontSize: { xs: '1.8rem', sm: '2rem' },
                    mb: 1 
                  }}
                >
                  {link.icon_url || getDefaultEmoji(index)}
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {link.name}
                </Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickLinkArea; 