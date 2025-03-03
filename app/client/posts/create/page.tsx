'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  Divider,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Topics } from '@/dataModel/types';

export default function CreatePostPage() {
  const router = useRouter();
  
  // 表单状态
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  // 数据加载状态
  const [topicsList, setTopicsList] = useState<Topics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // 获取话题列表
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        
        // 模拟从API获取话题列表
        setTimeout(() => {
          const mockTopics: Topics[] = [
            { id: 1, name: '校园生活' },
            { id: 2, name: '学习交流' },
            { id: 3, name: '社团活动' },
            { id: 4, name: '求职就业' },
            { id: 5, name: '考研交流' },
            { id: 6, name: '校园公告' },
            { id: 7, name: '技术讨论' },
            { id: 8, name: '创新创业' },
          ];
          
          setTopicsList(mockTopics);
          setIsLoading(false);
        }, 600);
        
      } catch (err) {
        console.error('获取话题列表失败:', err);
        setError('获取话题列表失败，请稍后重试');
        setIsLoading(false);
      }
    };
    
    fetchTopics();
  }, []);
  
  // 选择话题事件处理
  const handleTopicChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];
    setSelectedTopics(value);
  };
  
  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      
      // 限制最多上传5张图片
      if (images.length + filesArray.length > 5) {
        setError('最多只能上传5张图片');
        return;
      }
      
      setImages([...images, ...filesArray]);
      
      // 创建预览URL
      const newImagePreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviewUrls]);
    }
  };
  
  // 移除图片
  const handleRemoveImage = (index: number) => {
    // 移除图片和预览URL
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviewUrls = [...imagePreviewUrls];
    // 释放URL对象以避免内存泄漏
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setImagePreviewUrls(newPreviewUrls);
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!title.trim()) {
      setError('请输入标题');
      return;
    }
    
    if (!content.trim()) {
      setError('请输入内容');
      return;
    }
    
    if (selectedTopics.length === 0) {
      setError('请至少选择一个话题');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // 构建表单数据
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      selectedTopics.forEach(topicId => {
        formData.append('topics', topicId.toString());
      });
      
      // 添加图片
      images.forEach(image => {
        formData.append('images', image);
      });
      
      // 这里应该调用API发送数据
      console.log('提交帖子:', {
        title,
        content,
        topics: selectedTopics,
        images
      });
      
      // 模拟API请求
      setTimeout(() => {
        setSuccess(true);
        setIsSubmitting(false);
        
        // 成功后2秒跳转到帖子列表页
        setTimeout(() => {
          router.push('/client/posts');
        }, 2000);
      }, 1000);
      
    } catch (err) {
      console.error('发布帖子失败:', err);
      setError('发布帖子失败，请稍后重试');
      setIsSubmitting(false);
    }
  };
  
  // 释放URL对象以避免内存泄漏
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          发布新内容
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {success ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            发布成功，正在跳转...
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {/* 标题 */}
            <TextField
              label="标题"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
            />
            
            {/* 内容 */}
            <TextField
              label="内容"
              fullWidth
              multiline
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              margin="normal"
              required
              placeholder="在这里输入内容..."
            />
            
            {/* 话题选择 */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="topics-select-label">选择话题</InputLabel>
              <Select
                labelId="topics-select-label"
                multiple
                value={selectedTopics}
                onChange={handleTopicChange}
                input={<OutlinedInput label="选择话题" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((topicId) => {
                      const topic = topicsList.find(t => t.id === topicId);
                      return (
                        <Chip key={topicId} label={topic?.name || ''} />
                      );
                    })}
                  </Box>
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  topicsList.map((topic) => (
                    <MenuItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            
            {/* 图片上传 */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                添加图片 (最多5张)
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {imagePreviewUrls.map((previewUrl, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      position: 'relative',
                      width: 100,
                      height: 100,
                      border: '1px solid #ddd',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <img 
                      src={previewUrl} 
                      alt={`上传图片${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        p: 0.5,
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.7)',
                        }
                      }}
                    >
                      ✕
                    </IconButton>
                  </Box>
                ))}
                
                {images.length < 5 && (
                  <Box
                    component="label"
                    htmlFor="upload-image"
                    sx={{
                      width: 100,
                      height: 100,
                      border: '1px dashed #aaa',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.03)',
                      }
                    }}
                  >
                    <input
                      id="upload-image"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <Typography color="text.secondary">
                      + 添加图片
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Typography variant="caption" color="text.secondary">
                支持 JPG, PNG, GIF 格式，单张图片不超过 5MB
              </Typography>
            </Box>
            
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
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
              >
                {isSubmitting ? '发布中...' : '发布'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
