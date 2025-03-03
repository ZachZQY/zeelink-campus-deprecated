import { sendSMS } from '../tools/sms';

/**
 * 短信验证码场景枚举
 */
export enum SmsSceneType {
  LOGIN = 'login',
  REGISTER = 'register',
  RESET_PASSWORD = 'reset_password',
  CHANGE_PHONE = 'change_phone',
  VERIFY_IDENTITY = 'verify_identity',
}

/**
 * 生成验证码
 * @param length 验证码长度
 * @returns 生成的验证码
 */
export function generateVerificationCode(length = 6): string {
  return Math.random().toString().substring(2, 2 + length);
}

/**
 * 验证码缓存，生产环境应使用Redis等持久化存储
 * 格式: { mobile_scene: { code, timestamp } }
 */
const codeCache: Record<string, { code: string; timestamp: number }> = {};

/**
 * 发送场景验证码短信
 * @param mobile 手机号
 * @param scene 短信场景
 * @returns 是否发送成功
 */
export async function sendSmsSceneCode(mobile: string, scene: SmsSceneType): Promise<{ success: boolean; message: string }> {
  // 生成验证码
  const code = generateVerificationCode();
  
  // 构建短信内容
  let content = '';
  switch (scene) {
    case SmsSceneType.LOGIN:
      content = `【Zeelink】您的登录验证码是: ${code}, 有效期5分钟, 请勿泄露给他人`;
      break;
    case SmsSceneType.REGISTER:
      content = `【Zeelink】您的注册验证码是: ${code}, 有效期5分钟, 请勿泄露给他人`;
      break;
    case SmsSceneType.RESET_PASSWORD:
      content = `【Zeelink】您的重置密码验证码是: ${code}, 有效期5分钟, 请勿泄露给他人`;
      break;
    default:
      content = `【Zeelink】您的验证码是: ${code}, 有效期5分钟, 请勿泄露给他人`;
  }
  
  try {
    // 发送短信
    const result = await sendSMS({ mobile, content });
    
    if (result.success) {
      // 缓存验证码
      const cacheKey = `${mobile}_${scene}`;
      codeCache[cacheKey] = {
        code,
        timestamp: Date.now()
      };
      
      return { success: true, message: '验证码已发送' };
    } else {
      return { success: false, message: result.message || '短信发送失败' };
    }
  } catch (error) {
    console.error('发送验证码失败:', error);
    return { success: false, message: '短信服务异常' };
  }
}

/**
 * 验证场景验证码
 * @param mobile 手机号
 * @param scene 短信场景
 * @param code 用户输入的验证码
 * @returns 验证结果
 */
export function verifySmsSceneCode(mobile: string, scene: SmsSceneType, code: string): { success: boolean; message: string } {
  const cacheKey = `${mobile}_${scene}`;
  const cachedData = codeCache[cacheKey];
  
  // 验证码不存在
  if (!cachedData) {
    return { success: false, message: '验证码已过期或不存在' };
  }
  
  // 验证码过期（5分钟）
  const expirationTime = 5 * 60 * 1000; // 5分钟
  if (Date.now() - cachedData.timestamp > expirationTime) {
    // 删除过期验证码
    delete codeCache[cacheKey];
    return { success: false, message: '验证码已过期' };
  }
  
  // 验证码不匹配
  if (cachedData.code !== code) {
    return { success: false, message: '验证码错误' };
  }
  
  // 验证成功后删除验证码，防止重复使用
  delete codeCache[cacheKey];
  
  return { success: true, message: '验证成功' };
}
