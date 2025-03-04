'use client';

import React from 'react';
import { Box, Paper, Chip } from '@mui/material';
import { Topics } from '@/dataModel/types';

interface TopicFilterAreaProps {
  topics: Topics[];
  selectedTopicId: string | null;
  onTopicClick: (topicId: number | undefined) => void;
}

/**
 * 话题筛选区域组件
 */
const TopicFilterArea: React.FC<TopicFilterAreaProps> = ({ 
  topics, 
  selectedTopicId, 
  onTopicClick 
}) => {
  return (
    <Paper sx={{ mb: 2, p: 2, overflowX: 'auto' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'nowrap',
          gap: 1,
          pb: 1
        }}
      >
        <Chip 
          label="全部"
          color={!selectedTopicId ? "primary" : "default"}
          onClick={() => onTopicClick(undefined)}
          clickable
        />
        {topics.map(topic => {
          // 确保topic.id为数字类型
          const numericTopicId = topic.id ? Number(topic.id) : undefined;
          return (
            <Chip 
              key={topic.id}
              label={topic.name}
              color={selectedTopicId === String(topic.id) ? "primary" : "default"}
              onClick={() => onTopicClick(numericTopicId)}
              clickable
            />
          );
        })}
      </Box>
    </Paper>
  );
};

export default TopicFilterArea; 