import { redirect } from 'next/navigation';

export default function ClientRedirect() {
  // 重定向到真正的客户端首页
  redirect('/client/home');
}
