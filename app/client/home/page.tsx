'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { Posts, Sites, Users, SiteBanners, SiteQuicklinks } from '@/dataModel/types';
import { useRouter } from 'next/navigation';
import MobileBottomNav from '@/components/client/layout/MobileBottomNav';
import FloatingActionButton from '@/components/client/common/FloatingActionButton';

// 导入拆分后的组件
import LoadingState from './components/loadingState';
import TopMenuArea from './components/topMenuArea';
import BannerArea from './components/bannerArea';
import QuickLinkArea from './components/quicklinkArea';
import PostListArea from './components/listArea';

// 主页组件
export default function HomePage() {
  const router = useRouter();

  // 状态管理
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSite, setCurrentSite] = useState<Sites | null>(null);
  const [user, setUser] = useState<Users | null>(null);
  const [banners, setBanners] = useState<SiteBanners[]>([]);
  const [quickLinks, setQuickLinks] = useState<SiteQuicklinks[]>([]);
  const [hotPosts, setHotPosts] = useState<Posts[]>([]);
  const [sites, setSites] = useState<Sites[]>([]);

  // 获取用户信息和站点数据
  useEffect(() => {
    const fetchUserAndSite = async () => {
      try {
        // 从本地存储获取用户信息
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setCurrentSite(userData.current_site || null);
        }

        // 获取站点列表
        const sitesResponse = await fetch('/api/v1/sites');
        if (!sitesResponse.ok) throw new Error('获取站点列表失败');
        const sitesData = await sitesResponse.json();
        setSites(sitesData.list || []);

        // 获取当前站点信息（如果未登录或无当前站点，则获取默认站点）
        const siteId = userStr ? JSON.parse(userStr)?.current_site?.id : null;
        await fetchSiteData(siteId || 1); // 假设ID为1是默认站点
      } catch (err) {
        console.error('初始化数据失败:', err);
        setError('获取初始数据失败，请稍后再试');
      }
    };

    fetchUserAndSite();
  }, []);

  // 获取站点数据（轮播图、快捷链接、热门帖子）
  const fetchSiteData = async (siteId: number) => {
    setLoading(true);
    try {
      // 获取站点数据
      const responseData = await fetch(`/api/v1/sites/${siteId}`);
      if (!responseData.ok) throw new Error('获取站点数据失败');
      const responseDataJson = await responseData.json();
      setBanners(responseDataJson.site_banners || []);

      setQuickLinks(responseDataJson.site_quicklinks || []);

      // 获取热门帖子
      const queryParams = {
        page: 1,
        pageSize: 10,
        sortBy: 'created_at',
        sortOrder: 'desc',
        siteId: siteId
      };

      const postsResponse = { success: true, data: { items: [] } };
      if (postsResponse.success && postsResponse.data) {
        setHotPosts(postsResponse.data.items || []);
      }

      setError('');
    } catch (err) {
      console.error('获取站点数据失败:', err);
      setError('获取数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 切换站点
  const handleSiteChange = async (siteId: number) => {
    try {
      // 更新用户的当前站点
      if (user) {
        const updatedUser = {
          ...user,
          current_site: sites.find(site => site.id === siteId) || null
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // 获取新站点的数据
      await fetchSiteData(siteId);
    } catch (err) {
      console.error('切换站点失败:', err);
      setError('切换站点失败，请稍后再试');
    }
  };

  return (
    <>
      {/* 顶部菜单区域 */}
      <TopMenuArea
        user={user}
        sites={sites}
        currentSite={currentSite}
        onSiteChange={handleSiteChange}
      />

      {/* 内容区域 */}
      <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2 } }}>
        <LoadingState loading={loading} error={error}>
          <>
            {/* 轮播图区域 */}
            <BannerArea banners={banners} currentSite={currentSite} />

            {/* 快捷链接区域 */}
            <QuickLinkArea quickLinks={quickLinks} />

            {/* 热门帖子区域 */}
            <PostListArea
              posts={hotPosts}
              title="热门帖子"
              emptyMessage="暂无热门帖子"
              seeMoreLink="/client/posts"
              seeMoreText="查看更多内容"
            />
          </>
        </LoadingState>
      </Box>

      {/* 悬浮发布按钮 */}
      <FloatingActionButton href="/client/posts/create" />

      {/* 底部导航栏 - 移动端显示 */}
      <MobileBottomNav />
    </>
  );
}
