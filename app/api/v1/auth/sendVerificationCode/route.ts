import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendSmsCode } from "@/lib/tools/sms";

// 验证码类型
type CodeType = 'login' | 'register' | 'resetPassword';

// 定义请求体验证模式
const sendCodeSchema = z.object({
  mobile: z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号"),
  type: z.enum(["login", "register", "resetPassword"]).default("login")
});

export async function POST(req: NextRequest) {
  try {
    // 解析请求体
    const body = await req.json();
    
    // 验证请求体
    const validationResult = sendCodeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        code: 400,
        message: validationResult.error.errors[0].message,
      }, { status: 400 });
    }
    
    const { mobile, type } = validationResult.data;
    
    // 生成随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 获取验证码模板
    let templateId = '';
    switch (type as CodeType) {
      case 'login':
        templateId = 'SMS_123456789'; // 登录验证码模板ID
        break;
      case 'register':
        templateId = 'SMS_123456788'; // 注册验证码模板ID
        break;
      case 'resetPassword':
        templateId = 'SMS_123456787'; // 密码重置验证码模板ID
        break;
      default:
        templateId = 'SMS_123456789'; // 默认使用登录验证码模板
    }
    
    // 保存验证码到缓存/数据库
    // TODO: 实现验证码的持久化存储
    // 这里可以使用 Redis 或直接存储到数据库
    
    // 发送短信验证码
    await sendSmsCode({
      mobile,
      templateId,
      params: {
        code,
        expireMinutes: '5' // 验证码5分钟有效
      }
    });
    
    return NextResponse.json({
      code: 0,
      message: "验证码发送成功",
      data: {
        // 在生产环境中不应该返回验证码
        // 这里为了开发测试方便，可以返回生成的验证码
        code: process.env.NODE_ENV === 'development' ? code : undefined
      }
    });
    
  } catch (error) {
    console.error('发送验证码失败:', error);
    return NextResponse.json({
      code: 500,
      message: "发送验证码失败，请稍后重试",
    }, { status: 500 });
  }
}
