'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Avatar, 
  Tabs, 
  Tab, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton
} from '@mui/material';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { User, Posts } from '@/dataModel/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [tabValue, setTabValue] = useState(0);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Posts[]>([]);
  const [likedPosts, setLikedPosts] = useState<Posts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  
  // 获取用户资料和帖子
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        
        // 模拟API请求
        setTimeout(() => {
          // 假设1001是当前登录用户ID
          const currentUserId = 1001;
          setIsCurrentUser(Number(userId) === currentUserId);
          
          // 模拟用户数据
          const mockUser: User = {
            id: Number(userId),
            nickname: userId === '1001' ? '我自己' : '校园达人',
            mobile: '13800138000',
            bio: '热爱分享校园生活的点滴，欢迎关注我！',
            avatar: '/avatars/default.jpg',
            post_count: 25,
            follower_count: 124,
            following_count: 56,
            created_at: '2023-09-01T08:00:00Z'
          };
          
          setUserProfile(mockUser);
          
          // 模拟用户发布的帖子
          const mockPosts: Posts[] = Array(8).fill(null).map((_, index) => ({
            id: 100 + index,
            title: `校园生活分享 ${index + 1}`,
            content: `这是一篇关于校园生活的帖子，分享了日常学习和生活的点滴 ${index + 1}...`,
            created_at: new Date(Date.now() - index * 86400000).toISOString(),
            author: mockUser,
            post_topics: [
              {
                id: 1,
                topic: {
                  id: 1,
                  name: '校园生活'
                }
              }
            ],
            view_count: 50 + index * 5,
            like_count: 20 + index * 2,
            comment_count: 5 + index
          }));
          
          setUserPosts(mockPosts);
          
          // 模拟用户点赞的帖子
          const mockLikedPosts: Posts[] = Array(5).fill(null).map((_, index) => ({
            id: 200 + index,
            title: `有趣的校园活动 ${index + 1}`,
            content: `这是一篇关于校园活动的帖子，记录了精彩的校园活动瞬间 ${index + 1}...`,
            created_at: new Date(Date.now() - index * 43200000).toISOString(),
            author: {
              id: 1002 + index,
              nickname: `活动达人${index + 1}`,
              avatar: '/avatars/default.jpg'
            },
            post_topics: [
              {
                id: 3,
                topic: {
                  id: 3,
                  name: '社团活动'
                }
              }
            ],
            view_count: 100 + index * 10,
            like_count: 30 + index * 3,
            comment_count: 8 + index
          }));
          
          setLikedPosts(mockLikedPosts);
          setIsLoading(false);
        }, 800);
        
      } catch (err) {
        console.error('获取用户资料失败:', err);
        setError('获取用户资料失败，请稍后重试');
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [userId]);
  
  // 切换标签页
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // 格式化日期显示
  const formatDate = (dateString?: string | number) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // 格式化加入日期
  const formatJoinDate = (dateString?: string | number) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!userProfile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Alert severity="info">未找到该用户</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* 用户资料卡片 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Avatar 
              src={userProfile.avatar || "/avatars/default.jpg"}
              alt={userProfile.nickname}
              sx={{ width: 120, height: 120 }}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1">
                {userProfile.nickname}
              </Typography>
              {isCurrentUser ? (
                <Button 
                  variant="outlined" 
                  component={Link} 
                  href="/client/profile/edit"
                >
                  编辑资料
                </Button>
              ) : (
                <Button variant="contained" color="primary">
                  关注
                </Button>
              )}
            </Box>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              {userProfile.bio || "这个用户很懒，还没有填写个人简介"}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, mb: 1 }}>
              <Box>
                <Typography variant="h6" component="span">
                  {userProfile.post_count || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                  帖子
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" component="span">
                  {userProfile.follower_count || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                  粉丝
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" component="span">
                  {userProfile.following_count || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                  关注
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              加入时间: {formatJoinDate(userProfile.created_at)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* 标签页导航 */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="发布的帖子" {...a11yProps(0)} />
          <Tab label="点赞的帖子" {...a11yProps(1)} />
          {isCurrentUser && <Tab label="我的收藏" {...a11yProps(2)} />}
        </Tabs>
        
        {/* 发布的帖子标签页 */}
        <TabPanel value={tabValue} index={0}>
          {userPosts.length > 0 ? (
            <Grid container spacing={3}>
              {userPosts.map((post) => (
                <Grid item xs={12} key={post.id}>
                  <Card>
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        component={Link}
                        href={`/client/posts/${post.id}`}
                        sx={{ 
                          textDecoration: 'none',
                          color: 'text.primary',
                          '&:hover': { 
                            textDecoration: 'underline',
                            color: 'primary.main' 
                          },
                          display: 'block',
                          mb: 1
                        }}
                      >
                        {post.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {post.content}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        {post.post_topics?.map((postTopic) => (
                          <Chip 
                            key={postTopic.id}
                            label={`#${postTopic.topic?.name}`}
                            size="small"
                            component={Link}
                            href={`/client/topics/${postTopic.topic?.id}`}
                            clickable
                          />
                        ))}
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(post.created_at)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            👁️ {post.view_count || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ❤️ {post.like_count || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            💬 {post.comment_count || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                暂无发布的帖子
              </Typography>
              {isCurrentUser && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={Link}
                  href="/client/posts/create"
                  sx={{ mt: 2 }}
                >
                  发布新帖子
                </Button>
              )}
            </Box>
          )}
        </TabPanel>
        
        {/* 点赞的帖子标签页 */}
        <TabPanel value={tabValue} index={1}>
          {likedPosts.length > 0 ? (
            <List>
              {likedPosts.map((post) => (
                <React.Fragment key={post.id}>
                  <ListItem 
                    alignItems="flex-start"
                    component={Link}
                    href={`/client/posts/${post.id}`}
                    sx={{ 
                      textDecoration: 'none', 
                      color: 'inherit',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        src={post.author?.avatar || "/avatars/default.jpg"} 
                        alt={post.author?.nickname}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={post.title}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ display: 'block' }}
                          >
                            {post.author?.nickname}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {post.content}
                          </Typography>
                          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(post.created_at)}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                👁️ {post.view_count || 0}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ❤️ {post.like_count || 0}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                💬 {post.comment_count || 0}
                              </Typography>
                            </Box>
                          </Box>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                暂无点赞的帖子
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link}
                href="/client/posts"
                sx={{ mt: 2 }}
              >
                浏览帖子
              </Button>
            </Box>
          )}
        </TabPanel>
        
        {/* 我的收藏标签页 - 仅当前用户可见 */}
        {isCurrentUser && (
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                暂无收藏的帖子
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link}
                href="/client/posts"
                sx={{ mt: 2 }}
              >
                浏览帖子
              </Button>
            </Box>
          </TabPanel>
        )}
      </Paper>
    </Container>
  );
}
