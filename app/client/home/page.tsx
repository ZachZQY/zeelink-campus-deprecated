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
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import Link from 'next/link';
import { Posts, Topics, Site } from '@/dataModel/types';
import { getPostList } from '@/lib/services/posts';

export default function HomePage() {
  // 状态管理
  const [featuredPosts, setFeaturedPosts] = useState<Posts[]>([]);
  const [hotTopics, setHotTopics] = useState<Topics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sites, setSites] = useState<Site[]>([]);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [user, setUser] = useState<any>(null);

  // 获取用户信息
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setCurrentSite(userData.current_site || null);
      } catch (e) {
        console.error('解析用户信息失败', e);
      }
    }
  }, []);

  // 获取站点列表
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/v1/site', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('获取站点列表失败');
        }

        const data = await response.json();
        if (data.success && data.data && data.data.list) {
          setSites(data.data.list);
        }
      } catch (err) {
        console.error('获取站点列表错误:', err);
      }
    };

    fetchSites();
  }, []);

  // 获取当前站点的帖子数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 获取当前站点的帖子
        const postsResult = await getPostList({
          page: 1,
          pageSize: 6,
          sortBy: 'created_at',
          sortOrder: 'desc',
          siteId: currentSite?.id
        });
        
        if (postsResult && postsResult.success && postsResult.data) {
          setFeaturedPosts(postsResult.data.items || []);
        }
        
        // 这里应该获取热门话题，暂时使用示例数据
        setHotTopics([
          { id: 1, name: '校园生活' },
          { id: 2, name: '学习交流' },
          { id: 3, name: '活动公告' },
          { id: 4, name: '二手交易' },
          { id: 5, name: '失物招领' },
          { id: 6, name: '校园美食' }
        ]);
        
        setError('');
      } catch (err) {
        console.error('获取数据错误:', err);
        setError('获取数据失败，请刷新重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentSite) {
      fetchData();
    }
  }, [currentSite]);

  // 处理站点切换
  const handleSiteChange = async (event: SelectChangeEvent<number>) => {
    const siteId = event.target.value as number;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/v1/site/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ site_id: siteId })
      });

      if (!response.ok) {
        throw new Error('切换站点失败');
      }

      const data = await response.json();
      if (data.success && data.data && data.data.current_site) {
        setCurrentSite(data.data.current_site);
        
        // 更新本地存储的用户信息
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            userData.current_site = data.data.current_site;
            localStorage.setItem('user', JSON.stringify(userData));
          } catch (e) {
            console.error('更新用户信息失败', e);
          }
        }
      }
    } catch (err) {
      console.error('切换站点错误:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {/* 站点选择器 */}
      {sites.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="site-select-label">当前站点</InputLabel>
            <Select
              labelId="site-select-label"
              id="site-select"
              value={currentSite?.id || ''}
              label="当前站点"
              onChange={handleSiteChange}
            >
              {sites.map((site) => (
                <MenuItem key={site.id} value={site.id}>
                  {site.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      
      {/* 欢迎信息 */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {currentSite ? `欢迎来到 ${currentSite.name}` : '欢迎来到校园社区'}
        </Typography>
        <Typography variant="subtitle1" paragraph>
          在这里可以发现精彩内容，与同学交流互动，分享你的校园生活。
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          component={Link}
          href="/client/posts/new"
          sx={{ 
            bgcolor: 'white', 
            color: '#764ba2',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)',
            }
          }}
        >
          发布内容
        </Button>
      </Paper>
      
      {/* 内容区域 */}
      <Grid container spacing={4}>
        {/* 左侧：精选内容 */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" component="h2" gutterBottom>
            精选内容
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : featuredPosts.length > 0 ? (
            <Grid container spacing={3}>
              {featuredPosts.map((post) => (
                <Grid item xs={12} sm={6} key={post.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: '0.3s',
                      '&:hover': {
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <CardActionArea component={Link} href={`/client/posts/${post.id}`}>
                      {post.media_data && post.media_data.images && Array.isArray(post.media_data.images) && post.media_data.images.length > 0 && (
                        <CardMedia
                          component="img"
                          height="140"
                          image={post.media_data.images[0]}
                          alt="内容图片"
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Avatar 
                            src={post.author?.avatar_url || undefined}
                            alt={post.author?.nickname || '用户'}
                            sx={{ width: 24, height: 24, mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {post.author?.nickname || '匿名用户'}
                          </Typography>
                        </Box>
                        <Typography variant="body1" component="p" noWrap>
                          {post.content}
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {post.post_topics && post.post_topics.map((postTopic) => (
                            <Chip 
                              key={postTopic.topic?.id}
                              label={postTopic.topic?.name} 
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">暂无内容</Alert>
          )}
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button 
              variant="outlined" 
              component={Link}
              href="/client/posts"
            >
              查看更多内容
            </Button>
          </Box>
        </Grid>
        
        {/* 右侧：侧边栏 */}
        <Grid item xs={12} md={4}>
          {/* 热门话题 */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              热门话题
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {hotTopics.map((topic) => (
                <Chip 
                  key={topic.id}
                  label={topic.name} 
                  component={Link}
                  href={`/client/topics/${topic.id}`}
                  clickable
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          </Paper>
          
          {/* 活动公告 */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              活动公告
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              敬请期待...
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
