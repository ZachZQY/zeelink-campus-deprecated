'use client';

import React from 'react';
import { 
  BottomNavigation, 
  BottomNavigationAction, 
  Paper, 
  useTheme 
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// 图标引入
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ForumIcon from '@mui/icons-material/Forum';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

// 导航选项
const navItems = [
  { label: '首页', value: '/client/home', activeIcon: <HomeIcon />, icon: <HomeOutlinedIcon /> },
  { label: '交流', value: '/client/posts', activeIcon: <ForumIcon />, icon: <ForumOutlinedIcon /> },
  { label: '我的', value: '/client/profile', activeIcon: <AccountCircleIcon />, icon: <AccountCircleOutlinedIcon /> }
];

/**
 * 移动端底部导航栏组件
 */
export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  
  // 确定当前活动项
  const currentValue = navItems.find(item => pathname?.startsWith(item.value))?.value || '/client/home';
  
  // 处理导航变化
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    router.push(newValue);
  };
  
  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 -1px 8px rgba(0,0,0,0.5)' 
          : '0 -1px 8px rgba(0,0,0,0.1)',
        display: { xs: 'block', md: 'none' },
        borderRadius: '16px 16px 0 0',
        overflow: 'hidden',
      }} 
      elevation={3}
    >
      <BottomNavigation 
        value={currentValue} 
        onChange={handleChange}
        showLabels
        sx={{
          height: 65,
          bgcolor: theme.palette.background.paper,
          '& .MuiBottomNavigationAction-root': {
            py: 1.5,
            minWidth: 0,
            maxWidth: '100%',
            color: theme.palette.text.secondary,
            '&.Mui-selected': {
              color: theme.palette.primary.main,
            },
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction 
            key={item.value}
            label={item.label}
            value={item.value}
            icon={
              currentValue === item.value ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.activeIcon}
                </motion.div>
              ) : (
                item.icon
              )
            }
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
} 