import bcrypt from 'bcryptjs';

/**
 * 密码加密
 * @param password 明文密码
 * @returns 加密后的密码
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * 密码比较
 * @param plainPassword 明文密码
 * @param hashedPassword 加密密码
 * @returns 是否匹配
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  // 如果数据库中没有保存密码，直接返回false
  if (!hashedPassword) return false;
  
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * 生成随机密码
 * @param length 密码长度，默认为8
 * @returns 随机生成的密码
 */
export function generateRandomPassword(length: number = 8): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}
