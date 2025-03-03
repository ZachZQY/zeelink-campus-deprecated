import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 用于检查用户身份的函数
function isAdmin(request: NextRequest) {
  // 实际项目中，你可能会从cookies或headers中获取用户的token和权限信息
  // 这里使用简化的检查方式
  const cookie = request.cookies.get('auth');
  return cookie?.value?.includes('admin');
}

// 中间件函数
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 处理根路径，将用户重定向到适当的入口
  if (pathname === '/') {
    // 检查用户是否为管理员
    if (isAdmin(request)) {
      // 管理员用户重定向到管理端
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      // 普通用户重定向到客户端
      return NextResponse.redirect(new URL('/client', request.url));
    }
  }
  
  // 处理管理端访问权限控制
  if (pathname.startsWith('/admin') && !isAdmin(request)) {
    // 非管理员尝试访问管理端页面，重定向到登录页
    return NextResponse.redirect(new URL('/client/login?returnUrl=' + encodeURIComponent(pathname), request.url));
  }
  
  // 当不需要重定向时，直接继续处理请求
  return NextResponse.next();
}

// 配置中间件应该在哪些路径上运行
export const config = {
  // 匹配所有路径
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
