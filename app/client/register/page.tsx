'use client';

import React, { useState } from 'react';
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
  IconButton,
  InputLabel,
  OutlinedInput,
  Link as MuiLink,
  Alert,
  Checkbox,
  FormControlLabel
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

export default function RegisterPage() {
  const router = useRouter();
  
  // 注册表单状态
  const [formData, setFormData] = useState({
    mobile: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    code: '',
    agreeTerms: false,
    showPassword: false,
    showConfirmPassword: false,
  });
  
  // 错误信息
  const [errors, setErrors] = useState({
    mobile: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    code: '',
    agreeTerms: '',
    general: '',
  });
  
  // 加载状态
  const [loading, setLoading] = useState({
    register: false,
    sendingCode: false,
  });
  
  // 处理输入变化
  const handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [prop]: event.target.value });
    // 清除相关错误
    if (prop in errors) {
      setErrors({ ...errors, [prop]: '', general: '' });
    }
  };
  
  // 处理复选框变化
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, agreeTerms: event.target.checked });
    setErrors({ ...errors, agreeTerms: '' });
  };
  
  // 处理密码可见性切换
  const handleClickShowPassword = (field: 'password' | 'confirmPassword') => () => {
    if (field === 'password') {
      setFormData({ ...formData, showPassword: !formData.showPassword });
    } else {
      setFormData({ ...formData, showConfirmPassword: !formData.showConfirmPassword });
    }
  };
  
  // 发送验证码
  const handleSendVerificationCode = async () => {
    // 基本验证
    if (!formData.mobile) {
      setErrors({ ...errors, mobile: '请输入手机号' });
      return;
    }
    
    // 正则验证手机号格式
    const mobileRegex = /^1[3-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setErrors({ ...errors, mobile: '请输入正确的手机号' });
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
          mobile: formData.mobile,
          type: 'register'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '发送验证码失败');
      }
      
      // 成功发送
      console.log('验证码发送成功');
    } catch (error) {
      console.error('发送验证码错误:', error);
      setErrors({
        ...errors,
        mobile: error instanceof Error ? error.message : '发送验证码失败，请稍后再试',
      });
    } finally {
      setLoading({ ...loading, sendingCode: false });
    }
  };
  
  // 表单提交
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // 清除错误
    setErrors({
      mobile: '',
      nickname: '',
      password: '',
      confirmPassword: '',
      code: '',
      agreeTerms: '',
      general: '',
    });
    
    // 验证
    let hasError = false;
    const newErrors = { ...errors };
    
    // 手机号验证
    if (!formData.mobile) {
      newErrors.mobile = '请输入手机号';
      hasError = true;
    } else {
      const mobileRegex = /^1[3-9]\d{9}$/;
      if (!mobileRegex.test(formData.mobile)) {
        newErrors.mobile = '请输入正确的手机号';
        hasError = true;
      }
    }
    
    // 昵称验证
    if (!formData.nickname) {
      newErrors.nickname = '请输入昵称';
      hasError = true;
    } else if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      newErrors.nickname = '昵称长度应在2-20个字符之间';
      hasError = true;
    }
    
    // 密码验证
    if (!formData.password) {
      newErrors.password = '请输入密码';
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度不能少于6位';
      hasError = true;
    }
    
    // 确认密码验证
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
      hasError = true;
    }
    
    // 验证码验证
    if (!formData.code) {
      newErrors.code = '请输入验证码';
      hasError = true;
    } else if (formData.code.length !== 6) {
      newErrors.code = '验证码为6位数字';
      hasError = true;
    }
    
    // 服务条款验证
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '请阅读并同意服务条款';
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    // 提交注册
    try {
      setLoading({ ...loading, register: true });
      
      // 调用注册API
      // 实际项目中替换为真实API调用
      console.log('注册表单提交', formData);
      
      // 注册成功，模拟跳转（实际项目中替换为真实API调用后的跳转）
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error) {
      console.error('注册错误:', error);
      setErrors({
        ...errors,
        general: error instanceof Error ? error.message : '注册失败，请稍后再试',
      });
    } finally {
      setLoading({ ...loading, register: false });
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ pt: 8, pb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          创建新账号
        </Typography>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          加入 Zeelink Campus，开始你的校园社区之旅
        </Typography>
        
        {errors.general && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.general}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', mb: 3 }}>
            <TextField
              required
              fullWidth
              id="mobile"
              label="手机号"
              name="mobile"
              autoComplete="tel"
              autoFocus
              value={formData.mobile}
              onChange={handleChange('mobile')}
              error={!!errors.mobile}
              helperText={errors.mobile}
              sx={{ flexGrow: 1 }}
            />
            <VerificationCodeInput
              mobile={formData.mobile}
              onSendCode={handleSendVerificationCode}
              loading={loading.sendingCode}
              disabled={!formData.mobile || !!errors.mobile}
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
            value={formData.code}
            onChange={handleChange('code')}
            error={!!errors.code}
            helperText={errors.code}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="nickname"
            label="昵称"
            name="nickname"
            autoComplete="nickname"
            value={formData.nickname}
            onChange={handleChange('nickname')}
            error={!!errors.nickname}
            helperText={errors.nickname}
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
              type={formData.showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword('password')}
                    edge="end"
                  >
                    {formData.showPassword ? '👁️' : '👁️‍🗨️'}
                  </IconButton>
                </InputAdornment>
              }
              label="密码"
            />
            {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
          </FormControl>
          
          <FormControl 
            variant="outlined" 
            fullWidth 
            margin="normal"
            error={!!errors.confirmPassword}
          >
            <InputLabel htmlFor="confirm-password">确认密码</InputLabel>
            <OutlinedInput
              id="confirm-password"
              type={formData.showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword('confirmPassword')}
                    edge="end"
                  >
                    {formData.showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </IconButton>
                </InputAdornment>
              }
              label="确认密码"
            />
            {errors.confirmPassword && <FormHelperText>{errors.confirmPassword}</FormHelperText>}
          </FormControl>
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={formData.agreeTerms} 
                onChange={handleCheckboxChange} 
                name="agreeTerms" 
                color="primary" 
              />
            }
            label={
              <Typography variant="body2">
                我已阅读并同意 
                <Link href="/terms" passHref>
                  <MuiLink>服务条款</MuiLink>
                </Link>
                {' '}和{' '}
                <Link href="/privacy" passHref>
                  <MuiLink>隐私政策</MuiLink>
                </Link>
              </Typography>
            }
            sx={{ mt: 2 }}
          />
          {errors.agreeTerms && (
            <FormHelperText error>{errors.agreeTerms}</FormHelperText>
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading.register}
          >
            {loading.register ? '注册中...' : '注册'}
          </Button>
        </Box>
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            或者
          </Typography>
        </Divider>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" display="inline">
            已有账号? 
          </Typography>
          <Link href="/login" passHref>
            <MuiLink variant="body2" sx={{ ml: 1 }}>
              立即登录
            </MuiLink>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
