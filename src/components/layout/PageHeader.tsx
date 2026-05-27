'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface PageHeaderProps {
  /** Show a "Back" link on the left */
  showBack?: boolean
  /** Right-side slot — defaults to "Begin" CTA */
  rightSlot?: React.ReactNode
  /** Extra content beside credit count etc. */
  children?: React.ReactNode
}

export default function PageHeader({ showBack = false, rightSlot, children }: PageHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-[72px]">
          <div className="flex items-center gap-6">
            {showBack && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="ArtView Pro" width={120} height={40} className="h-6 w-auto" />
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {children}
            {rightSlot !== undefined ? (
              rightSlot
            ) : (
              <Link
                href="/upload?trial=true"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] uppercase tracking-[0.15em] font-medium text-foreground border border-foreground hover:border-primary hover:text-primary transition-colors duration-300"
              >
                Try Free
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
