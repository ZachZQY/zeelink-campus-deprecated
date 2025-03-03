import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, ID, TEXT, TIMESTAMPTZ } from '@/dataModel/types';
import { ezClient } from '../tools/ezclient';
import { getDefaultSite, updateUserCurrentSite, getUserCurrentSite } from './site';

// 配置项
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';
const VERIFICATION_CODE_EXPIRY = 5 * 60; // 5分钟，单位：秒

// JWT载荷接口
export interface UserPayload {
  id: ID;
  mobile: string;
  nickname: string;
  role: 'user' | 'admin';
  current_site_id?: ID;
}

// 扩展User接口以包含额外字段
interface UserExtended extends User {
  role?: 'user' | 'admin';
  last_login_at?: TIMESTAMPTZ;
  avatar_url?: TEXT;
  bio?: TEXT;
}

// 模拟验证码存储（实际项目中应该使用Redis）
interface VerificationCodeRecord {
  code: string;
  createdAt: string;
  expiresAt: string;
}

const verificationCodes: Map<string, VerificationCodeRecord> = new Map();

/**
 * 生成JWT令牌
 */
export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 验证JWT令牌
 */
export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * 从请求中提取令牌
 */
export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * 密码哈希
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * 密码比较
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * 根据手机号查询用户
 * @param mobile 手机号
 */
async function getUserByMobile(mobile: string): Promise<UserExtended | null> {
  try {
    const user = await ezClient.queryGetFirstOne({
      name: 'user',
      args: {
        where: {
          mobile: { _eq: mobile }
        }
      },
      fields: ['id', 'mobile', 'nickname', 'password', 'created_at', 'updated_at', 'avatar_url', 'bio']
    });
    
    return user || null;
  } catch (error) {
    console.error('获取用户失败:', error);
    return null;
  }
}

/**
 * 创建新用户
 * @param userData 用户数据
 */
async function createUser(userData: Partial<UserExtended>): Promise<UserExtended | null> {
  try {
    const now = new Date().toISOString();
    const newUser = await ezClient.mutationGetFirstOne({
      name: 'insert_user',
      args: {
        objects: [{
          ...userData
        }]
      },
      returning_fields: ['id', 'mobile', 'nickname', 'created_at', 'updated_at', 'avatar_url', 'bio']
    });
    
    return newUser || null;
  } catch (error) {
    console.error('创建用户失败:', error);
    return null;
  }
}

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param userData 要更新的用户数据
 */
async function updateUser(userId: ID, userData: Partial<UserExtended>): Promise<boolean> {
  try {
    await ezClient.mutationGetFirstOne({
      name: 'update_user',
      args: {
        where: {
          id: { _eq: userId }
        },
        _set: {
          ...userData,
          updated_at: new Date().toISOString()
        }
      },
      returning_fields: ['affected_rows']
    });
    
    return true;
  } catch (error) {
    console.error('更新用户失败:', error);
    return false;
  }
}

/**
 * 发送验证码
 */
export async function sendVerificationCode(mobile: string, type: 'login' | 'register' | 'resetPassword') {
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(mobile)) {
    throw new Error('请输入正确的手机号');
  }

  // 生成6位随机验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date();
  
  // 存储验证码（实际项目中应该使用Redis）
  const key = `verification:${type}:${mobile}`;
  verificationCodes.set(key, {
    code,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + VERIFICATION_CODE_EXPIRY * 1000).toISOString()
  });
  
  // 实际项目中，这里应该调用SMS服务发送真实短信
  console.log(`发送验证码到 ${mobile}: ${code}, 用途: ${type}`);
  
  // 模拟发送延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    // 在开发环境下返回验证码，方便测试
    code: process.env.NODE_ENV !== 'production' ? code : undefined
  };
}

/**
 * 验证验证码
 */
export async function verifyCode(mobile: string, code: string, type: 'login' | 'register' | 'resetPassword'): Promise<boolean> {
  const key = `verification:${type}:${mobile}`;
  const record = verificationCodes.get(key);
  
  if (!record) {
    return false;
  }
  
  // 检查是否过期
  if (new Date() > new Date(record.expiresAt)) {
    verificationCodes.delete(key);
    return false;
  }
  
  // 验证码比对
  const isValid = record.code === code;
  
  // 使用后删除验证码，防止重复使用
  if (isValid) {
    verificationCodes.delete(key);
  }
  
  return isValid;
}

