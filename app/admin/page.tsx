import { redirect } from 'next/navigation';

export default function AdminRedirect() {
  // 重定向到真正的管理端首页
  redirect('/admin/index');
}
