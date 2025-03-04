'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import Carousel, { CarouselItem } from '@/components/client/common/Carousel';
import { SiteBanners, Sites } from '@/dataModel/types';

interface BannerAreaProps {
  banners: SiteBanners[];
  currentSite: Sites | null;
}

/**
 * 首页轮播图区域组件
 */
const BannerArea: React.FC<BannerAreaProps> = ({ banners, currentSite }) => {
  // 处理轮播图数据
  const carouselItems: CarouselItem[] = banners.map(banner => ({
    id: banner.id || 0,
    content: (
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          backgroundImage: `url(${banner.image_url || '/images/default-banner.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
            color: 'white',
          }}
        >
          <Typography variant="h5">{banner.name || '欢迎访问'}</Typography>
          <Typography variant="body2">{banner.site?.name || currentSite?.name || '知联社区'}</Typography>
        </Box>
      </Box>
    ),
    link: banner.link || '#',
  }));

  // 默认轮播图（无数据时显示）
  const defaultCarouselItems: CarouselItem[] = [
    {
      id: 1,
      content: (
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            backgroundImage: 'url(/images/default-banner-1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
              color: 'white',
            }}
          >
            <Typography variant="h5">{currentSite?.name || '知联校园'}</Typography>
            <Typography variant="body2">欢迎来到知联校园，连接你我，分享知识</Typography>
          </Box>
        </Box>
      ),
      link: '#',
    },
    {
      id: 2,
      content: (
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            backgroundImage: 'url(/images/default-banner-2.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
              color: 'white',
            }}
          >
            <Typography variant="h5">发现精彩内容</Typography>
            <Typography variant="body2">浏览热门话题，参与有趣讨论</Typography>
          </Box>
        </Box>
      ),
      link: '/client/posts',
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Carousel 
        items={banners.length > 0 ? carouselItems : defaultCarouselItems} 
        height={{ xs: 200, sm: 300, md: 400 }}
      />
    </Box>
  );
};

export default BannerArea; 