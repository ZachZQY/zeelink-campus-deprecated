'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Avatar,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Alert,
  Switch,
  useTheme,
  IconButton,
  Snackbar,
  styled
} from '@mui/material';
import { useRouter } from 'next/navigation';
import MobileBottomNav from '@/components/client/layout/MobileBottomNav';
import { Users as User } from '@/dataModel/types';
import { useThemeContext } from '@/context/ThemeContext';
import useAuth from '@/lib/hooks/useAuth';

// 图标引入
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// 样式化组件
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  margin: '0 auto',
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
}));

export default function ProfilePage() {
  const router = useRouter();
  const theme = useTheme();
  const { mode, toggleColorMode } = useThemeContext();
  const { user, loading: authLoading, error: authError, logout, updateUserInfo, resetPassword, sendVerificationCode } = useAuth();
  
  // 状态管理
  const [nickname, setNickname] = useState<string>('');
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState<boolean>(false);
  const [mobile, setMobile] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // 获取用户信息
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        updateUserInfo(userData);
        setNickname(userData.nickname || '');
        setMobile(userData.mobile || '');
      } catch (e) {
        console.error('解析用户信息失败', e);
        setSnackbarMessage('获取用户信息失败');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } else {
      // 如果没有用户信息，跳转到登录页
      router.push('/client/login');
    }
  }, [router]);
  
  // 处理登出
  const handleLogout = () => {
    logout();
  };
  
  // 打开编辑昵称对话框
  const handleOpenEditDialog = () => {
    setNickname(user?.nickname || '');
    setEditDialogOpen(true);
  };
  
  // 关闭编辑昵称对话框
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };
  
  // 保存昵称
  const handleSaveNickname = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          nickname,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 更新本地存储的用户信息
        const updatedUser = { ...user, nickname };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        updateUserInfo(updatedUser);
        
        setSnackbarMessage('昵称更新成功');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        
        handleCloseEditDialog();
      } else {
        throw new Error(data.message || '更新失败');
      }
    } catch (err) {
      console.error('更新昵称错误:', err);
      setSnackbarMessage('更新昵称失败，请稍后再试');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  // 打开修改密码对话框
  const handleOpenPasswordDialog = () => {
    setNewPassword('');
    setConfirmPassword('');
    setVerificationCode('');
    setPasswordDialogOpen(true);
  };
  
  // 关闭修改密码对话框
  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
  };
  
  // 处理发送验证码
  const handleSendVerificationCode = async () => {
    if (!user) return;
    
    if (countdown > 0) return;
    
    // 使用 useAuth 中的 sendVerificationCode 方法
    const result = await sendVerificationCode({
      mobile: user.mobile,
      type: 'resetPassword'
    });
    
    if (result.success) {
      setSnackbarMessage('验证码已发送');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // 设置倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSnackbarMessage(result.error || '发送验证码失败');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // 处理保存密码
  const handleSavePassword = async () => {
    if (!user) return;
    
    // 密码验证
    if (newPassword !== confirmPassword) {
      setSnackbarMessage('两次输入的密码不一致');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    if (newPassword.length < 6) {
      setSnackbarMessage('密码长度不能少于6位');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    // 使用 useAuth 中的 resetPassword 方法
    const result = await resetPassword({
      mobile: user.mobile,
      newPassword,
      code: verificationCode
    });
    
    if (result.success) {
      setSnackbarMessage('密码修改成功');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setPasswordDialogOpen(false);
      
      // 清空表单
      setVerificationCode('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setSnackbarMessage(result.error || '密码修改失败');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // 打开头像上传对话框
  const handleOpenAvatarDialog = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarDialogOpen(true);
  };
  
  // 关闭头像上传对话框
  const handleCloseAvatarDialog = () => {
    setAvatarDialogOpen(false);
  };
  
  // 处理头像选择
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
      
      // 预览所选图片
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 上传头像
  const handleUploadAvatar = async () => {
    if (!avatarFile || !user?.id) return;
    
    setLoading(true);
    try {
      // 创建FormData对象上传文件
      const formData = new FormData();
      formData.append('file', avatarFile);
      formData.append('userId', String(user.id));
      
      const response = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 更新本地存储的用户信息
        const updatedUser = { ...user, avatar_url: data.data.avatar_url };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        updateUserInfo(updatedUser);
        
        setSnackbarMessage('头像更新成功');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        
        handleCloseAvatarDialog();
      } else {
        throw new Error(data.message || '上传失败');
      }
    } catch (err) {
      console.error('上传头像错误:', err);
      setSnackbarMessage('上传头像失败，请稍后再试');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  // 关闭提示消息
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: { xs: 1, sm: 2 },
      bgcolor: theme.palette.background.default 
    }}>
      {/* 顶部导航栏 */}
      <Paper 
        elevation={0}
        sx={{ 
          py: 1,
          px: 2,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          borderRadius: 1,
        }}
      >
        <IconButton 
          edge="start" 
          onClick={() => router.back()}
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          个人资料
        </Typography>
      </Paper>
      
      {/* 用户头像和昵称 */}
      <Paper 
        elevation={0}
        sx={{ 
          pt: 4, 
          pb: 3, 
          px: 2,
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 1,
        }}
      >
        <Box sx={{ position: 'relative', mb: 2 }}>
          <ProfileAvatar 
            src={user?.avatar_url || undefined}
            alt={user?.nickname || '用户'}
          >
            {!user?.avatar_url && (user?.nickname?.[0] || <PersonIcon />)}
          </ProfileAvatar>
          <IconButton
            sx={{
              position: 'absolute',
              right: -8,
              bottom: -8,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
            size="small"
            onClick={handleOpenAvatarDialog}
          >
            <PhotoCameraIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography variant="h5" gutterBottom>
          {user?.nickname || '用户'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {user?.mobile || ''}
        </Typography>
      </Paper>
      
      {/* 设置选项列表 */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 2,
          borderRadius: 1,
        }}
      >
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton onClick={handleOpenEditDialog}>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="修改昵称" />
            </ListItemButton>
          </ListItem>
          
          <Divider variant="inset" component="li" />
          
          <ListItem disablePadding>
            <ListItemButton onClick={handleOpenPasswordDialog}>
              <ListItemIcon>
                <LockIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="修改密码" />
            </ListItemButton>
          </ListItem>
          
          <Divider variant="inset" component="li" />
          
          <ListItem>
            <ListItemIcon>
              <NightlightIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="暗色主题" />
            <Switch
              edge="end"
              checked={mode === 'dark'}
              onChange={toggleColorMode}
            />
          </ListItem>
          
          <Divider variant="inset" component="li" />
          
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText 
                primary="退出登录" 
                primaryTypographyProps={{ color: 'error' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>
      
      {/* 编辑昵称对话框 */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseEditDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>修改昵称</DialogTitle>
        <DialogContent>
          {snackbarMessage && (
            <Alert severity={snackbarSeverity} sx={{ mb: 2 }}>{snackbarMessage}</Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="昵称"
            type="text"
            fullWidth
            variant="outlined"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>取消</Button>
          <Button 
            onClick={handleSaveNickname} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '保存'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 修改密码对话框 */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={handleClosePasswordDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>修改密码</DialogTitle>
        <DialogContent>
          {snackbarMessage && (
            <Alert severity={snackbarSeverity} sx={{ mb: 2 }}>{snackbarMessage}</Alert>
          )}
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="dense"
              label="手机号码"
              type="tel"
              fullWidth
              variant="outlined"
              value={mobile}
              disabled
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                margin="dense"
                label="验证码"
                type="text"
                fullWidth
                variant="outlined"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <Button 
                variant="outlined"
                onClick={handleSendVerificationCode}
                sx={{ mt: 1 }}
              >
                获取验证码
              </Button>
            </Box>
            
            <TextField
              margin="dense"
              label="新密码"
              type="password"
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              label="确认新密码"
              type="password"
              fullWidth
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog}>取消</Button>
          <Button 
            onClick={handleSavePassword} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '保存'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 上传头像对话框 */}
      <Dialog 
        open={avatarDialogOpen} 
        onClose={handleCloseAvatarDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>上传头像</DialogTitle>
        <DialogContent>
          {snackbarMessage && (
            <Alert severity={snackbarSeverity} sx={{ mb: 2 }}>{snackbarMessage}</Alert>
          )}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mt: 2 
          }}>
            {avatarPreview ? (
              <Avatar 
                src={avatarPreview} 
                sx={{ width: 120, height: 120, mb: 2 }}
              />
            ) : (
              <Avatar 
                src={user?.avatar_url || undefined}
                sx={{ width: 120, height: 120, mb: 2 }}
              >
                {!user?.avatar_url && (user?.nickname?.[0] || <PersonIcon />)}
              </Avatar>
            )}
            
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCameraIcon />}
            >
              选择图片
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAvatarDialog}>取消</Button>
          <Button 
            onClick={handleUploadAvatar} 
            variant="contained"
            disabled={loading || !avatarFile}
          >
            {loading ? <CircularProgress size={24} /> : '上传'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 提示消息 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
      
      {/* 底部导航栏 */}
      <MobileBottomNav />
    </Box>
  );
} 