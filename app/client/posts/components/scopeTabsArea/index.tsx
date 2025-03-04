'use client';

import React from 'react';
import { Paper, Tabs, Tab } from '@mui/material';

interface ScopeTabsAreaProps {
  scope: string;
  onScopeChange: (event: React.SyntheticEvent, newScope: string) => void;
}

/**
 * 交流页面的本站/全站切换标签组件
 */
const ScopeTabsArea: React.FC<ScopeTabsAreaProps> = ({ scope, onScopeChange }) => {
  return (
    <Paper sx={{ mb: 2 }}>
      <Tabs 
        value={scope} 
        onChange={onScopeChange}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{
          '& .MuiTab-root': {
            py: 1.5,
            fontWeight: 'medium',
          }
        }}
      >
        <Tab label="本站内容" value="site" />
        <Tab label="全站内容" value="all" />
      </Tabs>
    </Paper>
  );
};

export default ScopeTabsArea; 