'use client';

import React from 'react';
import { 
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Pagination,
  TextField,
  InputAdornment
} from '@mui/material';

export default function TopicsPage() {
  // 这里只是示例数据，实际使用时应从服务端获取数据
  const topics = [
    { id: 1, name: '校园生活', postCount: 120, followers: 230, description: '分享校园生活中的点滴和趣事。' },
    { id: 2, name: '学习交流', postCount: 85, followers: 312, description: '交流学习心得，分享学习资源。' },
    { id: 3, name: '社团活动', postCount: 64, followers: 178, description: '校内各类社团活动的发布和交流。' },
    { id: 4, name: '求职就业', postCount: 93, followers: 420, description: '分享求职经验，发布就业信息。' },
    { id: 5, name: '考研交流', postCount: 150, followers: 560, description: '考研经验分享，资料交流。' },
    { id: 6, name: '校园公告', postCount: 42, followers: 280, description: '官方校园公告和通知。' },
    { id: 7, name: '技术讨论', postCount: 78, followers: 195, description: '各类技术话题的讨论和交流。' },
    { id: 8, name: '创新创业', postCount: 56, followers: 160, description: '创新项目展示和创业经验分享。' },
    { id: 9, name: '校园食堂', postCount: 89, followers: 210, description: '美食推荐，食堂评价。' },
    { id: 10, name: '情感分享', postCount: 110, followers: 240, description: '校园情感故事交流，心理健康。' },
    { id: 11, name: '二手交易', postCount: 95, followers: 185, description: '校园内的二手物品交易。' },
    { id: 12, name: '摄影分享', postCount: 67, followers: 150, description: '校园美景和摄影作品分享。' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          话题广场
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          发现感兴趣的话题，与志同道合的同学交流
        </Typography>
        
        {/* 搜索框 */}
        <TextField
          fullWidth
          placeholder="搜索话题..."
          variant="outlined"
          size="small"
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                🔍
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {/* 话题列表 */}
      <Grid container spacing={3}>
        {topics.map((topic) => (
          <Grid item xs={12} sm={6} md={4} key={topic.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  #{topic.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {topic.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={`${topic.postCount} 帖子`} 
                    size="small" 
                    variant="outlined"
                  />
                  <Chip 
                    label={`${topic.followers} 关注者`} 
                    size="small" 
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* 分页 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination count={10} color="primary" />
      </Box>
    </Container>
  );
}
