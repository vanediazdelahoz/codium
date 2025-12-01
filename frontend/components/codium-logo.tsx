import Link from "next/link"

export function CodiumLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/dashboard">
      <div className={`flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${className}`}>
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 rounded-xl bg-primary opacity-20 blur-sm" />
          <div className="relative">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 3L4 7L8 11M16 3L20 7L16 11M12 4V20M4 13L8 17L4 21M20 13L16 17L20 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              />
            </svg>
          </div>
        </div>
        <span className="text-2xl font-bold text-foreground">Codium</span>
      </div>
    </Link>
  )
}
