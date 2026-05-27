import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import PageHeader from '@/components/layout/PageHeader'
import PageFooter from '@/components/layout/PageFooter'

export const metadata: Metadata = {
  title: 'AI Art Gallery Mockup Examples & Visualization Samples – ArtView Pro',
  description: 'Browse real AI art gallery mockup examples. See paintings, sculptures, and mixed media placed in living rooms, galleries, offices, and hotels. 30-second results.',
  keywords: 'AI art gallery mockup examples, artwork visualization samples, art placement examples, gallery mockup showcase, painting in room mockup, art wall mockup',
  alternates: { canonical: '/examples' },
  openGraph: {
    title: 'AI Art Gallery Mockup Examples – ArtView Pro',
    description: 'Real AI-generated artwork visualizations across living rooms, galleries, offices, and hotels. See what ArtView Pro creates in 30 seconds.',
    url: 'https://www.artviewpro.com/examples',
    type: 'website',
  },
}

const featuredExamples = [
  {
    original: '/front-gallery-original-01.jpeg',
    placed: '/front-gallery-result-01-living.jpeg',
    environment: 'Living Room',
    title: 'Contemporary Painting in Living Room',
    headline: 'Show collectors how your art transforms a home',
    body: 'Buyers don\'t just want art — they want to imagine it on their walls. This AI gallery mockup places your painting in a warm, designer living room with natural light and curated furniture, making it instantly easy to visualise ownership. Ideal for artists selling online, at fairs, or through Instagram.',
    altOriginal: 'Original contemporary painting before AI gallery mockup',
    altPlaced: 'Contemporary painting displayed in living room — AI art placement mockup by ArtView Pro',
    tags: ['Living room', 'Residential', 'Natural light'],
  },
  {
    original: '/front-gallery-original-01.jpeg',
    placed: '/front-gallery-result-01-gallery.jpeg',
    environment: 'Art Gallery',
    title: 'Professional Gallery Wall Mockup',
    headline: 'Create a gallery-ready portfolio in minutes',
    body: 'Gallery submissions, exhibition proposals, and press kits all need professional presentation. This AI art gallery mockup gives your work a clean white-wall treatment with precise lighting — the same look you\'d spend a day of studio hire to photograph. Use it for open calls, grant applications, or your artist website.',
    altOriginal: 'Original artwork before AI gallery wall mockup',
    altPlaced: 'Painting displayed on gallery wall with professional lighting — AI gallery mockup by ArtView Pro',
    tags: ['White cube', 'Exhibition', 'Professional'],
  },
  {
    original: '/front-gallery-original-02.jpeg',
    placed: '/front-gallery-result-02-office.jpeg',
    environment: 'Corporate Office',
    title: 'Artwork in Corporate Office Setting',
    headline: 'Win corporate commissions and hospitality clients',
    body: 'Corporate art buyers and interior designers need to pitch artwork to stakeholders before committing. This office placement mockup lets you — or your gallery — show exactly how a piece commands a boardroom or reception wall. Dramatically increases conversion for large-scale commission enquiries.',
    altOriginal: 'Original artwork before corporate office placement mockup',
    altPlaced: 'Large artwork displayed in modern corporate office — AI art placement by ArtView Pro',
    tags: ['Corporate', 'Office', 'Large format'],
  },
  {
    original: '/front-gallery-original-02.jpeg',
    placed: '/front-gallery-result-02-gallery.jpeg',
    environment: 'Modern Gallery',
    title: 'Minimalist Gallery Space Visualization',
    headline: 'Pitch your exhibition before you build it',
    body: 'Planning a solo show or group exhibition? AI gallery mockups let you visualise exactly how each piece will look in a minimalist gallery context — spacing, scale, and lighting — before a single work is shipped. Share the deck with co-curators, venue directors, or sponsors to get faster sign-off.',
    altOriginal: 'Original painting before AI gallery visualization',
    altPlaced: 'Artwork in minimalist gallery space — professional AI gallery mockup by ArtView Pro',
    tags: ['Minimalist', 'Solo show', 'Curation'],
  },
]

