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
      category: "Living Room",
      description: "Modern, elegant living spaces",
      examples: [
        {
          original: "/artwork1.jpg",
          placed: "/artwork-in-living-room.jpg",
          title: "Contemporary Abstract in Living Room",
          description: "Modern art styled in a clean, residential interior"
        },
        {
          original: "/artwork2.jpg", 
          placed: "/scenes/artwork-in-living-room-upscaled-2 Medium.jpeg",
          title: "Classic Painting in Modern Living Room",
          description: "Traditional artwork placed in a modern living room setting"
        }
      ]
    },
    {
      category: "Gallery",
      description: "Professional gallery environments",
      examples: [
        {
          original: "/artwork2.jpg",
          placed: "/artwork-in-gallery-3.jpg",
          title: "Gallery Wall Display",
          description: "Exhibition-style mockup in a neutral-toned gallery"
        },
        {
          original: "/artwork3.jpg",
          placed: "/scenes/replicate-prediction-epewxcww89rmc0cqv6qre5r5rr Medium.jpeg",
          title: "Contemporary Gallery Space",
          description: "Clean, minimalist setting for modern and abstract work"
        }
      ]
    },
    {
      category: "Office",
      description: "Workplace and corporate interiors",
      examples: [
        {
          original: "/artwork3.jpg",
          placed: "/artwork-in-office.jpg",
          title: "Corporate Office Display",
          description: "Artwork shown in a sleek, contemporary office lobby"
        },
        {
          original: "/artwork1.jpg",
          placed: "/scenes/artwork-in-office-upscaled Medium.jpeg",
          title: "Executive Office Setting",
          description: "Sophisticated environment suited for framed or large-format work"
        }
      ]
    },
    {
      category: "Hotel Lobby",
      description: "Luxury hospitality environments",
      examples: [
        {
          original: "/artwork2.jpg",
          placed: "/scenes/artwork-in-hotel-lobby Medium.jpeg",
          title: "Luxury Hotel Entrance",
          description: "Large-format artwork placed in a premium hotel lobby setting"
        }
      ]
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

        {/* Examples by Category */}
        {examples.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{category.category}</h2>
              <p className="text-lg text-gray-600">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {category.examples.map((example, exampleIndex) => (
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
          </div>
        ))}

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
