'use client';

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Avatar,
  Box
} from '@mui/material';
import { useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import SiteSelector from '@/components/client/common/SiteSelector';
import { Sites, Users } from '@/dataModel/types';

interface TopMenuAreaProps {
  user: Users | null;
  sites: Sites[];
  currentSite: Sites | null;
  onSiteChange: (siteId: number) => void;
}

/**
 * 首页顶部菜单区域组件
 */
const TopMenuArea: React.FC<TopMenuAreaProps> = ({ 
  user, 
  sites, 
  currentSite, 
  onSiteChange 
}) => {
  const router = useRouter();

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          知联
        </Typography>
        
        <SiteSelector 
          sites={sites} 
          currentSite={currentSite} 
          onSiteChange={onSiteChange} 
        />
        
        {user ? (
          <IconButton 
            color="inherit" 
            onClick={() => router.push('/client/profile')}
            sx={{ ml: 1 }}
          >
            <Avatar 
              src={user.avatar_url || undefined} 
              alt={user.nickname || '用户'}
              sx={{ width: 32, height: 32 }}
            >
              {!user.avatar_url && (user.nickname?.[0] || <PersonIcon />)}
            </Avatar>
          </IconButton>
        ) : (
          <Button 
            color="inherit" 
            onClick={() => router.push('/client/login')}
            sx={{ ml: 1 }}
          >
            登录
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopMenuArea; 