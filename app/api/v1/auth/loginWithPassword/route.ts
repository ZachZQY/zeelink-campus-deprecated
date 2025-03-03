import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserByMobile } from "@/lib/service/user";
import { comparePassword } from "@/lib/tools/password";
import { sign } from "@/lib/tools/jwt";

// 定义请求体验证模式
const loginSchema = z.object({
  mobile: z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号"),
  password: z.string().min(1, "请输入密码")
});

export async function POST(req: NextRequest) {
  try {
    // 解析请求体
    const body = await req.json();
    
    // 验证请求体
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        code: 400,
        message: validationResult.error.errors[0].message,
      }, { status: 400 });
    }
    
    const { mobile, password } = validationResult.data;
    
    // 查询用户
    const user = await getUserByMobile(mobile);
    
    // 用户不存在
    if (!user) {
      return NextResponse.json({
        code: 401,
        message: "手机号或密码错误",
      }, { status: 401 });
    }
    
    // 验证密码
    const isPasswordValid = await comparePassword(password, user.password);
    
    // 密码无效
    if (!isPasswordValid) {
      return NextResponse.json({
        code: 401,
        message: "手机号或密码错误",
      }, { status: 401 });
    }
    
    // 生成 JWT token
    const token = await sign({
      userId: user.id,
      mobile: user.mobile
    });
    
    // 设置 Cookie
    const response = NextResponse.json({
      code: 0,
      message: "登录成功",
      data: {
        user: {
          id: user.id,
          mobile: user.mobile,
          nickname: user.nickname,
          avatar: user.avatar,
          created_at: user.created_at
        }
      }
    });
    
    // 设置 HTTP-only cookie 用于认证
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // 设置过期时间为7天
      maxAge: 60 * 60 * 24 * 7
    });
    
    return response;
    
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json({
      code: 500,
      message: "登录失败，请稍后重试",
    }, { status: 500 });
  }
}