/**
 * 使用验证码登录
 */
export async function loginWithCode(mobile: string, code: string) {
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(mobile)) {
    throw new Error('请输入正确的手机号');
  }
  
  // 验证码必须是6位数字
  if (!/^\d{6}$/.test(code)) {
    throw new Error('验证码格式错误');
  }
  
  // 验证验证码
  const isCodeValid = await verifyCode(mobile, code, 'login');
  if (!isCodeValid) {
    throw new Error('验证码错误或已过期');
  }
  
  // 查找用户
  let user = await getUserByMobile(mobile);
  let isNewUser = false;
  
  // 用户不存在，自动注册
  if (!user) {
    isNewUser = true;
    const newUser = await createUser({
      mobile,
      nickname: `用户${mobile.substring(mobile.length - 4)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    
    if (!newUser) {
      throw new Error('注册失败，请稍后重试');
    }
    
    user = newUser;
    
    // 为新用户分配默认站点
    const defaultSite = await getDefaultSite();
    if (defaultSite && user.id) {
      await updateUserCurrentSite(user.id as ID, defaultSite.id as ID);
    }
  }
  
  // 更新最后登录时间
  await updateUser(user.id as ID, { last_login_at: new Date().toISOString() });
  
  // 获取用户当前站点
  const currentSite = user.id ? await getUserCurrentSite(user.id as ID) : null;
  
  // 生成JWT令牌
  const token = generateToken({
    id: user.id as ID,
    mobile: user.mobile || '',
    nickname: user.nickname || '',
    role: 'user', // 默认角色
    current_site_id: currentSite?.id as ID || null
  });
  
  return {
    token,
    user: {
      id: user.id,
      mobile: user.mobile,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
      bio: user.bio,
      isNewUser,
      current_site: currentSite
    }
  };
}

/**
 * 使用密码登录
 */
export async function loginWithPassword(mobile: string, password: string) {
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(mobile)) {
    throw new Error('请输入正确的手机号');
  }
  
  // 查找用户
  const user = await getUserByMobile(mobile);
  if (!user || !user.password) {
    throw new Error('手机号或密码错误');
  }
  
  // 验证密码
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('手机号或密码错误');
  }
  
  // 更新最后登录时间
  await updateUser(user.id as ID, { last_login_at: new Date().toISOString() });
  
  // 获取用户当前站点
  const currentSite = user.id ? await getUserCurrentSite(user.id as ID) : null;
  
  // 生成JWT令牌
  const token = generateToken({
    id: user.id as ID,
    mobile: user.mobile || '',
    nickname: user.nickname || '',
    role: 'user', // 默认角色
    current_site_id: currentSite?.id as ID || null
  });
  
  return {
    token,
    user: {
      id: user.id,
      mobile: user.mobile,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
      bio: user.bio,
      current_site: currentSite
    }
  };
}

/**
 * 用户注册
 */
export async function register(mobile: string, password: string, code: string, nickname?: string) {
  // 验证请求数据
  if (!/^1[3-9]\d{9}$/.test(mobile)) {
    throw new Error('请输入正确的手机号');
  }
  
  if (!password || password.length < 6) {
    throw new Error('密码长度不能少于6位');
  }
  
  if (!/^\d{6}$/.test(code)) {
    throw new Error('验证码格式错误');
  }
  
  // 验证验证码
  const isCodeValid = await verifyCode(mobile, code, 'register');
  if (!isCodeValid) {
    throw new Error('验证码错误或已过期');
  }
  
  // 检查手机号是否已注册
  const existingUser = await getUserByMobile(mobile);
  if (existingUser) {
    throw new Error('该手机号已注册');
  }
  
  // 创建新用户
  const hashedPassword = await hashPassword(password);
  const user = await createUser({
    mobile,
    nickname: nickname || `用户${mobile.substring(mobile.length - 4)}`,
    password: hashedPassword,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login_at: new Date().toISOString(),
  });
  
  if (!user) {
    throw new Error('注册失败，请稍后重试');
  }
  
  // 为新用户分配默认站点
  const defaultSite = await getDefaultSite();
  if (defaultSite && user.id) {
    await updateUserCurrentSite(user.id as ID, defaultSite.id as ID);
  }
  
  // 生成JWT令牌
  const token = generateToken({
    id: user.id as ID,
    mobile: user.mobile || '',
    nickname: user.nickname || '',
    role: 'user'
  });
  
  return {
    token,
    user: {
      id: user.id,
      mobile: user.mobile,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
      bio: user.bio,
    }
  };
}

/**
 * 重置密码
 */
export async function resetPassword(mobile: string, newPassword: string, code: string) {
  // 验证请求数据
  if (!/^1[3-9]\d{9}$/.test(mobile)) {
    throw new Error('请输入正确的手机号');
  }
  
  if (!newPassword || newPassword.length < 6) {
    throw new Error('密码长度不能少于6位');
  }
  
  if (!/^\d{6}$/.test(code)) {
    throw new Error('验证码格式错误');
  }
  
  // 验证验证码
  const isCodeValid = await verifyCode(mobile, code, 'resetPassword');
  if (!isCodeValid) {
    throw new Error('验证码错误或已过期');
  }
  
  // 查找用户
  const user = await getUserByMobile(mobile);
  if (!user) {
    throw new Error('用户不存在');
  }
  
  // 更新密码
  const hashedPassword = await hashPassword(newPassword);
  const success = await updateUser(user.id as ID, {
    password: hashedPassword,
    updated_at: new Date().toISOString()
  });
  
  if (!success) {
    throw new Error('重置密码失败，请稍后重试');
  }
  
  return { success: true };
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(token: string) {
  const payload = verifyToken(token);
  if (!payload) {
    throw new Error('无效的token');
  }
  
  try {
    const user = await ezClient.queryGetFirstOne({
      name: 'user',
      args: {
        where: {
          id: { _eq: payload.id }
        }
      },
      fields: ['id', 'mobile', 'nickname', 'created_at', 'updated_at', 'avatar_url', 'bio']
    });
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 获取用户当前站点
    const currentSite = user.id ? await getUserCurrentSite(user.id as ID) : null;
    
    return {
      id: user.id,
      mobile: user.mobile,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
      bio: user.bio,
      role: 'user', // 默认角色
      current_site: currentSite
    };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw new Error('获取用户信息失败');
  }
}

/**
 * 更新用户信息
 */
export async function updateUserProfile(userId: ID, data: { nickname?: string; avatar_url?: string; bio?: string }) {
  try {
    const success = await updateUser(userId, {
      ...data,
      updated_at: new Date().toISOString()
    });
    
    if (!success) {
      throw new Error('更新用户信息失败');
    }
    
    // 获取更新后的用户信息
    const user = await ezClient.queryGetFirstOne({
      name: 'user',
      args: {
        where: {
          id: { _eq: userId }
        }
      },
      fields: ['id', 'mobile', 'nickname', 'avatar_url', 'bio']
    });
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 获取用户当前站点
    const currentSite = user.id ? await getUserCurrentSite(user.id as ID) : null;
    
    return {
      id: user.id,
      mobile: user.mobile,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
      bio: user.bio,
      current_site: currentSite
    };
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw new Error('更新用户信息失败');
  }
}

/**
 * 修改密码
 */
export async function changePassword(userId: ID, oldPassword: string, newPassword: string) {
  // 验证新密码
  if (!newPassword || newPassword.length < 6) {
    throw new Error('新密码长度不能少于6位');
  }
  
  try {
    // 查找用户
    const user = await ezClient.queryGetFirstOne({
      name: 'user',
      args: {
        where: {
          id: { _eq: userId }
        }
      },
      fields: ['id', 'password']
    });
    
    if (!user || !user.password) {
      throw new Error('用户不存在或未设置密码');
    }
    
    // 验证旧密码
    const isOldPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new Error('原密码错误');
    }
    
    // 更新密码
    const hashedPassword = await hashPassword(newPassword);
    const success = await updateUser(userId, {
      password: hashedPassword,
      updated_at: new Date().toISOString()
    });
    
    if (!success) {
      throw new Error('修改密码失败');
    }
    
    return { success: true };
  } catch (error) {
    console.error('修改密码失败:', error);
    throw new Error(error instanceof Error ? error.message : '修改密码失败');
  }
}

/**
 * 退出登录（客户端操作，服务端不需要处理）
 */
export function logout() {
  // 客户端应删除token和用户信息
  return { success: true };
}
