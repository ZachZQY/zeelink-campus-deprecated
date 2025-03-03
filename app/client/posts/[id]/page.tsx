'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Avatar, 
  Chip, 
  Divider, 
  Button, 
  TextField,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Posts } from '@/dataModel/types';

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Posts | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Posts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');

  // 获取帖子数据
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setIsLoading(true);
        
        // 这里应该从API获取帖子详情
        // 模拟API返回的数据
        setTimeout(() => {
          const mockPost: Posts = {
            id: Number(postId),
            content: '这是一篇关于校园生活的帖子，分享了日常学习和生活的点滴。大学生活充满了各种各样的挑战和机遇，希望这篇文章能够给大家带来一些启发和帮助。\n\n作为一名大学生，我认为最重要的是要平衡好学习和生活的关系。学习固然重要，但是也不能忽视个人成长和社交活动。参加各种社团和课外活动，能够帮助我们拓展视野，结交朋友，培养各种软技能。\n\n在学习方面，我建议大家制定合理的学习计划，掌握科学的学习方法，提高学习效率。同时，也要关注自己的身心健康，保持良好的作息习惯和饮食习惯。\n\n希望大家都能度过一个充实而有意义的大学生活！',
            created_at: '2025-03-01T14:30:00Z',
            updated_at: '2025-03-01T14:30:00Z',
            title: '大学生活的点滴体验',
            author: {
              id: 1,
              nickname: '校园达人',
              avatar: '/avatars/default.jpg',
            },
            post_topics: [
              {
                id: 1,
                topic: {
                  id: 1,
                  name: '校园生活'
                }
              },
              {
                id: 2,
                topic: {
                  id: 2,
                  name: '学习心得'
                }
              }
            ],
            view_count: 128,
            like_count: 46,
            comment_count: 12,
            comments: [
              {
                id: 1,
                content: '很有共鸣的一篇文章，谢谢分享！',
                created_at: '2025-03-01T15:10:00Z',
                author: {
                  id: 2,
                  nickname: '学习爱好者',
                  avatar: '/avatars/default.jpg'
                }
              },
              {
                id: 2,
                content: '能分享一下你是如何平衡学习和社交的吗？',
                created_at: '2025-03-01T16:05:00Z',
                author: {
                  id: 3,
                  nickname: '大一新生',
                  avatar: '/avatars/default.jpg'
                }
              }
            ]
          };
          
          setPost(mockPost);
          
          // 模拟相关帖子
          setRelatedPosts([
            {
              id: 101,
              title: '如何高效复习期末考试',
              content: '期末考试即将来临，本文分享一些高效复习的方法...',
              created_at: '2025-02-28T10:15:00Z',
              author: {
                id: 5,
                nickname: '学霸一号',
                avatar: '/avatars/default.jpg'
              }
            },
            {
              id: 102,
              title: '校园社团活动推荐',
              content: '参加社团活动是丰富大学生活的重要方式...',
              created_at: '2025-02-25T09:30:00Z',
              author: {
                id: 6,
                nickname: '社团达人',
                avatar: '/avatars/default.jpg'
              }
            }
          ]);
          
          setIsLoading(false);
        }, 800);
        
      } catch (err) {
        console.error('获取帖子详情失败:', err);
        setError('获取帖子详情失败，请稍后重试');
        setIsLoading(false);
      }
    };
    
    fetchPostDetail();
  }, [postId]);

  // 格式化日期
  const formatDate = (dateString?: string | number) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // 提交评论
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    // 这里应该调用API提交评论
    console.log('提交评论:', comment);
    
    // 清空评论框
    setComment('');
    
    // 模拟添加评论
    if (post) {
      const newComment = {
        id: Date.now(),
        content: comment,
        created_at: new Date().toISOString(),
        author: {
          id: 999, // 假设当前登录用户
          nickname: '当前用户',
          avatar: '/avatars/default.jpg'
        }
      };
      
      setPost({
        ...post,
        comments: [...(post.comments || []), newComment],
        comment_count: (post.comment_count || 0) + 1
      });
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Alert severity="info">未找到该帖子</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Grid container spacing={4}>
        {/* 主要内容区 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4 }}>
            {/* 帖子标题 */}
            <Typography variant="h4" component="h1" gutterBottom>
              {post.title}
            </Typography>
            
            {/* 作者信息和发布时间 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={post.author?.avatar || "/avatars/default.jpg"} 
                alt={post.author?.nickname}
                sx={{ mr: 1.5 }}
              />
              <Box>
                <Typography 
                  variant="subtitle1" 
                  component={Link} 
                  href={`/client/profile/${post.author?.id}`}
                  sx={{ 
                    textDecoration: 'none',
                    color: 'primary.main',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {post.author?.nickname}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {formatDate(post.created_at)}
                </Typography>
              </Box>
            </Box>
            
            {/* 话题标签 */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              {post.post_topics?.map((postTopic) => (
                <Chip 
                  key={postTopic.id}
                  label={`#${postTopic.topic?.name}`}
                  size="small"
                  component={Link}
                  href={`/client/topics/${postTopic.topic?.id}`}
                  clickable
                />
              ))}
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* 帖子内容 */}
            <Typography variant="body1" sx={{ mb: 4, whiteSpace: 'pre-wrap' }}>
              {post.content}
            </Typography>
            
            {/* 媒体内容 - 如果有图片等 */}
            {post.media_data && (
              <Box sx={{ mb: 3 }}>
                {/* 这里可以渲染图片等媒体内容 */}
              </Box>
            )}
            
            {/* 点赞和分享按钮 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                  startIcon="❤️"
                  sx={{ mr: 2 }}
                >
                  点赞({post.like_count || 0})
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                  startIcon="🔄"
                >
                  分享
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary">
                阅读 {post.view_count || 0}
              </Typography>
            </Box>
          </Paper>
          
          {/* 评论区 */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              评论 ({post.comment_count || 0})
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {/* 评论输入框 */}
            <Box component="form" onSubmit={handleSubmitComment} sx={{ mb: 4 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="说点什么..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={!comment.trim()}
                >
                  发表评论
                </Button>
              </Box>
            </Box>
            
            {/* 评论列表 */}
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <Box key={comment.id} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Avatar 
                      src={comment.author?.avatar || "/avatars/default.jpg"}
                      alt={comment.author?.nickname}
                      sx={{ width: 36, height: 36, mr: 1.5 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography 
                          variant="subtitle2" 
                          component={Link} 
                          href={`/client/profile/${comment.author?.id}`}
                          sx={{ 
                            textDecoration: 'none',
                            color: 'primary.main',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {comment.author?.nickname}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(comment.created_at)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {comment.content}
                      </Typography>
                      <Box sx={{ display: 'flex', mt: 1 }}>
                        <Button size="small" sx={{ minWidth: 'auto', p: 0.5, mr: 1 }}>
                          回复
                        </Button>
                        <Button size="small" sx={{ minWidth: 'auto', p: 0.5 }}>
                          点赞
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  {/* 添加分隔线，除了最后一个评论 */}
                  {comment.id !== post.comments[post.comments.length - 1].id && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </Box>
              ))
            ) : (
              <Typography align="center" color="text.secondary" sx={{ my: 3 }}>
                暂无评论，来发表第一条评论吧
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* 侧边栏 */}
        <Grid item xs={12} md={4}>
          {/* 作者信息卡片 */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              关于作者
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={post.author?.avatar || "/avatars/default.jpg"}
                alt={post.author?.nickname}
                sx={{ width: 64, height: 64, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">
                  {post.author?.nickname}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  发帖 {post.author?.post_count || 0}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
              {post.author?.bio || "这个用户很懒，还没有填写个人简介"}
            </Typography>
            
            <Button 
              variant="outlined" 
              fullWidth
              component={Link}
              href={`/client/profile/${post.author?.id}`}
            >
              查看个人主页
            </Button>
          </Paper>
          
          {/* 相关帖子 */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              相关帖子
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {relatedPosts.length > 0 ? (
              relatedPosts.map((relatedPost) => (
                <Card 
                  key={relatedPost.id} 
                  sx={{ 
                    mb: 2, 
                    border: 'none', 
                    boxShadow: 'none',
                    '&:last-child': { mb: 0 } 
                  }}
                >
                  <CardContent sx={{ p: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      component={Link}
                      href={`/client/posts/${relatedPost.id}`}
                      sx={{ 
                        textDecoration: 'none',
                        color: 'text.primary',
                        '&:hover': { 
                          textDecoration: 'underline',
                          color: 'primary.main' 
                        },
                        display: 'block',
                        mb: 0.5
                      }}
                    >
                      {relatedPost.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={relatedPost.author?.avatar || "/avatars/default.jpg"}
                        alt={relatedPost.author?.nickname}
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {relatedPost.author?.nickname} · {formatDate(relatedPost.created_at).split(' ')[0]}
                      </Typography>
                    </Box>
                  </CardContent>
                  {relatedPost.id !== relatedPosts[relatedPosts.length - 1].id && (
                    <Divider />
                  )}
                </Card>
              ))
            ) : (
              <Typography align="center" color="text.secondary">
                暂无相关帖子
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
