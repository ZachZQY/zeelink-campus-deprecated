'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  IconButton
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { User } from '@/dataModel/types';

export default function EditProfilePage() {
  const router = useRouter();
  
  // 用户资料状态
  const [profile, setProfile] = useState<User | null>(null);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  // UI状态
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // 加载用户资料
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        
        // 模拟API请求获取当前用户资料
        setTimeout(() => {
          const mockProfile: User = {
            id: 1001, // 当前登录用户ID
            nickname: '我自己',
            mobile: '13800138000',
            bio: '热爱分享校园生活的点滴，欢迎关注我！',
            avatar: '/avatars/default.jpg',
            post_count: 25,
            follower_count: 124,
            following_count: 56,
            created_at: '2023-09-01T08:00:00Z'
          };
          
          setProfile(mockProfile);
          setNickname(mockProfile.nickname || '');
          setBio(mockProfile.bio || '');
          setAvatarPreview(mockProfile.avatar || '/avatars/default.jpg');
          
          setIsLoading(false);
        }, 800);
        
      } catch (err) {
        console.error('获取用户资料失败:', err);
        setError('获取用户资料失败，请稍后重试');
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  // 处理头像上传
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // 检查文件类型
      if (!file.type.match('image.*')) {
        setError('请上传图片文件');
        return;
      }
      
      // 检查文件大小 (最大2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('图片大小不能超过2MB');
        return;
      }
      
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!nickname.trim()) {
      setError('昵称不能为空');
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      
      // 构建表单数据
      const formData = new FormData();
      formData.append('nickname', nickname);
      formData.append('bio', bio);
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      // 这里应该调用API发送数据
      console.log('保存用户资料:', {
        nickname,
        bio,
        avatarFile: avatarFile ? avatarFile.name : null
      });
      
      // 模拟API请求
      setTimeout(() => {
        setSuccess(true);
        setIsSaving(false);
        
        // 更新本地资料状态
        if (profile) {
          setProfile({
            ...profile,
            nickname: nickname,
            bio: bio,
            avatar: avatarPreview
          });
        }
        
        // 成功后2秒跳转到个人资料页
        setTimeout(() => {
          router.push('/client/profile/1001'); // 跳转到当前用户个人资料页
        }, 2000);
      }, 1000);
      
    } catch (err) {
      console.error('保存用户资料失败:', err);
      setError('保存用户资料失败，请稍后重试');
      setIsSaving(false);
    }
  };
  
  // 清理预览URL
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          编辑个人资料
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {success ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            保存成功，正在跳转到个人资料页...
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Grid container spacing={4}>
              {/* 头像上传区 */}
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle1" gutterBottom>
                  个人头像
                </Typography>
                
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <Avatar 
                    src={avatarPreview || '/avatars/default.jpg'} 
                    alt="用户头像"
                    sx={{ width: 150, height: 150 }}
                  />
                  <Box
                    component="label"
                    htmlFor="avatar-upload"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }}
                  >
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                    <Typography variant="body1">✏️</Typography>
                  </Box>
                </Box>
                
                <Typography variant="caption" color="text.secondary" align="center">
                  点击图标上传新头像<br />
                  支持JPG、PNG格式，最大2MB
                </Typography>
              </Grid>
              
              {/* 个人资料表单 */}
              <Grid item xs={12} md={8}>
                {/* 昵称 */}
                <TextField
                  label="昵称"
                  fullWidth
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  margin="normal"
                  required
                  helperText="昵称长度在2-20个字符之间"
                />
                
                {/* 个人简介 */}
                <TextField
                  label="个人简介"
                  fullWidth
                  multiline
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  margin="normal"
                  placeholder="介绍一下自己吧..."
                  helperText="最多200字"
                  inputProps={{ maxLength: 200 }}
                />
                
                {/* 手机号（只读） */}
                <TextField
                  label="手机号"
                  fullWidth
                  value={profile?.mobile || ''}
                  margin="normal"
                  disabled
                  helperText="手机号无法修改，如需更换请联系客服"
                />
                
                {/* 提交按钮 */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => router.back()}
                  >
                    取消
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={20} /> : undefined}
                  >
                    {isSaving ? '保存中...' : '保存修改'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
      
      {/* 账号安全设置 */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          账号安全
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1">修改密码</Typography>
            <Typography variant="body2" color="text.secondary">
              定期修改密码可以提高账号安全性
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => router.push('/client/profile/change-password')}
          >
            修改
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1">账号注销</Typography>
            <Typography variant="body2" color="text.secondary">
              注销后账号数据将无法恢复
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            color="error"
          >
            注销账号
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
