import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact ArtView Pro – Support & Refund Requests',
  description: 'Get in touch with ArtView Pro. Request a refund, suggest a feature, or ask a question. We respond within 24 hours.',
  alternates: { canonical: '/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
