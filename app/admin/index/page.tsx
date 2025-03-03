'use client';

import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Paper
} from '@mui/material';
import dynamic from 'next/dynamic';

// 动态导入组件
const PageHeader = dynamic(() => import('@/components/common/PageHeader'), { ssr: false });

// 统计卡片组件
const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: string, color: string }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            width: 56, 
            height: 56, 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: `${color}15`,
            color: color,
            fontSize: '1.5rem'
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// 活动卡片项目
interface ActivityItem {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
}

// 示例活动数据
const recentActivities: ActivityItem[] = [
  { id: 1, user: '张三', action: '创建了新帖子', target: '校园活动安排', time: '10分钟前' },
  { id: 2, user: '李四', action: '评论了帖子', target: '食堂菜单更新', time: '30分钟前' },
  { id: 3, user: '王五', action: '上传了文件', target: '期末考试时间表.xlsx', time: '1小时前' },
  { id: 4, user: '赵六', action: '创建了新话题', target: '校园安全', time: '2小时前' },
  { id: 5, user: '孙七', action: '更新了用户资料', target: '', time: '3小时前' }
];

export default function Dashboard() {
  return (
    <>
      <PageHeader 
        title="仪表盘" 
        subtitle="欢迎使用Zeelink Campus管理系统"
      />
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="总用户数" 
            value="1,254" 
            icon="👥" 
            color="#1976d2" 
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="帖子数量" 
            value="328" 
            icon="📝" 
            color="#2e7d32" 
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="话题数量" 
            value="42" 
            icon="🏷️" 
            color="#ed6c02" 
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="文件数量" 
            value="156" 
            icon="📁" 
            color="#9c27b0" 
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              系统概览
            </Typography>
            <Typography variant="body2" paragraph>
              欢迎使用Zeelink Campus管理系统。这个仪表盘提供了系统的关键指标和最新活动。
              您可以通过左侧的导航菜单访问系统的各个功能模块。
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                开发中功能
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2">数据统计图表展示</Typography>
                <Typography component="li" variant="body2">用户活跃度分析</Typography>
                <Typography component="li" variant="body2">内容互动热度地图</Typography>
                <Typography component="li" variant="body2">系统性能监控</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              最近活动
            </Typography>
            <Box>
              {recentActivities.map((activity) => (
                <Box 
                  key={activity.id} 
                  sx={{ 
                    py: 1.5, 
                    borderBottom: '1px solid', 
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' } 
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight="medium">
                      {activity.user}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {activity.action} 
                    {activity.target && (
                      <Typography component="span" fontWeight="medium">
                        {' '}{activity.target}
                      </Typography>
                    )}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
