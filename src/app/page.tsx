'use client'

import { ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
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
    label: "Private Office",
  },
]

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
                presented with
                <br />
                <em className="italic">museum precision.</em>
              </motion.h1>

              <motion.p
                variants={fade}
                custom={1}
                className="mt-6 text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
              >
                AI-powered visualization that places your work in gallery-grade environments. Upload once, receive ten exhibition-ready images.
              </motion.p>

              <motion.div variants={fade} custom={2} className="mt-6 flex flex-wrap items-center gap-5">
                <span className="text-xs text-muted-foreground">Used by independent artists and galleries</span>
                <span className="w-px h-4 bg-border hidden sm:block" />
                <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  GDPR Compliant
                </span>
              </motion.div>

              <motion.div variants={fade} custom={3} className="mt-8 flex items-center gap-8">
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.15em] font-medium text-foreground border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors duration-300"
                >
                  Upload Your Artwork
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/examples"
                  className="text-[13px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  View Examples
                </Link>
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
                  alt="Artwork displayed in a professional gallery setting"
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
            <motion.p variants={fade} className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-10">
              Before &amp; After
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
              {beforeAfterPairs.map((pair, idx) => (
                <motion.div key={idx} variants={slideUp} custom={idx}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <Image
                        src={pair.before}
                        alt={`Original artwork — ${pair.label}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <Image
                        src={pair.after}
                        alt={`Visualization — ${pair.label}`}
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
                <span className="text-sm text-muted-foreground">per session</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Ten high-resolution visualizations across eight curated environments.
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

              <div className="mt-10">
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.15em] font-medium text-foreground border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors duration-300"
                >
                  Begin Now
                  <ArrowRight className="w-4 h-4" />
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

      {/* Final CTA */}
      <section className="border-t border-border/40">
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
                href="/upload"
                className="inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.15em] font-medium text-foreground border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors duration-300"
              >
                Upload Your Artwork
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/upload?trial=true"
                className="text-[13px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Try 3 Free Visualizations
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
