'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Chip,
  Divider,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import Link from 'next/link';
import { Posts, Topics } from '@/dataModel/types';
import { getPostList } from '@/lib/services/posts';

export default function HomePage() {
  // 状态管理
  const [featuredPosts, setFeaturedPosts] = useState<Posts[]>([]);
  const [hotTopics, setHotTopics] = useState<Topics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 获取精选帖子
        const postsResult = await getPostList({
          page: 1,
          pageSize: 6,
          orderBy: 'created_at',
          orderDirection: 'desc'
        });
        
        if (postsResult && postsResult.data) {
          setFeaturedPosts(postsResult.data.list || []);
        }
        
        // 这里应该获取热门话题，暂时使用示例数据
        setHotTopics([
          { id: 1, name: '校园生活' },
          { id: 2, name: '学习交流' },
          { id: 3, name: '社团活动' },
          { id: 4, name: '求职就业' },
          { id: 5, name: '考研交流' },
        ]);
        
      } catch (err) {
        console.error('获取首页数据失败:', err);
        setError('获取数据失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 格式化日期函数
  const formatDate = (dateString?: string | number) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* 欢迎横幅 */}
      <Paper 
        sx={{
          position: 'relative',
          backgroundColor: 'rgba(25, 118, 210, 0.7)',
          color: 'white',
          mb: 4,
          p: 6,
          borderRadius: 2,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: 'url(/images/campus-banner.jpg)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 2,
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            欢迎来到校园社区
          </Typography>
          <Typography variant="h6" paragraph>
            这里是分享知识、交流经验、结交朋友的理想平台
          </Typography>
          <Button 
            variant="contained" 
            component={Link}
            href="/client/posts/create"
            sx={{ backgroundColor: 'white', color: 'primary.main', mt: 2 }}
          >
            发布新内容
          </Button>
        </Box>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
      ) : (
        <Grid container spacing={4}>
          {/* 主要内容区 */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" component="h2" gutterBottom>
              最新内容
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              {featuredPosts.length > 0 ? (
                featuredPosts.map((post) => (
                  <Grid item xs={12} key={post.id}>
                    <Card 
                      sx={{ 
                        mb: 2, 
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 3
                        }
                      }}
                    >
                      <CardActionArea component={Link} href={`/client/posts/${post.id}`}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar 
                              src={post.author?.avatar || "/avatars/default.jpg"} 
                              alt={post.author?.nickname || "用户"}
                              sx={{ mr: 1 }}
                            />
                            <Box>
                              <Typography variant="subtitle2">
                                {post.author?.nickname || "用户"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(post.created_at)}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Typography variant="h6" component="h3" gutterBottom>
                            {post.title || "无标题"}
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {post.content?.substring(0, 150) || "无内容"}
                            {post.content && post.content.length > 150 ? '...' : ''}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {post.post_topics && post.post_topics.map((postTopic) => (
                              <Chip 
                                key={postTopic.id}
                                label={postTopic.topic?.name || "未知话题"}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography align="center" color="text.secondary" sx={{ my: 4 }}>
                    暂无内容
                  </Typography>
                </Grid>
              )}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                variant="outlined" 
                component={Link} 
                href="/client/posts"
              >
                查看更多内容
              </Button>
            </Box>
          </Grid>
          
          {/* 侧边栏 */}
          <Grid item xs={12} md={4}>
            {/* 热门话题 */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                热门话题
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {hotTopics.map((topic) => (
                <Chip
                  key={topic.id}
                  label={`#${topic.name}`}
                  component={Link}
                  href={`/client/topics/${topic.id}`}
                  clickable
                  sx={{ m: 0.5 }}
                />
              ))}
              
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button 
                  component={Link} 
                  href="/client/topics" 
                  size="small"
                >
                  查看全部话题
                </Button>
              </Box>
            </Paper>
            
            {/* 通知公告 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                通知公告
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  系统更新通知
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  我们已更新到最新版本，增加了更多新功能。
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  2025-03-02
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  校园活动预告
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  本周末将举办年度校园文化节，欢迎大家参加！
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  2025-03-01
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
