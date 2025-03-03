'use client';

import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Box, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import dynamic from 'next/dynamic';
import { DataTable, Column } from '@/components/common/DataTable';

// 动态导入组件
const PageHeader = dynamic(() => import('@/components/common/PageHeader'), { ssr: false });

// 用户类型定义
interface User {
  id: string | number;
  mobile: string;
  nickname: string;
  created_at: string;
  updated_at: string;
}

export default function UsersPage() {
  // 用户列表状态
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 新增用户状态
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    mobile: '',
    nickname: '',
    password: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  
  // 删除用户状态
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // 提示信息状态
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 表格列定义
  const columns: Column<User>[] = [
    { id: 'id', label: 'ID', minWidth: 80 },
    { id: 'nickname', label: '昵称', minWidth: 120 },
    { id: 'mobile', label: '手机号', minWidth: 120 },
    { 
      id: 'created_at', 
      label: '创建时间', 
      minWidth: 170,
      format: (value) => formatDate(value as string)
    },
    { 
      id: 'updated_at', 
      label: '更新时间', 
      minWidth: 170,
      format: (value) => formatDate(value as string)
    }
  ];

  // 加载用户数据
  const loadUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: (page + 1).toString(),
        pageSize: rowsPerPage.toString(),
        sortBy: 'created_at',
        sortOrder: 'desc'
      });
      
      if (searchKeyword) {
        queryParams.append('keyword', searchKeyword);
      }
      
      const response = await fetch(`/api/v1/users?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.code === 0 && data.data) {
        setUsers(data.data.items || []);
        setTotalCount(data.data.total || 0);
      } else {
        throw new Error(data.message || '获取用户列表失败');
      }
    } catch (error) {
      console.error('加载用户失败:', error);
      setSnackbar({
        open: true,
        message: '加载用户数据失败',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和参数变化时重新加载
  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage, searchKeyword]);

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 处理每页行数变化
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // 处理搜索
  const handleSearchChange = (keyword: string) => {
    setSearchKeyword(keyword);
    setPage(0);
  };

  // 处理添加用户表单变化
  const handleAddUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  // 提交添加用户
  const handleAddUser = async () => {
    if (!newUser.mobile || !newUser.password) {
      setSnackbar({
        open: true,
        message: '手机号和密码不能为空',
        severity: 'warning'
      });
      return;
    }

    setAddLoading(true);
    try {
      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      
      const data = await response.json();
      
      if (data.code === 0) {
        setSnackbar({
          open: true,
          message: '用户创建成功',
          severity: 'success'
        });
        setOpenAddDialog(false);
        setNewUser({ mobile: '', nickname: '', password: '' });
        loadUsers();
      } else {
        throw new Error(data.message || '创建用户失败');
      }
    } catch (error) {
      console.error('创建用户失败:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '创建用户失败',
        severity: 'error'
      });
    } finally {
      setAddLoading(false);
    }
  };

  // 删除用户
  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/v1/users/${deleteUserId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.code === 0) {
        setSnackbar({
          open: true,
          message: '用户删除成功',
          severity: 'success'
        });
        setOpenDeleteDialog(false);
        loadUsers();
      } else {
        throw new Error(data.message || '删除用户失败');
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '删除用户失败',
        severity: 'error'
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // 关闭提示信息
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <PageHeader 
        title="用户管理" 
        actionButton={{
          text: '创建用户',
          onClick: () => setOpenAddDialog(true)
        }}
        breadcrumbs={[
          { text: '首页', href: '/admin' },
          { text: '用户管理' }
        ]}
      />
      
      <DataTable
        columns={columns}
        rows={users}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSearchChange={handleSearchChange}
        rowKeyField="id"
        loading={loading}
        actions={{
          view: (row) => {
            // 查看用户详情
            window.location.href = `/admin/users/${row.id}`;
          },
          edit: (row) => {
            // 编辑用户
            window.location.href = `/admin/users/${row.id}/edit`;
          },
          delete: (row) => {
            setDeleteUserId(row.id);
            setOpenDeleteDialog(true);
          }
        }}
      />

      {/* 添加用户对话框 */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => !addLoading && setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>创建新用户</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            请填写新用户的信息。手机号和密码为必填项。
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="mobile"
            name="mobile"
            label="手机号"
            type="text"
            fullWidth
            variant="outlined"
            value={newUser.mobile}
            onChange={handleAddUserChange}
            sx={{ mb: 2 }}
            disabled={addLoading}
          />
          <TextField
            margin="dense"
            id="nickname"
            name="nickname"
            label="昵称"
            type="text"
            fullWidth
            variant="outlined"
            value={newUser.nickname}
            onChange={handleAddUserChange}
            sx={{ mb: 2 }}
            disabled={addLoading}
          />
          <TextField
            margin="dense"
            id="password"
            name="password"
            label="密码"
            type="password"
            fullWidth
            variant="outlined"
            value={newUser.password}
            onChange={handleAddUserChange}
            disabled={addLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenAddDialog(false)} 
            disabled={addLoading}
          >
            取消
          </Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained" 
            disabled={addLoading}
            startIcon={addLoading ? <CircularProgress size={20} /> : null}
          >
            {addLoading ? '创建中...' : '创建用户'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除用户确认对话框 */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => !deleteLoading && setOpenDeleteDialog(false)}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            您确定要删除这个用户吗？此操作无法撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={deleteLoading}
          >
            取消
          </Button>
          <Button 
            onClick={handleDeleteUser} 
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? '删除中...' : '删除'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 提示信息 */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
