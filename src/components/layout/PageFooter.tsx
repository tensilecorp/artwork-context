import Link from 'next/link'

export default function PageFooter() {
  return (
    <footer className="border-t border-border/40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-display text-lg text-foreground">ArtView Pro</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Professional Artwork Visualization
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <Link
              href="/examples"
              className="text-[12px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Gallery
            </Link>
            <Link
              href="/contact"
              className="text-[12px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Contact
            </Link>
            <Link
              href="/disclaimer"
              className="text-[12px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Legal
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40">
          <p className="text-[11px] text-muted-foreground tracking-wide">
            © {new Date().getFullYear()} ArtView Pro. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
