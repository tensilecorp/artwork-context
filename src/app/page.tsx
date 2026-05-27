'use client'

import { ArrowRight, Shield, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { fade, slideUp } from '@/constants/animations'
import FreeTrialPopup, { useFreeTrialPopup } from '@/components/FreeTrialPopup'
import Toast, { useToast } from '@/components/Toast'
import PageHeader from '@/components/layout/PageHeader'
import PageFooter from '@/components/layout/PageFooter'

const beforeAfterPairs = [
  {
    before: "/front-gallery-original-01.jpeg",
    after: "/front-gallery-result-01-gallery.jpeg",
    label: "Gallery Setting",
  },
  {
    before: "/front-gallery-original-02.jpeg",
    after: "/front-gallery-result-02-office.jpeg",
    label: "Corporate Office",
  },
  {
    before: "/front-gallery-original-01.jpeg",
    after: "/front-gallery-result-01-living.jpeg",
    label: "Living Room",
  },
  {
    before: "/front-gallery-original-02.jpeg",
    after: "/front-gallery-result-02-gallery.jpeg",
    label: "Modern Gallery",
  },
]

const faqs = [
  {
    q: "Does it work for sculpture and 3D works?",
    a: "Yes. Any artwork with a clear photo works well — paintings, prints, sculptures, ceramics, textile pieces, and mixed media all produce strong results. The AI reads the shape and scale from your photo automatically.",
  },
  {
    q: "What if my photo isn't professionally taken?",
    a: "A well-lit smartphone photo is all you need. Our AI handles perspective, scale, and lighting correction automatically. Avoid harsh shadows directly on the artwork surface for best results.",
  },
  {
    q: "Can I use the visualizations commercially?",
    a: "Yes — full commercial rights are included with every session. Use the images on your website, Instagram, in gallery submissions, client proposals, or for print sales. No attribution required.",
  },
  {
    q: "What file formats do you accept?",
    a: "JPEG, PNG, WebP, and HEIC (iPhone). Files up to 20 MB. For very large canvases, a cropped detail photo often produces cleaner results than a wide-angle shot.",
  },
  {
    q: "How long does processing take?",
    a: "Under 30 seconds for all 10 visualizations. You'll see a progress indicator while the AI works — no waiting around.",
  },
  {
    q: "What happens to my artwork image after processing?",
    a: "Original images are automatically deleted after 7 days. Generated visualizations are removed after 30 days. You can request immediate deletion at any time by contacting us. We're GDPR compliant and founded in the Netherlands.",
  },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-0 divide-y divide-border/40">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left group"
          >
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
              {faq.q}
            </span>
            {open === i
              ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-4" />
              : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-4" />
            }
          </button>
          {open === i && (
            <p className="pb-5 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {faq.a}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const { isOpen, closePopup, handleEmailSubmit } = useFreeTrialPopup()
  const { toast, showToast, hideToast } = useToast()

  const handleEmailSubmitWithToast = async (email: string) => {
    try {
      await handleEmailSubmit(email)
      showToast('Account created. You have 3 complimentary visualizations.', 'success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      showToast(message, 'error')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* Hero */}
      <section className="pt-[72px]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 md:py-16 lg:py-20">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            >
              <motion.h1
                variants={fade}
                custom={0}
                className="font-display text-[clamp(2.5rem,5vw,5rem)] font-normal leading-[1.05] tracking-[-0.02em] text-foreground"
              >
                Your artwork,
                <br />
                placed in galleries,
                <br />
                <em className="italic">homes, and offices.</em>
              </motion.h1>

              <motion.p
                variants={fade}
                custom={1}
                className="mt-6 text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
              >
                Upload your painting or sculpture and receive 10 professional placement visualizations in under 30 seconds. No studio. No Photoshop.
              </motion.p>

              <motion.div variants={fade} custom={2} className="mt-8 flex flex-col sm:flex-row items-start gap-5">
                <Link
                  href="/upload?trial=true"
                  className="inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.15em] font-medium text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors duration-300"
                >
                  Try 3 Free Visualizations
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/upload"
                  className="text-[13px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300 mt-1"
                >
                  Get 10 for $5
                </Link>
              </motion.div>

              <motion.div variants={fade} custom={3} className="mt-6 flex flex-wrap items-center gap-5">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  GDPR Compliant
                </span>
                <span className="w-px h-4 bg-border hidden sm:block" />
                <span className="text-xs text-muted-foreground">14-day money-back guarantee</span>
                <span className="w-px h-4 bg-border hidden sm:block" />
                <span className="text-xs text-muted-foreground">No subscription</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] as const }}
              className="relative"
            >
              <div className="aspect-[3/4] lg:aspect-[4/5] overflow-hidden relative">
                <Image
                  src="/front-gallery-result-01-gallery.jpeg"
                  alt="Painting placed on gallery wall — AI visualization by ArtView Pro"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Gallery Visualization — AI Generated
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="border-t border-border/40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fade} className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
              Before &amp; After
            </motion.p>
            <motion.p variants={fade} className="text-sm text-muted-foreground mb-10 max-w-md">
              Real results — four environments, two artworks, one upload.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
              {beforeAfterPairs.map((pair, idx) => (
                <motion.div key={idx} variants={slideUp} custom={idx}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <Image
                        src={pair.before}
                        alt={`Original artwork before AI placement — ${pair.label}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <Image
                        src={pair.after}
                        alt={`Artwork placed in ${pair.label} — AI gallery mockup by ArtView Pro`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Original</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{pair.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fade} className="mt-12">
              <Link
                href="/examples"
                className="text-[13px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300 inline-flex items-center gap-2"
              >
                See all environments
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fade} className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-12">
              Made for
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { who: "Independent artists", use: "Preparing for fairs, open studios, and online sales without hiring a photographer." },
                { who: "Gallery owners", use: "Creating compelling submission materials and exhibition proposals for new artists." },
                { who: "Art consultants", use: "Pitching artwork to corporate clients with realistic office and lobby placement mockups." },
                { who: "Online sellers", use: "Converting browsers into buyers by showing exactly how a piece looks on a real wall." },
              ].map((item, i) => (
                <motion.div key={i} variants={slideUp} custom={i}>
                  <p className="font-display text-lg text-foreground mb-2">{item.who}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.use}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statement */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fade} className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
              The Standard
            </motion.p>
            <motion.h2
              variants={slideUp}
              className="font-display text-[clamp(1.5rem,3.5vw,3.5rem)] font-normal leading-[1.15] text-foreground max-w-3xl"
            >
              Professional galleries don&apos;t compromise on presentation.
              <span className="text-muted-foreground"> Neither should you.</span>
            </motion.h2>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="border-t border-border/40 bg-muted/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 md:py-36">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fade} className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-16">
              Process
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
              {[
                { num: "01", title: "Upload", desc: "Photograph your artwork with any device. Our AI handles the rest — no professional photography required." },
                { num: "02", title: "Visualize", desc: "Your work is placed into eight curated environments — galleries, living spaces, corporate settings — with accurate scale and lighting." },
                { num: "03", title: "Present", desc: "Download high-resolution images ready for portfolios, client presentations, gallery submissions, or online sales." },
              ].map((step) => (
                <motion.div key={step.num} variants={slideUp}>
                  <span className="font-display text-5xl font-light text-border">{step.num}</span>
                  <h3 className="mt-4 font-display text-2xl text-foreground">{step.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border/40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 md:py-36">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fade} className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
              Investment
            </motion.p>
            <motion.h2 variants={slideUp} className="font-display text-[clamp(1.5rem,3vw,3rem)] font-normal leading-[1.15] text-foreground max-w-2xl">
              Ten exhibition-ready visualizations.
              <span className="text-muted-foreground"> One straightforward price.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 max-w-lg"
          >
            <div className="border-t border-foreground pt-8">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-6xl md:text-7xl font-light text-foreground">$5</span>
                <span className="text-sm text-muted-foreground">per session · 10 visualizations</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Comparable services charge $15–30 per image. A photography studio session runs $200+.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                No subscription. Full commercial rights included.
              </p>

              <ul className="mt-8 space-y-3 border-t border-border/40 pt-8">
                {['High-resolution downloads', '30-second processing', '8 curated environments', 'Full commercial rights', '14-day satisfaction guarantee'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="w-1 h-1 rounded-full bg-foreground" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col sm:flex-row items-start gap-5">
                <Link
                  href="/upload?trial=true"
                  className="inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.15em] font-medium text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors duration-300"
                >
                  Try 3 Free First
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/upload"
                  className="text-[13px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300 mt-1"
                >
                  Get All 10 — $5
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 md:py-36">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fade} className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-16">
              Commitment
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
              {[
                { title: "Your Work, Your Rights", desc: "Full commercial ownership of every visualization. We never use, sell, or redistribute your artwork." },
                { title: "Privacy by Design", desc: "Source images deleted within 7 days. Visualizations removed after 30. Founded in Holland, GDPR compliant." },
                { title: "Satisfaction Guaranteed", desc: "If the results don't meet your standards, request a full refund within 14 days. No questions asked." },
              ].map((item, i) => (
                <motion.div key={i} variants={slideUp}>
                  <h3 className="font-display text-xl text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border/40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 md:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fade} className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
              Questions
            </motion.p>
            <motion.h2 variants={slideUp} className="font-display text-[clamp(1.5rem,3vw,3rem)] font-normal leading-[1.15] text-foreground mb-12 max-w-xl">
              Everything you need to know.
            </motion.h2>
            <motion.div variants={fade} className="max-w-2xl">
              <FAQ />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 md:py-36">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="max-w-3xl"
          >
            <motion.h2
              variants={slideUp}
              className="font-display text-[clamp(2rem,4.5vw,4.5rem)] font-normal leading-[1.08] text-foreground"
            >
              Present your work
              <br />
              the way it deserves
              <br />
              <em className="italic">to be seen.</em>
            </motion.h2>

            <motion.div variants={fade} custom={2} className="mt-12 flex flex-col sm:flex-row items-start gap-6">
              <Link
                href="/upload?trial=true"
                className="inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.15em] font-medium text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors duration-300"
              >
                Try 3 Free Visualizations
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/upload"
                className="text-[13px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300 mt-1"
              >
                Get All 10 — $5
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <PageFooter />

      {/* Popups & notifications */}
      <FreeTrialPopup isOpen={isOpen} onClose={closePopup} onSubmit={handleEmailSubmitWithToast} />
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  )
}