const allEnvironments = [
  { name: 'Living Room', description: 'Warm residential settings for collector outreach' },
  { name: 'Modern Gallery', description: 'White cube for submissions and press kits' },
  { name: 'Corporate Office', description: 'Boardrooms and reception spaces for commissions' },
  { name: 'Hotel Lobby', description: 'Hospitality interiors for licensing pitches' },
  { name: 'Dining Room', description: 'Intimate domestic settings for smaller works' },
  { name: 'Bedroom', description: 'Personal spaces for lifestyle-driven sales' },
  { name: 'Outdoor / Garden', description: 'Sculpture and large-format placement' },
  { name: 'Museum Hall', description: 'Institutional-scale exhibition planning' },
]

const steps = [
  {
    number: '01',
    title: 'Upload your artwork photo',
    body: 'A clear JPEG or PNG of your painting, print, sculpture, or mixed media. No studio setup needed — a well-lit phone photo is enough.',
  },
  {
    number: '02',
    title: 'AI places it in real environments',
    body: 'Our model composites your artwork into professionally designed room scenes, matching scale, perspective, and lighting automatically.',
  },
  {
    number: '03',
    title: 'Download your gallery mockups',
    body: 'Get 10 high-resolution visualizations across multiple environments in under 30 seconds. Use them on your website, social media, or in proposals.',
  },
]

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <PageHeader />

      <main>
        {/* Hero */}
        <section className="py-16 md:py-20 text-center px-4">
          <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase mb-4">
            AI Art Visualization Samples
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 max-w-4xl mx-auto leading-tight">
            AI Art Gallery Mockup Examples
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Real results created by ArtView Pro — paintings and artworks placed in living rooms, galleries, corporate offices, and more. Each mockup generated in under 30 seconds.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Try with Your Artwork
          </Link>
        </section>

        {/* Featured examples — alternating layout */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-24">
          {featuredExamples.map((ex, i) => (
            <article
              key={ex.title}
              className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/40 shadow-md">
                  <Image
                    src={ex.placed}
                    alt={ex.altPlaced}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Thumbnail */}
                  <div className="absolute top-3 left-3 w-16 h-16 rounded-md overflow-hidden border border-white/60 shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300 bg-white p-0.5">
                    <Image
                      src={ex.original}
                      alt={ex.altOriginal}
                      fill
                      className="object-cover rounded"
                      sizes="64px"
                    />
                  </div>
                  <span className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2.5 py-1 rounded-full border border-border/40">
                    {ex.environment}
                  </span>
                </div>
              </div>

              {/* Copy */}
              <div className="w-full lg:w-1/2 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {ex.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium bg-muted/60 text-muted-foreground px-3 py-1 rounded-full border border-border/40">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  {ex.headline}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {ex.body}
                </p>
                <Link
                  href="/upload"
                  className="inline-flex items-center text-primary font-semibold hover:underline underline-offset-4 pt-2"
                >
                  Create a {ex.environment} mockup →
                </Link>
              </div>
            </article>
          ))}
        </section>

        {/* All environments */}
        <section className="bg-muted/20 border-y border-border/40 py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
                8 Gallery Environments Included
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every pack gives you 10 visualizations spanning multiple environments — so you always have the right mockup for each audience.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {allEnvironments.map(env => (
                <div key={env.name} className="bg-background rounded-lg border border-border/40 p-5 hover:shadow-sm transition-shadow">
                  <p className="font-semibold text-foreground mb-1">{env.name}</p>
                  <p className="text-sm text-muted-foreground">{env.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
                How ArtView Pro Creates These Mockups
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                No Photoshop skills, no studio, no lengthy briefing process. AI handles the composition automatically.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map(step => (
                <div key={step.number} className="text-center space-y-3">
                  <span className="font-display text-5xl font-light text-primary/30">{step.number}</span>
                  <h3 className="font-semibold text-foreground text-lg">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-muted/20 border-t border-border/40 py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Ready to create your own gallery mockups?
            </h2>
            <p className="text-muted-foreground mb-8">
              10 professional AI artwork visualizations, delivered in under 30 seconds. One-time payment, no subscription.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Creating — $5 Launch Special
            </Link>
            <p className="text-sm text-muted-foreground mt-4">14-day money-back guarantee · No account needed</p>
          </div>
        </section>
      </main>

      <PageFooter />
    </div>
  )
}
