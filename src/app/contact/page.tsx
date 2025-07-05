'use client'

import { useState } from 'react'
import { ArrowLeft, Mail, MessageSquare, RefreshCw, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'feature' | 'refund'>('feature')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 2000)
  }

  const getEmailSubject = () => {
    return activeTab === 'feature' 
      ? `Feature Request: ${formData.subject}` 
      : `Refund Request: ${formData.subject}`
  }

  const getEmailBody = () => {
    return `
Name: ${formData.name}
Email: ${formData.email}
Type: ${activeTab === 'feature' ? 'Feature Request' : 'Refund Request'}

Message:
${formData.message}

---
Sent from ArtContext Contact Form
    `.trim()
  }

  if (isSubmitted) {
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

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for contacting us. We've received your {activeTab === 'feature' ? 'feature request' : 'refund request'} and 
              will get back to you within 24 hours at the email address you provided.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setActiveTab('feature')
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Send Another Message
              </button>
              <Link 
                href="/"
                className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help! Whether you have a feature request or need a refund, 
            we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('feature')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'feature'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Feature Request</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('refund')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'refund'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <RefreshCw className="w-5 h-5" />
                  <span>Refund Request</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {activeTab === 'feature' ? (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Request a New Feature</h2>
                <p className="text-gray-600">
                  Have an idea for improving ArtContext? We'd love to hear it! Your feedback helps us build 
                  better tools for artists and art professionals.
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Request a Refund</h2>
                <p className="text-gray-600">
                  Not satisfied with your visualizations? We offer a 14-day money-back guarantee. 
                  Please let us know what went wrong so we can improve our service.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={
                    activeTab === 'feature' 
                      ? "Brief description of your feature idea" 
                      : "Brief description of your refund request"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {activeTab === 'feature' ? 'Feature Description *' : 'Refund Reason *'}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={
                    activeTab === 'feature'
                      ? "Please describe your feature idea in detail. How would it help you? What problem would it solve?"
                      : "Please explain why you're requesting a refund. What didn't meet your expectations? This helps us improve our service."
                  }
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900 mb-1">Quick Response Guarantee</p>
                    <p>
                      We'll respond to your {activeTab === 'feature' ? 'feature request' : 'refund request'} within 
                      24 hours at <span className="font-medium">tensilecorp@gmail.com</span>
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Send {activeTab === 'feature' ? 'Feature Request' : 'Refund Request'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Feature Requests</h3>
            <p className="text-gray-600 text-sm">
              We're constantly improving ArtContext based on user feedback. Popular requests include 
              new environment types, custom lighting options, and batch processing features.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Policy</h3>
            <p className="text-gray-600 text-sm">
              We offer a 14-day money-back guarantee. If you're not satisfied with your visualizations, 
              we'll provide a full refund, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
