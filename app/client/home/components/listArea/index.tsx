'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Grid, 
  Alert, 
  Button 
} from '@mui/material';
import Link from 'next/link';
import PostCard from '@/components/client/posts/PostCard';
import { Posts } from '@/dataModel/types';

interface PostListAreaProps {
  posts: Posts[];
  title?: string;
  emptyMessage?: string;
  seeMoreLink?: string;
  seeMoreText?: string;
}

/**
 * 帖子列表区域组件
 */
const PostListArea: React.FC<PostListAreaProps> = ({ 
  posts,
  title = '热门帖子',
  emptyMessage = '暂无热门帖子',
  seeMoreLink = '/client/posts',
  seeMoreText = '查看更多内容'
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography 
        variant="h6" 
        component="h2" 
        gutterBottom
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          px: 1,
          fontWeight: 'bold' 
        }}
      >
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      {posts.length > 0 ? (
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info">{emptyMessage}</Alert>
      )}
      
      {posts.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            component={Link}
            href={seeMoreLink}
          >
            {seeMoreText}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PostListArea; 