'use client';

import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Container, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Avatar, 
  Menu, 
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Badge
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // 用户菜单状态
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  // 移动端导航抽屉状态
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // 是否登录（实际项目中应从认证状态获取）
  const isLoggedIn = false;
  
  // 处理用户菜单打开
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  
  // 处理用户菜单关闭
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  // 处理移动端导航抽屉打开/关闭
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // 导航链接
  const navLinks = [
    { text: '首页', href: '/client/home' },
    { text: '话题', href: '/client/topics' },
    { text: '最新内容', href: '/client/posts' },
  ];
  
  // 移动端导航抽屉内容
  const drawer = (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Typography variant="h6" component="div">
        校园社区
      </Typography>
      <Divider sx={{ my: 1 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            href="/client/home"
            selected={pathname === '/client/home'}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemText primary="首页" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            href="/client/topics"
            selected={pathname?.startsWith('/client/topics')}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemText primary="话题" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            href="/client/posts"
            selected={pathname?.startsWith('/client/posts')}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemText primary="最新内容" />
          </ListItemButton>
        </ListItem>
        
        {!isLoggedIn && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                href="/client/login"
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary="登录" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                href="/client/register"
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary="注册" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        
        {isLoggedIn && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                href="/client/profile"
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary="个人资料" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                href="/client/my-posts"
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary="我的内容" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                href="/client/favorites"
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary="我的收藏" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                href="/client/notifications"
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary="消息通知" />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={() => {
                setMobileOpen(false);
                // 处理退出登录
              }}>
                <ListItemText primary="退出登录" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <AppBar position="static" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Logo和标题 - 桌面版 */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              href="/client/home"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              校园社区
            </Typography>

            {/* 汉堡菜单 - 移动版 */}
            <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                ☰
              </IconButton>
            </Box>

            {/* Logo和标题 - 移动版 */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              href="/client/home"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              校园社区
            </Typography>

            {/* 导航链接 - 桌面版 */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              <Button 
                component={Link} 
                href="/client/home"
                color={pathname === '/client/home' ? 'primary' : 'inherit'}
                sx={{ mx: 1 }}
              >
                首页
              </Button>
              <Button 
                component={Link} 
                href="/client/topics"
                color={pathname?.startsWith('/client/topics') ? 'primary' : 'inherit'}
                sx={{ mx: 1 }}
              >
                话题
              </Button>
              <Button 
                component={Link} 
                href="/client/posts"
                color={pathname?.startsWith('/client/posts') ? 'primary' : 'inherit'}
                sx={{ mx: 1 }}
              >
                最新内容
              </Button>
            </Box>

            {/* 用户菜单/登录按钮 */}
            <Box sx={{ flexGrow: 0 }}>
              {isLoggedIn ? (
                <Box sx={{ ml: 'auto' }}>
                  <IconButton 
                    component={Link}
                    href="/client/notifications"
                    sx={{ mr: 2 }}
                  >
                    <Badge badgeContent={4} color="error">
                      📬
                    </Badge>
                  </IconButton>
                  <IconButton 
                    onClick={handleOpenUserMenu}
                    aria-controls={Boolean(anchorElUser) ? 'user-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={Boolean(anchorElUser) ? 'true' : undefined}
                  >
                    <Avatar 
                      alt="用户头像" 
                      src="/avatars/default.jpg"
                      sx={{ width: 32, height: 32 }}
                    />
                  </IconButton>
                  <Menu
                    id="user-menu"
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem 
                      component={Link} 
                      href="/client/profile"
                      onClick={handleCloseUserMenu}
                    >
                      个人资料
                    </MenuItem>
                    <MenuItem 
                      component={Link} 
                      href="/client/my-posts"
                      onClick={handleCloseUserMenu}
                    >
                      我的内容
                    </MenuItem>
                    <MenuItem 
                      component={Link} 
                      href="/client/favorites"
                      onClick={handleCloseUserMenu}
                    >
                      我的收藏
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleCloseUserMenu}>
                      退出登录
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ ml: 'auto' }}>
                  <Button 
                    component={Link} 
                    href="/client/login"
                    variant="outlined" 
                    sx={{ mr: 1 }}
                  >
                    登录
                  </Button>
                  <Button 
                    component={Link} 
                    href="/client/register"
                    variant="contained" 
                    color="primary"
                  >
                    注册
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 移动端导航抽屉 */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true, // 提高移动端性能
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* 主要内容 */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      {/* 页脚 */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link href="/client/home" color="inherit">
              校园社区
            </Link>{' '}
            {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
