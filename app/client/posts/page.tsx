'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Posts, Topics, Sites } from '@/dataModel/types'
import MobileBottomNav from '@/components/client/layout/MobileBottomNav';
import FloatingActionButton from '@/components/client/common/FloatingActionButton';

// 导入新创建的组件
import LoadingState from './components/loadingState';
import ScopeTabsArea from './components/scopeTabsArea';
import TopicFilterArea from './components/topicFilterArea';
import PostListArea from './components/postListArea';

export default function PostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // 查询参数
  const scope = searchParams.get('scope') || 'site';
  const topicId = searchParams.get('topic');
  
  // 状态管理
  const [posts, setPosts] = useState<Posts[]>([]);
  const [topics, setTopics] = useState<Topics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentSite, setCurrentSite] = useState<Sites | null>(null);

  // 获取用户信息和站点数据
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setCurrentSite(userData.current_site || null);
      } catch (e) {
        console.error('解析用户信息失败', e);
      }
    }
    
    // 获取热门话题
    fetchTopics();
    
    // 获取帖子列表
    fetchPosts(1);
  }, [scope, topicId]);
  
  // 获取热门话题列表
  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/topics/hot');
      if (!response.ok) {
        throw new Error('获取热门话题失败');
      }
      const data = await response.json();
      setTopics(data.data || []);
    } catch (err) {
      console.error('获取话题错误:', err);
      setError('获取话题失败，请稍后再试');
    }
  };
  
  // 获取帖子列表
  const fetchPosts = async (pageNum: number, replace = true) => {
    setLoading(true);
    try {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      queryParams.append('page', pageNum.toString());
      queryParams.append('pageSize', '10');
      queryParams.append('sortBy', 'created_at');
      queryParams.append('sortOrder', 'desc');
      
      // 根据作用域决定是否添加站点ID过滤
      if (scope === 'site' && currentSite?.id) {
        queryParams.append('siteId', String(currentSite.id));
      }
      
      // 如果选择了话题，添加话题ID过滤
      if (topicId) {
        queryParams.append('topicId', topicId);
      }
      
      const response = await fetch(`/api/v1/posts?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('获取帖子列表失败');
      }
      
      const responseData = await response.json();
      
      if (responseData.success && responseData.data) {
        // 根据是否替换来决定如何更新帖子列表
        if (replace) {
          setPosts(responseData.data.items || []);
        } else {
          setPosts(prevPosts => [...prevPosts, ...(responseData.data?.items || [])]);
        }
        
        // 检查是否还有更多数据
        setHasMore(responseData.data.totalPages > pageNum);
        setPage(pageNum);
        setError('');
      }
    } catch (err) {
      console.error('获取帖子列表错误:', err);
      setError('获取帖子列表失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };
  
  // 加载更多帖子
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1, false);
    }
  };
  
  // 切换帖子显示范围（本站/全站）
  const handleScopeChange = (_: React.SyntheticEvent, newScope: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('scope', newScope);
    if (topicId) {
      params.set('topic', topicId);
    }
    router.push(`/client/posts?${params.toString()}`);
  };
  
  // 选择话题
  const handleTopicClick = (topicId: number | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('scope', scope);
    if (topicId) {
      params.set('topic', String(topicId));
    } else {
      params.delete('topic');
    }
    router.push(`/client/posts?${params.toString()}`);
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: { xs: 1, sm: 2 },
      bgcolor: theme.palette.background.default
    }}>
      <LoadingState loading={loading && page === 1} error={error}>
        {/* 本站/全站切换 */}
        <ScopeTabsArea 
          scope={scope} 
          onScopeChange={handleScopeChange} 
        />
        
        {/* 话题筛选区域 */}
        <TopicFilterArea 
          topics={topics} 
          selectedTopicId={topicId} 
          onTopicClick={handleTopicClick} 
        />
        
        {/* 帖子列表区域 */}
        <PostListArea 
          posts={posts} 
          loading={loading} 
          page={page} 
          hasMore={hasMore} 
          onLoadMore={loadMore} 
        />
      </LoadingState>
      
      {/* 悬浮发布按钮 */}
      <FloatingActionButton href="/client/posts/create" />
      
      {/* 底部导航栏 - 移动端显示 */}
      <MobileBottomNav />
    </Box>
  );
}
