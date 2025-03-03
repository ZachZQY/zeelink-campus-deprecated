import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">校园社区平台</h1>
          <p className="text-xl mb-8">连接校园生活，分享学习经验</p>
          
          <div className="flex gap-6 justify-center">
            <Link href="/client" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
              进入用户端
            </Link>
            <Link href="/admin" className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg">
              进入管理端
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
