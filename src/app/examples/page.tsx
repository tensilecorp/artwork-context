import { ArrowLeft, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Art Gallery Mockup Examples - ArtView Pro",
  description: "See real AI art visualization examples. Professional gallery mockups, living room placements, and office displays created in 30 seconds.",
  keywords: "AI art gallery mockup examples, art visualization samples, artwork placement examples, gallery mockup showcase",
}

export default function ExamplesPage() {
  const examples = [
    {
      original: "/front-gallery-original-01.jpeg",
      placed: "/front-gallery-result-01-living.jpeg",
      title: "Contemporary Artwork in Living Room",
      description: "Modern artwork perfectly placed in an elegant living room setting"
    },
    {
      original: "/front-gallery-original-01.jpeg",
      placed: "/front-gallery-result-01-gallery.jpeg",
      title: "Gallery Wall Display",
      description: "Professional gallery presentation with perfect lighting and spacing"
    },
    {
      original: "/front-gallery-original-02.jpeg",
      placed: "/front-gallery-result-02-office.jpeg",
      title: "Corporate Office Display",
      description: "Sophisticated artwork placement in a modern office environment"
    },
    {
      original: "/front-gallery-original-02.jpeg",
      placed: "/front-gallery-result-02-gallery.jpeg",
      title: "Modern Gallery Space",
      description: "Clean, minimalist gallery setting showcasing contemporary art"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              <Image src="/logo.svg" alt="ArtView Pro" width={120} height={40} className="h-8 w-auto" />
            </div>
            
            <Link href="/upload" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Try with Your Artwork
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Art Gallery Mockup Examples
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how ArtView Pro's AI transforms your artwork into professional gallery mockups and visualizations, placed in real-world environments — from homes and offices to galleries and more.
          </p>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {examples.map((example, exampleIndex) => (
            <div key={exampleIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{example.title}</h3>
                <p className="text-gray-600 mb-6">{example.description}</p>
                
                {/* Gallery-style Layout with smaller original */}
                <div className="relative">
                  {/* Main Result Image */}
                  <div className="relative aspect-[4/3] mb-4">
                    <Image
                      src={example.placed}
                      alt="Artwork placed in environment"
                      fill
                      className="object-cover rounded-lg shadow-md"
                    />
                    {/* Small Original Thumbnail - Front Page Gallery Style */}
                    <div className="absolute top-3 left-3 bg-white p-1 rounded-md border border-black/10 shadow-lg w-16 h-16 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                      <Image
                        src={example.original}
                        alt="Original artwork"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </div>
                  
                  {/* Labels */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Original → Professional Visualization</span>
                    <div className="flex items-center text-blue-600">
                      <Sparkles className="w-4 h-4 mr-1" />
                      <span className="font-medium">AI Enhanced</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="bg-blue-50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Try It Yourself?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your artwork and get 10 professional visualizations in under 30 seconds — no subscription, no commitments.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/upload" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Creating Now
            </Link>
            
            <div className="text-sm text-gray-600 font-medium">
              💥 Launch Special: $5 — 48 hours only
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
