'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  Tab,
  Tabs,
  IconButton,
  InputLabel,
  OutlinedInput,
  Link as MuiLink,
  Alert,
  AlertTitle
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 验证码组件
function VerificationCodeInput({ 
  mobile, 
  onSendCode, 
  loading, 
  disabled 
}: { 
  mobile: string; 
  onSendCode: () => void; 
  loading: boolean; 
  disabled: boolean;
}) {
  const [countdown, setCountdown] = useState(0);
  
  // 发送验证码并开始倒计时
  const handleSendCode = () => {
    if (countdown > 0 || loading) return;
    
    onSendCode();
    
    // 开始60秒倒计时
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
  };
  
  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={handleSendCode}
      disabled={disabled || countdown > 0 || loading}
      sx={{ 
        minWidth: '120px',
        height: '56px',
        ml: 1,
      }}
    >
      {countdown > 0 ? `${countdown}秒后重试` : loading ? '发送中...' : '获取验证码'}
    </Button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  
  // 密码登录状态
  const [passwordLogin, setPasswordLogin] = useState({
    mobile: '',
    password: '',
    showPassword: false,
  });
  
  // 验证码登录状态
  const [codeLogin, setCodeLogin] = useState({
    mobile: '',
    code: '',
  });
  
  // 错误信息
  const [errors, setErrors] = useState({
    passwordMobile: '',
    password: '',
    codeMobile: '',
    code: '',
    general: '',
  });
  
  // 加载状态
  const [loading, setLoading] = useState({
    passwordLogin: false,
    codeLogin: false,
    sendingCode: false,
  });
  
  // 系统通知
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'warning' | 'error'; title: string; message: string } | null>(null);
  
  // 处理选项卡切换
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // 切换选项卡时清除错误
    setErrors({
      passwordMobile: '',
      password: '',
      codeMobile: '',
      code: '',
      general: '',
    });
    setNotification(null);
  };
  
  // 处理密码可见性切换
  const handleClickShowPassword = () => {
    setPasswordLogin({
      ...passwordLogin,
      showPassword: !passwordLogin.showPassword,
    });
  };
  
  // 处理密码登录输入变化
  const handlePasswordLoginChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordLogin({ ...passwordLogin, [prop]: event.target.value });
    // 清除相关错误
    if (prop === 'mobile') {
      setErrors({ ...errors, passwordMobile: '', general: '' });
    } else if (prop === 'password') {
      setErrors({ ...errors, password: '', general: '' });
    }
    setNotification(null);
  };
  
  // 处理验证码登录输入变化
  const handleCodeLoginChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCodeLogin({ ...codeLogin, [prop]: event.target.value });
    // 清除相关错误
    if (prop === 'mobile') {
      setErrors({ ...errors, codeMobile: '', general: '' });
    } else if (prop === 'code') {
      setErrors({ ...errors, code: '', general: '' });
    }
    setNotification(null);
  };
  
  // 发送验证码
  const handleSendVerificationCode = async () => {
    // 基本验证
    if (!codeLogin.mobile) {
      setErrors({ ...errors, codeMobile: '请输入手机号' });
      return;
    }
    
    // 正则验证手机号格式
    const mobileRegex = /^1[3-9]\d{9}$/;
    if (!mobileRegex.test(codeLogin.mobile)) {
      setErrors({ ...errors, codeMobile: '请输入正确的手机号' });
      return;
    }
    
    try {
      setLoading({ ...loading, sendingCode: true });
      
      // 调用发送验证码API
      const response = await fetch('/api/v1/auth/sendVerificationCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: codeLogin.mobile,
          type: 'login'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '发送验证码失败');
      }
      
      // 成功发送，显示通知
      setNotification({
        type: 'success',
        title: '验证码已发送',
        message: data.message || '验证码已发送到您的手机，首次登录将自动注册账号'
      });
      
      // 如果在开发环境有返回验证码，自动填充
      if (data.data?.code) {
        setCodeLogin({ ...codeLogin, code: data.data.code });
      }
    } catch (error) {
      console.error('发送验证码错误:', error);
      setErrors({
        ...errors,
        codeMobile: error instanceof Error ? error.message : '发送验证码失败，请稍后再试',
      });
    } finally {
      setLoading({ ...loading, sendingCode: false });
    }
  };
  
  // 密码登录提交
  const handlePasswordLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // 清除错误和通知
    setErrors({
      passwordMobile: '',
      password: '',
      codeMobile: '',
      code: '',
      general: '',
    });
    setNotification(null);
    
    // 验证
    let hasError = false;
    const newErrors = { ...errors };
    
    if (!passwordLogin.mobile) {
      newErrors.passwordMobile = '请输入手机号';
      hasError = true;
    } else {
      const mobileRegex = /^1[3-9]\d{9}$/;
      if (!mobileRegex.test(passwordLogin.mobile)) {
        newErrors.passwordMobile = '请输入正确的手机号';
        hasError = true;
      }
    }
    
    if (!passwordLogin.password) {
      newErrors.password = '请输入密码';
      hasError = true;
    } else if (passwordLogin.password.length < 6) {
      newErrors.password = '密码长度不能少于6位';
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    // 提交登录
    try {
      setLoading({ ...loading, passwordLogin: true });
      
      // 调用登录API
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: passwordLogin.mobile,
          password: passwordLogin.password,
          loginType: 'password'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '登录失败');
      }
      
      // 登录成功，保存token并跳转
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      router.push('/');
    } catch (error) {
      console.error('登录错误:', error);
      setErrors({
        ...errors,
        general: error instanceof Error ? error.message : '登录失败，请检查账号和密码',
      });
    } finally {
      setLoading({ ...loading, passwordLogin: false });
    }
  };
  
  // 验证码登录提交
  const handleCodeLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // 清除错误和通知
    setErrors({
      passwordMobile: '',
      password: '',
      codeMobile: '',
      code: '',
      general: '',
    });
    setNotification(null);
    
    // 验证
    let hasError = false;
    const newErrors = { ...errors };
    
    if (!codeLogin.mobile) {
      newErrors.codeMobile = '请输入手机号';
      hasError = true;
    } else {
      const mobileRegex = /^1[3-9]\d{9}$/;
      if (!mobileRegex.test(codeLogin.mobile)) {
        newErrors.codeMobile = '请输入正确的手机号';
        hasError = true;
      }
    }
    
    if (!codeLogin.code) {
      newErrors.code = '请输入验证码';
      hasError = true;
    } else if (codeLogin.code.length !== 6) {
      newErrors.code = '验证码为6位数字';
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    // 提交登录
    try {
      setLoading({ ...loading, codeLogin: true });
      
      // 调用登录API
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: codeLogin.mobile,
          code: codeLogin.code,
          loginType: 'code'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '登录失败');
      }
      
      // 登录成功，保存token并跳转
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      // 如果是新用户，设置欢迎通知
      if (data.data.user.isNewUser) {
        localStorage.setItem('newUserWelcome', 'true');
      }
      
      router.push('/');
    } catch (error) {
      console.error('登录错误:', error);
      setErrors({
        ...errors,
        general: error instanceof Error ? error.message : '登录失败，请检查手机号和验证码',
      });
    } finally {
      setLoading({ ...loading, codeLogin: false });
    }
  };
  
  // 显示新用户提示信息
  useEffect(() => {
    // 设置初始通知，提示用户可以使用验证码登录并自动注册
    if (tabValue === 1) {
      setNotification({
        type: 'info',
        title: '温馨提示',
        message: '使用手机号验证码登录，首次登录将自动注册账号'
      });
    }
  }, [tabValue]);
  
  return (
    <Container maxWidth="sm" sx={{ pt: 8, pb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          账号登录
        </Typography>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          欢迎回到 Zeelink Campus
        </Typography>
        
        {errors.general && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.general}
          </Alert>
        )}
        
        {notification && (
          <Alert severity={notification.type} sx={{ mb: 3 }}>
            <AlertTitle>{notification.title}</AlertTitle>
            {notification.message}
          </Alert>
        )}
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="密码登录" />
          <Tab label="验证码登录" />
        </Tabs>
        
        {tabValue === 0 && (
          <Box component="form" onSubmit={handlePasswordLoginSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="mobile"
              label="手机号"
              name="mobile"
              autoComplete="tel"
              autoFocus
              value={passwordLogin.mobile}
              onChange={handlePasswordLoginChange('mobile')}
              error={!!errors.passwordMobile}
              helperText={errors.passwordMobile}
            />
            <FormControl 
              variant="outlined" 
              fullWidth 
              margin="normal"
              error={!!errors.password}
            >
              <InputLabel htmlFor="password">密码</InputLabel>
              <OutlinedInput
                id="password"
                type={passwordLogin.showPassword ? 'text' : 'password'}
                value={passwordLogin.password}
                onChange={handlePasswordLoginChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {passwordLogin.showPassword ? '👁️' : '👁️‍🗨️'}
                    </IconButton>
                  </InputAdornment>
                }
                label="密码"
              />
              {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
            </FormControl>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
              <Link href="/forgot-password" passHref>
                <MuiLink variant="body2">
                  忘记密码?
                </MuiLink>
              </Link>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading.passwordLogin}
            >
              {loading.passwordLogin ? '登录中...' : '登录'}
            </Button>
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box component="form" onSubmit={handleCodeLoginSubmit} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <TextField
                required
                fullWidth
                id="code-mobile"
                label="手机号"
                name="mobile"
                autoComplete="tel"
                value={codeLogin.mobile}
                onChange={handleCodeLoginChange('mobile')}
                error={!!errors.codeMobile}
                helperText={errors.codeMobile}
                sx={{ flexGrow: 1 }}
              />
              <VerificationCodeInput
                mobile={codeLogin.mobile}
                onSendCode={handleSendVerificationCode}
                loading={loading.sendingCode}
                disabled={!codeLogin.mobile || !!errors.codeMobile}
              />
            </Box>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label="验证码"
              name="code"
              autoComplete="one-time-code"
              value={codeLogin.code}
              onChange={handleCodeLoginChange('code')}
              error={!!errors.code}
              helperText={errors.code}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading.codeLogin}
            >
              {loading.codeLogin ? '登录中...' : '登录'}
            </Button>
          </Box>
        )}
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            或者
          </Typography>
        </Divider>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            没有账号? 使用验证码登录自动注册
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
