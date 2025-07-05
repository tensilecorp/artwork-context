import { ArrowLeft, Shield, Eye, AlertTriangle, Scale } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function DisclaimerPage() {
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
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Disclaimer & Privacy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy and trust are important to us. Please read this disclaimer to understand 
            our policies and your responsibilities when using ArtContext.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 2025
          </p>
        </div>

        <div className="space-y-8">
          {/* Privacy & Data Protection */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Privacy & Data Protection</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>We take your privacy seriously.</strong> ArtContext is committed to protecting your personal 
                information and artwork images in accordance with applicable privacy laws.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6">Data Collection & Usage</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We collect only the information necessary to provide our service (email, artwork images)</li>
                <li>Your artwork images are processed securely and used solely for generating visualizations</li>
                <li>We do not sell, share, or distribute your personal information or artwork to third parties</li>
                <li>All data is encrypted in transit and at rest using industry-standard security measures</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Data Retention & Deletion</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Original artwork images are automatically deleted after 7 days</li>
                <li>Generated visualizations are deleted after 30 days</li>
                <li>You can request immediate deletion of your data at any time</li>
                <li>Payment information is handled securely by Stripe and not stored on our servers</li>
              </ul>
            </div>
          </div>

          {/* Copyright & Intellectual Property */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Copyright & Intellectual Property</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">
                  <strong>Important:</strong> You are solely responsible for ensuring you have the right to use 
                  and modify any artwork you upload to our service.
                </p>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6">Your Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must own the copyright to the artwork or have explicit permission to use it</li>
                <li>You are responsible for any copyright infringement claims related to uploaded artwork</li>
                <li>Do not upload artwork that belongs to others without proper authorization</li>
                <li>Respect the intellectual property rights of artists, galleries, and institutions</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Generated Visualizations</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You retain full ownership and commercial rights to the generated visualizations</li>
                <li>You may use the visualizations for any purpose, including commercial use</li>
                <li>ArtContext does not claim any ownership over your original artwork or generated images</li>
              </ul>
            </div>
          </div>

          {/* AI-Generated Content */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">AI-Generated Content Disclaimer</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>ArtContext uses artificial intelligence</strong> to generate artwork visualizations. 
                Please understand the following about AI-generated content:
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6">Accuracy & Realism</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Generated visualizations are artistic interpretations, not exact representations</li>
                <li>Colors, lighting, and proportions may vary from real-world placement</li>
                <li>Results are intended for visualization and marketing purposes, not architectural planning</li>
                <li>Physical artwork placement may differ from AI-generated visualizations</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Quality & Variations</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI-generated results may vary in quality and accuracy</li>
                <li>Some artwork types or styles may produce better results than others</li>
                <li>Environmental factors in generated images are simulated, not real</li>
                <li>We continuously improve our AI models but cannot guarantee perfect results</li>
              </ul>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>ArtContext provides this service "as is"</strong> and makes no warranties about the 
                accuracy, reliability, or suitability of the generated visualizations.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6">Service Limitations</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We are not responsible for any business decisions made based on our visualizations</li>
                <li>Generated images should not be used as the sole basis for purchasing decisions</li>
                <li>We do not guarantee the service will be available 24/7 without interruption</li>
                <li>Technical issues or AI model limitations may affect result quality</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Legal Protection</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>ArtContext is not liable for copyright infringement by users</li>
                <li>Users indemnify ArtContext against claims related to uploaded content</li>
                <li>Our liability is limited to the amount paid for the service</li>
                <li>We are not responsible for any indirect or consequential damages</li>
              </ul>
            </div>
          </div>

          {/* Contact & Updates */}
          <div className="bg-blue-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Concerns?</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about this disclaimer, our privacy practices, or need to report 
              a copyright concern, please don't hesitate to contact us.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                Contact Us
              </Link>
              <Link 
                href="/" 
                className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
              >
                Back to Home
              </Link>
            </div>
            
            <p className="text-sm text-gray-600 mt-6">
              <strong>Note:</strong> This disclaimer may be updated from time to time. Continued use of 
              ArtContext constitutes acceptance of any changes. We recommend reviewing this page periodically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
