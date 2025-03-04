import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Users as User, ID } from '@/dataModel/types';
import { ezClient } from '../tools/ezclient';

// 配置项
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';
const VERIFICATION_CODE_EXPIRY = 5 * 60; // 5分钟，单位：秒
const USER_RESPONSE_FIELDS = ['id', 'mobile', 'nickname', 'created_at', 'updated_at', 'avatar_url', 'bio',
  {
    name: "roles",
    fields: "name"
  },
  {
    name: "current_site",
    fields: ["id", "name"]
  }
]

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
function generateToken(payload: User): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 验证JWT令牌
 */
function verifyToken(token: string): User | null {
  return jwt.verify(token, JWT_SECRET) as User;
}

/**
 * 从请求中提取令牌
 */
function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * 密码哈希
 */
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * 密码比对
 */
async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}


/**
 * 根据手机号查询用户
 * @param mobile 手机号
 */
async function getUserByMobile(mobile: string): Promise<User | null> {
  return ezClient.queryGetFirstOne({
    name: 'users',
    args: {
      where: {
        mobile: { _eq: mobile }
      }
    },
    fields: ['id', 'mobile', 'nickname', 'password', 'created_at', 'updated_at', 'avatar_url', 'bio']
  });
}

/**
 * 创建新用户
 * @param userData 用户数据
 */
async function createUser(userData: Partial<User>): Promise<User
  | null> {
  return ezClient.mutationGetFirstOne({
    name: 'insert_users',
    args: {
      objects: [{
        ...userData
      }]
    },
    returning_fields: USER_RESPONSE_FIELDS
  });

}
/**
 * 更新用户
 * @param userData 用户数据
 */
async function updateUser(userId: ID, userData: Partial<User>): Promise<User
  | null> {
  return ezClient.mutationGetFirstOne({
    name: 'update_users',
    args: {
      where: {
        id: {
          _eq: userId
        }
      },
      _set: {
        ...userData
      }
    },
    returning_fields: USER_RESPONSE_FIELDS
  });
}



/**
 * 验证验证码
 */
async function verifyCode(mobile: string, code: string, type: 'login' | 'resetPassword'): Promise<boolean> {
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
 * 从请求中提取用户
 */
function getUserFromRequest(req: NextRequest): User {
  const token = getTokenFromRequest(req);
  if (!token) {
    throw new Error('请先登录');
  }
  const userPayload = verifyToken(token);
  if (!userPayload) {
    throw new Error('TOKEN错误');
  }
  return userPayload;
}


/**
 * 使用验证码登录
 */
async function loginWithCode(mobile: string, code: string): Promise<{ token: string, user: User, isNewUser: boolean }> {
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
      nickname: `用户${mobile.substring(mobile.length - 4)}`
    });

    if (!newUser) {
      throw new Error('注册失败，请稍后重试');
    }
    user = newUser;
  }

  // 生成JWT令牌
  const token = generateToken(user);

  return {
    token,
    user: user,
    isNewUser
  };
}

/**
 * 使用密码登录
 */
async function loginWithPassword(mobile: string, password: string): Promise<{ token: string, user: User }> {
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

  // 生成JWT令牌
  const token = generateToken(user);

  return {
    token,
    user
  };
}

/**
 * 重置密码
 */
async function resetPassword(mobile: string, newPassword: string, code: string): Promise<User> {
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
  let user = await getUserByMobile(mobile);
  if (!user) {
    throw new Error('用户不存在');
  }

  // 更新密码
  const hashedPassword = await hashPassword(newPassword);
  user = await updateUser(user.id as ID, {
    password: hashedPassword
  });
  if (!user) {
    throw new Error('重置密码失败，请稍后重试');
  }
  return user;
}


/**
 * 退出登录（客户端操作，服务端不需要处理）
 */
async function logout(): Promise<{ success: boolean }> {
  // 客户端应删除token和用户信息
  return {
    success: true
  }
}

/**
 * 发送验证码
 */
async function sendVerificationCode(mobile: string, type: 'login' | 'resetPassword') {
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

export {
  getUserFromRequest,
  loginWithCode,
  loginWithPassword,
  resetPassword,
  sendVerificationCode,
  logout
}