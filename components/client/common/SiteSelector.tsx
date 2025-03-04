'use client';

import React, { useState } from 'react';
import { 
  Button, 
  Menu, 
  MenuItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  Avatar,
  Typography,
  useTheme,
  Box,
  Skeleton
} from '@mui/material';
import { Sites as Site } from '@/dataModel/types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';

interface SiteSelectorProps {
  sites: Site[];
  currentSite: Site | null;
  onSiteChange: (siteId: number) => void;
  loading?: boolean;
}

/**
 * 站点选择器组件
 * 显示当前站点名称，点击打开选择菜单
 */
export default function SiteSelector({ sites, currentSite, onSiteChange, loading = false }: SiteSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleSiteClick = (siteId: number | undefined) => {
    if (siteId) {
      onSiteChange(siteId);
    }
    handleClose();
  };
  
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
      ) : (
        <Button
          onClick={handleClick}
          endIcon={<ExpandMoreIcon />}
          sx={{
            borderRadius: 1.5,
            px: 1.5,
            py: 0.75,
            textTransform: 'none',
            color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.08)' 
              : 'rgba(0, 0, 0, 0.04)',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.12)' 
                : 'rgba(0, 0, 0, 0.08)',
            },
            transition: 'all 0.2s',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {currentSite && (
              <Avatar 
                src={getInitialAvatar(currentSite.name || '未知站点')}
                alt={currentSite.name || '未知站点'}
                sx={{ 
                  width: 24, 
                  height: 24, 
                  mr: 1,
                  backgroundColor: theme.palette.primary.main,
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}
              >
                {getInitials(currentSite.name || '未知')}
              </Avatar>
            )}
            <Typography variant="body1" component="span">
              {currentSite?.name || '选择站点'}
            </Typography>
          </Box>
        </Button>
      )}
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 200,
            mt: 1.5,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(0,0,0,0.5)'
              : '0 4px 20px rgba(0,0,0,0.15)',
            '& .MuiList-root': {
              py: 1,
            },
          }
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          选择站点
        </Typography>
        <Divider sx={{ my: 0.5 }} />
        
        {sites.map((site) => {
          const isSelected = currentSite?.id === site.id;
          
          return (
            <MenuItem 
              key={site.id} 
              onClick={() => handleSiteClick(site.id as number)}
              selected={isSelected}
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 1,
                mx: 1,
                width: 'calc(100% - 16px)',
                '&.Mui-selected': {
                  backgroundColor: `${theme.palette.primary.main}15`,
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}25`,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Avatar 
                  src={getInitialAvatar(site.name || '未知站点')}
                  alt={site.name || '未知站点'}
                  sx={{ 
                    width: 28, 
                    height: 28,
                    backgroundColor: theme.palette.primary.main,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  {getInitials(site.name || '未知')}
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary={site.name} 
                primaryTypographyProps={{
                  variant: 'body1',
                  fontWeight: isSelected ? 'medium' : 'normal',
                }}
              />
              {isSelected && (
                <CheckIcon color="primary" fontSize="small" />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

// 获取名称首字母
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// 根据名称生成头像URL (在实际项目中可以使用UI Avatars等服务)
function getInitialAvatar(name: string): string {
  const initials = encodeURIComponent(getInitials(name));
  return `https://ui-avatars.com/api/?name=${initials}&background=7985CB&color=fff`;
} 