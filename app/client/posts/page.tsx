'use client';

import React from 'react';
import { Container, Typography, Box } from '@mui/material';

export default function PostsPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          最新内容
        </Typography>
        <Typography variant="body1" color="text.secondary">
          查看社区最新发布的内容
        </Typography>
      </Box>
    </Container>
  );
}
