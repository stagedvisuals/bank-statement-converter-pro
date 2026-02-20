import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-4">Bank Statement Converter Pro</h1>
      <p className="text-gray-400 mb-8">By Artur Bagdasarjan</p>
      <div className="space-x-4">
        <Link href="/login" className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700">
          Login
        </Link>
        <Link href="/register" className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700">
          Register
        </Link>
      </div>
    </div>
  )
}
