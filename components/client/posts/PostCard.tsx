'use client';

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  CardActionArea,
  Avatar,
  Box,
  Chip,
  useTheme,
  styled
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Posts } from '@/dataModel/types';

// 样式化组件
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 16px rgba(0,0,0,0.6)' 
      : '0 8px 16px rgba(0,0,0,0.1)',
  },
}));

interface PostCardProps {
  post: Posts;
  elevation?: number;
}

/**
 * 帖子卡片组件
 * 用于在列表中展示帖子的简要信息
 */
export default function PostCard({ post, elevation = 0 }: PostCardProps) {
  const router = useRouter();
  const theme = useTheme();
  
  // 获取帖子第一张图片 (如果有)
  const getFirstImage = (): string | null => {
    if (!post.media_data) return null;
    
    try {
      const mediaData = post.media_data as Record<string, any>;
      if (Array.isArray(mediaData.images) && mediaData.images.length > 0) {
        return mediaData.images[0].url;
      }
    } catch (e) {
      console.error('解析媒体数据失败', e);
    }
    
    return null;
  };
  
  // 获取帖子内容预览
  const getContentPreview = (): string => {
    if (!post.content) return '';
    
    // 移除HTML标签并限制字数
    const plainText = post.content.replace(/<[^>]*>/g, '');
    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
  };
  
  // 获取话题列表
  const getTopics = () => {
    if (!post.post_topics || post.post_topics.length === 0) return [];
    
    return post.post_topics
      .filter(pt => pt.topic)
      .map(pt => pt.topic)
      .slice(0, 3); // 最多显示3个话题
  };
  
  // 格式化发布时间
  const formatPublishTime = (): string => {
    if (!post.created_at) return '';
    
    try {
      const date = new Date(post.created_at);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      
      // 转换为秒
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return '刚刚';
      
      // 转换为分钟
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}分钟前`;
      
      // 转换为小时
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour}小时前`;
      
      // 转换为天
      const diffDay = Math.floor(diffHour / 24);
      if (diffDay < 30) return `${diffDay}天前`;
      
      // 转换为月
      const diffMonth = Math.floor(diffDay / 30);
      if (diffMonth < 12) return `${diffMonth}个月前`;
      
      // 转换为年
      const diffYear = Math.floor(diffMonth / 12);
      return `${diffYear}年前`;
    } catch (e) {
      console.error('格式化时间失败', e);
      return '';
    }
  };
  
  // 跳转到帖子详情页
  const handleClick = () => {
    router.push(`/client/posts/${post.id}`);
  };
  
  const firstImage = getFirstImage();
  const contentPreview = getContentPreview();
  const topics = getTopics();
  const publishTime = formatPublishTime();
  
  return (
    <StyledCard elevation={elevation}>
      <CardActionArea 
        onClick={handleClick}
        sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'flex-start' }}
      >
        {firstImage && (
          <CardMedia
            component="img"
            height={160}
            image={firstImage}
            alt={contentPreview.substring(0, 20)}
            sx={{ objectFit: 'cover' }}
          />
        )}
        <CardContent sx={{ p: 2, flexGrow: 1, width: '100%' }}>
          <Typography
            variant="body1"
            component="p"
            sx={{
              mb: 2,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              lineHeight: 1.5,
              minHeight: 72,
            }}
          >
            {contentPreview}
          </Typography>
          
          {topics.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {topics.map(topic => (
                <Chip
                  key={topic?.id}
                  label={topic?.name}
                  size="small"
                  sx={{
                    backgroundColor: `${theme.palette.primary.main}15`,
                    color: theme.palette.primary.main,
                    fontSize: '0.7rem',
                    height: 24,
                  }}
                />
              ))}
            </Box>
          )}
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={post.author?.avatar_url || undefined}
                alt={post.author?.nickname || '用户'}
                sx={{ width: 24, height: 24, mr: 1 }}
              >
                {!post.author?.avatar_url && (post.author?.nickname?.[0] || '用')}
              </Avatar>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  maxWidth: 100,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {post.author?.nickname || '匿名用户'}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {publishTime}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
} 