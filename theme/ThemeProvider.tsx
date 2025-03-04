'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { responsiveLight, responsiveDark } from './theme';

// 创建主题上下文
type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

// 主题提供者组件
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // 检查本地存储中是否有主题偏好
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // 在客户端初始化时读取主题偏好
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark') {
      setDarkMode(true);
    } else if (savedTheme === 'light') {
      setDarkMode(false);
    } else {
      // 如果没有保存的偏好，则使用系统偏好
      setDarkMode(prefersDark);
    }
  }, []);
  
  // 切换主题
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };
  
  // 根据当前主题模式选择对应的主题
  const theme = darkMode ? responsiveDark : responsiveLight;
  
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// 自定义钩子，用于在组件中访问主题上下文
export const useThemeContext = () => useContext(ThemeContext); 