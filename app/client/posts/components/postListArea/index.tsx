'use client';

import React from 'react';
import { 
  Box, 
  Grid, 
  Button, 
  Typography, 
  CircularProgress,
  Alert
} from '@mui/material';
import PostCard from '@/components/client/posts/PostCard';
import { Posts } from '@/dataModel/types';

interface PostListAreaProps {
  posts: Posts[];
  loading: boolean;
  page: number;
  hasMore: boolean;
  onLoadMore: () => void;
}

/**
 * 帖子列表区域组件
 */
const PostListArea: React.FC<PostListAreaProps> = ({ 
  posts, 
  loading, 
  page, 
  hasMore, 
  onLoadMore 
}) => {
  if (loading && page === 1) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        暂无内容，快来发布第一篇帖子吧！
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>
      
      {/* 加载更多按钮 */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        {loading && page > 1 ? (
          <CircularProgress size={30} />
        ) : hasMore ? (
          <Button 
            variant="outlined" 
            onClick={onLoadMore}
          >
            加载更多
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary">
            没有更多内容了
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PostListArea; 