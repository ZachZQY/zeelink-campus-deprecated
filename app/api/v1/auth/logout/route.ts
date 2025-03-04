import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse } from '@/lib/utils/response';
import { logout } from '@/lib/services/auth';

/**
 * 退出登录接口
 * 清除客户端 token 并重定向到登录页面
 */
export async function POST(request: NextRequest) {
    try {
        // 调用退出登录服务
        const result = await logout();

        // 返回成功响应，客户端收到后应清除 token
        return createSuccessResponse(result, '已退出登录');
    } catch (error) {
        console.error('退出登录异常:', error);
        // 即使出错，我们也返回成功并重定向到登录页
        return createSuccessResponse({
            success: false
        }, '异常退出');
    }
}

// GET 方法也支持
export async function GET(request: NextRequest) {
    // 直接调用 POST 方法处理
    return POST(request);
}
