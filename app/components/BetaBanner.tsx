import Link from 'next/link'

export default function BetaBanner() {
  return (
    <div className="w-full bg-[#00b8d9]/10 border-b border-[#00b8d9]/30 py-2 px-4 text-center text-sm">
      🧪 BSCPro is momenteel in bèta – <a href="/contact" className="underline text-[#00b8d9] ml-1">Feedback welkom</a>
    </div>
  )
}
