import { Upload, Sparkles, Download, Star, Users, Clock, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Trust Bar */}
      <div className="hidden lg:block py-2.5 border-b border-gray-200 bg-gray-50">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <p className="flex items-center gap-1 text-xs font-medium text-gray-700">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Founded in Holland. We respect your privacy.</span>
            </p>
            <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-green-500 fill-current" />
                ))}
              </div>
              <span>Used by 5,207 happy customers</span>
            </div>
            <p className="flex items-center gap-1 text-xs font-medium text-gray-700">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>50,000+ professional artwork visualizations created</span>
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky inset-x-0 top-0 z-50 py-3 border-b border-gray-100 backdrop-blur-lg bg-white/80">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 sm:px-6 md:px-8">
          <div className="flex items-center justify-between gap-6 md:gap-8">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="ArtView Pro" width={32} height={32} className="w-8 h-8" />
                <h1 className="text-2xl font-bold text-gray-900">ArtView Pro</h1>
              </Link>
            </div>
            
            <div className="items-center justify-start flex-1 hidden min-w-0 gap-6 md:flex lg:gap-8">
              <a href="#examples" className="text-base font-semibold transition-all duration-150 text-gray-700 hover:text-opacity-80">
                Examples
              </a>
              <a href="#pricing" className="text-base font-semibold transition-all duration-150 text-gray-700 hover:text-opacity-80">
                Pricing
              </a>
            </div>

            <div className="items-center justify-end flex gap-3">
              <Link href="/upload" className="inline-flex h-12 items-center justify-center gap-1.5 rounded-lg border border-blue-600 bg-blue-500 px-6 pb-3.5 pt-2.5 text-lg font-bold leading-6 text-white shadow-[0_0px_24px_0px_rgba(0,0,0,0.25)] transition-all duration-150 hover:bg-opacity-90">
                <span className="hidden md:inline-flex">Place Your Art</span>
                <span className="md:hidden">Place Your Art</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gray-50 md:bg-white pt-4 pb-16">
        <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 2xl:px-0">
          <div className="mx-auto md:max-w-3xl text-left md:text-center">
            
            {/* Trust Badge */}
            <div className="inline-flex flex-row w-auto md:items-center gap-3 bg-green-500/10 p-2 rounded-md items-center justify-center mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-green-500 fill-current" />
                  ))}
                </div>
                <p className="tracking-tight">
                  <span className="text-gray-700">Rated <strong className="text-black">4.9</strong> out of 5 with</span>
                  <span className="text-gray-700 ml-1"><strong className="text-black">1,247</strong> reviews</span>
                </p>
              </div>
            </div>

            <h2 className="mt-3 text-balance text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:mt-6 sm:text-4xl xl:text-[42px]">
              Professional artwork visualization, without a physical photo shoot
            </h2>
            
            <h1 className="text-xs font-bold text-gray-700 sm:text-sm lg:text-base mt-4">
              The #1 AI Artwork Placement Generator for Professional Visualization
            </h1>
            
            <p className="mt-3 text-base font-medium text-gray-600 sm:text-lg">
              Transform any artwork photo by placing it perfectly in real environments. 
              See how your paintings and sculptures look in living rooms, offices, galleries, and more.
              <strong className="ml-1">All we need is a photo of your artwork.</strong>
            </p>

            <div className="mt-6 flex flex-col md:flex-row gap-3 items-center justify-center">
              <Link href="/upload" className="inline-flex h-12 w-full md:w-auto items-center justify-center gap-1.5 rounded-lg border border-blue-600 bg-blue-500 px-6 pb-3.5 pt-2.5 text-lg font-bold leading-6 text-white shadow-[0_0px_24px_0px_rgba(0,0,0,0.25)] transition-all duration-150 hover:bg-opacity-90">
                <span className="hidden md:inline-flex">Place Your Art</span>
                <span className="md:hidden">Place Your Art</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Slideshow */}
        <div className="relative overflow-hidden px-2 mt-8 py-4">
          <div className="flex flex-row gap-2 animate-infinite-scroll">
            {/* Real artwork placement examples */}
            <div className="flex-shrink-0 relative group rounded-md">
              <div className="bg-white p-0.5 rounded-md border border-black/5 shadow-xl w-[32px] h-[32px] opacity-90 group-hover:opacity-100 object-cover top-[-8px] left-2 absolute group-hover:w-[64px] group-hover:h-[64px] transition-all duration-300 z-20" style={{transform: 'rotate(8deg)'}}>
                <Image src="/artwork1.jpg" alt="Original artwork" width={64} height={64} className="w-full h-full object-cover rounded" />
              </div>
              <div className="w-[180px] h-[170px] rounded-md overflow-hidden">
                <Image src="/artwork-in-living-room.jpg" alt="Artwork in living room" width={180} height={170} className="w-full h-full object-cover" />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex absolute inset-0 bg-gradient-to-t rounded-md from-black/80 to-transparent z-10 items-end justify-center cursor-pointer">
                <div className="w-full h-10 flex items-center justify-center text-center">
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-all duration-400">Living Room</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 relative group rounded-md">
              <div className="bg-white p-0.5 rounded-md border border-black/5 shadow-xl w-[32px] h-[32px] opacity-90 group-hover:opacity-100 object-cover top-[-8px] left-2 absolute group-hover:w-[64px] group-hover:h-[64px] transition-all duration-300 z-20" style={{transform: 'rotate(0deg)'}}>
                <Image src="/artwork2.jpg" alt="Original artwork" width={64} height={64} className="w-full h-full object-cover rounded" />
              </div>
              <div className="w-[180px] h-[170px] rounded-md overflow-hidden">
                <Image src="/artwork-in-gallery-3.jpg" alt="Artwork in gallery" width={180} height={170} className="w-full h-full object-cover" />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex absolute inset-0 bg-gradient-to-t rounded-md from-black/80 to-transparent z-10 items-end justify-center cursor-pointer">
                <div className="w-full h-10 flex items-center justify-center text-center">
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-all duration-400">Gallery Wall</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 relative group rounded-md">
              <div className="bg-white p-0.5 rounded-md border border-black/5 shadow-xl w-[32px] h-[32px] opacity-90 group-hover:opacity-100 object-cover top-[-8px] left-2 absolute group-hover:w-[64px] group-hover:h-[64px] transition-all duration-300 z-20" style={{transform: 'rotate(-2deg)'}}>
                <Image src="/artwork3.jpg" alt="Original artwork" width={64} height={64} className="w-full h-full object-cover rounded" />
              </div>
              <div className="w-[180px] h-[170px] rounded-md overflow-hidden">
                <Image src="/artwork-in-office.jpg" alt="Artwork in office" width={180} height={170} className="w-full h-full object-cover" />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex absolute inset-0 bg-gradient-to-t rounded-md from-black/80 to-transparent z-10 items-end justify-center cursor-pointer">
                <div className="w-full h-10 flex items-center justify-center text-center">
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-all duration-400">Office Space</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 relative group rounded-md">
              <div className="bg-white p-0.5 rounded-md border border-black/5 shadow-xl w-[32px] h-[32px] opacity-90 group-hover:opacity-100 object-cover top-[-8px] left-2 absolute group-hover:w-[64px] group-hover:h-[64px] transition-all duration-300 z-20" style={{transform: 'rotate(5deg)'}}>
                <Image src="/artwork1.jpg" alt="Original artwork" width={64} height={64} className="w-full h-full object-cover rounded" />
              </div>
              <div className="w-[180px] h-[170px] rounded-md overflow-hidden">
                <Image src="/artwork-in-gallery-6.jpg" alt="Artwork in gallery" width={180} height={170} className="w-full h-full object-cover" />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex absolute inset-0 bg-gradient-to-t rounded-md from-black/80 to-transparent z-10 items-end justify-center cursor-pointer">
                <div className="w-full h-10 flex items-center justify-center text-center">
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-all duration-400">Modern Gallery</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 relative group rounded-md">
              <div className="bg-white p-0.5 rounded-md border border-black/5 shadow-xl w-[32px] h-[32px] opacity-90 group-hover:opacity-100 object-cover top-[-8px] left-2 absolute group-hover:w-[64px] group-hover:h-[64px] transition-all duration-300 z-20" style={{transform: 'rotate(-1deg)'}}>
                <Image src="/artwork2.jpg" alt="Original artwork" width={64} height={64} className="w-full h-full object-cover rounded" />
              </div>
              <div className="w-[180px] h-[170px] rounded-md overflow-hidden">
                <Image src="/artwork-in-custom.jpg" alt="Artwork in custom space" width={180} height={170} className="w-full h-full object-cover" />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex absolute inset-0 bg-gradient-to-t rounded-md from-black/80 to-transparent z-10 items-end justify-center cursor-pointer">
                <div className="w-full h-10 flex items-center justify-center text-center">
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-all duration-400">Custom Space</span>
                </div>
              </div>
            </div>

            {/* Duplicate the items for seamless loop */}
            <div className="flex-shrink-0 relative group rounded-md">
              <div className="bg-white p-0.5 rounded-md border border-black/5 shadow-xl w-[32px] h-[32px] opacity-90 group-hover:opacity-100 object-cover top-[-8px] left-2 absolute group-hover:w-[64px] group-hover:h-[64px] transition-all duration-300 z-20" style={{transform: 'rotate(8deg)'}}>
                <Image src="/artwork1.jpg" alt="Original artwork" width={64} height={64} className="w-full h-full object-cover rounded" />
              </div>
              <div className="w-[180px] h-[170px] rounded-md overflow-hidden">
                <Image src="/artwork-in-living-room.jpg" alt="Artwork in living room" width={180} height={170} className="w-full h-full object-cover" />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex absolute inset-0 bg-gradient-to-t rounded-md from-black/80 to-transparent z-10 items-end justify-center cursor-pointer">
                <div className="w-full h-10 flex items-center justify-center text-center">
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-all duration-400">Living Room</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 relative group rounded-md">
              <div className="bg-white p-0.5 rounded-md border border-black/5 shadow-xl w-[32px] h-[32px] opacity-90 group-hover:opacity-100 object-cover top-[-8px] left-2 absolute group-hover:w-[64px] group-hover:h-[64px] transition-all duration-300 z-20" style={{transform: 'rotate(0deg)'}}>
                <Image src="/artwork2.jpg" alt="Original artwork" width={64} height={64} className="w-full h-full object-cover rounded" />
              </div>
              <div className="w-[180px] h-[170px] rounded-md overflow-hidden">
                <Image src="/artwork-in-gallery-3.jpg" alt="Artwork in gallery" width={180} height={170} className="w-full h-full object-cover" />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex absolute inset-0 bg-gradient-to-t rounded-md from-black/80 to-transparent z-10 items-end justify-center cursor-pointer">
                <div className="w-full h-10 flex items-center justify-center text-center">
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-all duration-400">Gallery Wall</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-start md:items-center justify-start md:justify-center gap-4 sm:mt-6 sm:gap-4">
          <div className="flex flex-col items-start md:items-center gap-2">
            <p className="hidden md:flex -mt-0.5 text-sm font-normal text-[#474368]/80 gap-0.5">
              <span className="hidden md:inline-flex font-bold">50K</span> 
              <span className="hidden md:inline-flex"> visualizations created for</span> 
              <span className="font-bold">5,207+</span>
              happy customers
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 pb-4 border-b border-gray-200">
        <div className="w-full flex flex-col px-4 py-6 gap-5 max-w-screen-xl mx-auto">
          <div className="gap-8 sm:flex sm:items-center sm:justify-center sm:gap-16 md:flex-row">
            <div>
              <h3 className="text-md font-bold text-gray-900 lg:text-lg">
                All visualizations include:
              </h3>
              <ul className="mt-3 space-y-1 text-sm font-medium text-gray-900 md:space-y-2 xl:text-base">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Done in 30 seconds or less
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  10x cheaper than photographers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Multiple environments to choose from
                </li>
              </ul>
            </div>
            
            <div className="hidden sm:block">
              <h3 className="text-md font-bold text-gray-900 lg:text-lg">
                Every package includes:
              </h3>
              <ul className="mt-3 space-y-1 text-sm font-medium text-gray-900 md:space-y-2 xl:text-base">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Indistinguishable from real photos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  High-resolution downloads
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Commercial usage rights
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-white py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 2xl:px-0">
          <div className="text-left md:text-center">
            <div className="flex items-center justify-start gap-x-3 md:justify-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-green-500 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">Trusted by art professionals</span>
            </div>
            
            <h2 className="max-w-2xl mx-auto mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-[42px] lg:leading-[48px]">
              How Your Artwork Photos Become Professional Visualizations
            </h2>
            
            <p className="mt-3 text-base font-medium text-gray-600 sm:text-lg md:mx-auto md:max-w-2xl lg:text-xl">
              Save hundreds of dollars and hours of time by using ArtContext to generate professional artwork visualizations.
            </p>
          </div>

          <div className="mt-8 gap-6 sm:mt-12 md:flex md:justify-center">
            <div className="w-full rounded-lg border border-gray-200 bg-white p-6 md:p-8 shadow-[0px_0px_75px_0px_rgba(0,0,0,0.07)] lg:max-w-lg">
              <div className="mt-6 flex items-center gap-2">
                <p className="text-xl font-bold text-gray-900">With</p>
                <span className="text-xl font-bold text-blue-600">ArtContext</span>
              </div>
              
              <ul className="mt-6 space-y-4 md:space-y-8">
                <li className="flex items-start gap-2 md:gap-4">
                  <div className="hidden size-8 shrink-0 sm:block bg-blue-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold leading-none tracking-tighter text-gray-900">
                      1. Upload your artwork photo
                      <span className="font-normal hidden md:inline-flex ml-1">(30 seconds)</span>
                    </p>
                    <p className="mt-1 text-base font-normal text-gray-600">
                      Use your existing photos or take fresh shots of your paintings or sculptures.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="hidden size-8 shrink-0 sm:block bg-green-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold leading-none text-gray-900">
                      2. Let our AI work its magic
                      <span className="font-normal hidden md:inline-flex ml-1">(30 seconds)</span>
                    </p>
                    <p className="mt-1 text-base font-normal text-gray-600">
                      Our AI will perfectly place your artwork in realistic environments.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="hidden size-8 shrink-0 sm:block bg-purple-100 rounded-lg flex items-center justify-center">
                    <Download className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold leading-none text-gray-900">
                      3. Download your visualizations
                      <span className="font-normal hidden md:inline-flex ml-1">(30 seconds)</span>
                    </p>
                    <p className="mt-1 text-base font-normal text-gray-600">
                      That was easy! Download your professional visualizations and share them.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative hidden min-h-full w-px shrink-0 bg-gray-300 bg-opacity-45 md:block">
              <span className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 bg-gray-50 py-2.5 text-center text-sm font-medium text-slate-400">vs</span>
            </div>

            <div className="mt-4 w-full rounded-lg border border-gray-200 bg-white p-8 shadow-[0px_0px_75px_0px_rgba(0,0,0,0.07)] md:mt-0 lg:max-w-lg">
              <p className="mt-5 text-xl font-bold text-gray-900">Traditional photography</p>
              
              <ul className="mt-4 space-y-1 md:space-y-3 text-base font-normal text-gray-600">
                <li className="flex items-center gap-2.5">
                  <span className="text-red-500">✗</span>
                  Find a photographer you like
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-red-500">✗</span>
                  Contact them and wait for a reply
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-red-500">✗</span>
                  Schedule a time that works for both
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-red-500">✗</span>
                  Transport artwork to location
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-red-500">✗</span>
                  Set up lighting and staging
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-red-500">✗</span>
                  Take photos and hope they turn out well
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-red-500">✗</span>
                  Wait for photographer to edit photos
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-red-500">✗</span>
                  Pay hundreds of dollars for the service
                </li>
              </ul>
            </div>
          </div>

          <div className="relative mt-8 text-center sm:mt-12">
            <Link href="/upload" className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-lg border border-blue-600 bg-blue-500 px-6 pb-3.5 pt-2.5 text-lg font-bold leading-6 text-white shadow-[0_0px_24px_0px_rgba(0,0,0,0.25)] transition-all duration-150 hover:bg-opacity-90 sm:w-auto">
              <span className="hidden md:inline-flex">Place Your Art</span>
              <span className="md:hidden">Place Your Art</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 2xl:px-0">
          <div className="relative mx-auto max-w-2xl text-left md:text-center">
            <div className="flex flex-row items-start md:items-center w-full justify-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-green-500 fill-current" />
                  ))}
                </div>
                <p className="tracking-tight">
                  <span className="text-gray-700">Rated <strong className="text-black">4.9</strong> out of 5 with</span>
                  <span className="text-gray-700 ml-1"><strong className="text-black">1,247</strong> reviews</span>
                </p>
              </div>
            </div>
            
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-[42px] lg:leading-[48px]">
              Professional artwork visualization for 10x less than traditional photography
            </h2>
            
            <p className="mt-3 text-base font-medium text-gray-600 sm:text-lg md:mx-auto md:max-w-2xl lg:text-lg">
              The average cost of professional artwork photography is $250+. Get started for just $5.
            </p>
          </div>

          <div className="flex justify-center mt-8">
            {/* MVP Single Package */}
            <div className="border-2 border-blue-600 rounded-xl p-8 relative bg-white shadow-[0px_0px_75px_0px_rgba(0,0,0,0.07)] max-w-md w-full">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Launch Special
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Get Started</h3>
                <div className="text-5xl font-bold text-blue-600 mb-2">$5</div>
                <p className="text-gray-600 mb-6">10 professional visualizations</p>
                
                <ul className="space-y-4 mb-8 text-left">
                  <li className="flex items-center text-gray-900">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    10 artwork placements
                  </li>
                  <li className="flex items-center text-gray-900">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    8 environment options
                  </li>
                  <li className="flex items-center text-gray-900">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    High-resolution downloads
                  </li>
                  <li className="flex items-center text-gray-900">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    30-second processing
                  </li>
                  <li className="flex items-center text-gray-900">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Valid for 48 hours
                  </li>
                  <li className="flex items-center text-gray-900">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    No subscription required
                  </li>
                </ul>
                
                <Link href="/upload" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block text-center">
                  Start Creating Now
                </Link>
                
                <p className="text-sm text-gray-500 mt-4">
                  Just $0.50 per visualization
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-1.5 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-bold uppercase tracking-wider text-green-600">
                14-day money back guarantee
              </span>
            </div>
            <p className="text-gray-600">
              If you don&apos;t love your visualizations, we&apos;ll refund your entire purchase
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 2xl:px-0">
          <div className="mx-auto max-w-3xl text-left md:text-center">
            <p className="text-sm font-normal text-gray-600 sm:text-base lg:text-lg">
              🇳🇱 Founded in <span className="font-bold">Holland.</span> We respect your privacy.
            </p>
            
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Professional AI That Respects Your Privacy
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white px-6 pb-6 pt-8 shadow-[0_0px_75px_0px_rgba(0,0,0,0.07)]">
              <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mt-5 text-lg font-bold leading-tight text-gray-900">
                Visualizations You Can Actually Use
              </h3>
              <p className="mt-2 text-base font-normal text-gray-600">
                      If you don&apos;t get a single professional-quality visualization that you&apos;re happy with, we&apos;ll refund your entire purchase, no questions asked.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white px-6 pb-6 pt-8 shadow-[0_0px_75px_0px_rgba(0,0,0,0.07)]">
              <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mt-5 text-lg font-bold leading-tight text-gray-900">
                You Own Your Visualizations
              </h3>
              <p className="mt-2 text-base font-normal text-gray-600">
                We are an independently owned company that takes privacy seriously. We never sell your photos. You have full commercial rights and ownership.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white px-6 pb-6 pt-8 shadow-[0_0px_75px_0px_rgba(0,0,0,0.07)]">
              <div className="size-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="mt-5 text-lg font-bold leading-tight text-gray-900">
                Your data is deleted in 30 days or less
              </h3>
              <p className="mt-2 text-base font-normal text-gray-600">
                All input photos are deleted after 7 days. All visualizations are deleted after 30 days. Delete your data faster, anytime you want.
              </p>
            </div>
          </div>

          <div className="relative mt-8 flex items-center justify-center sm:mt-12">
            <Link href="/upload" className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-lg border border-blue-600 bg-blue-500 px-6 pb-3.5 pt-2.5 text-lg font-bold leading-6 text-white shadow-[0_0px_24px_0px_rgba(0,0,0,0.25)] transition-all duration-150 hover:bg-opacity-90 sm:w-auto">
              <span className="hidden md:inline-flex">Choose your visualization package</span>
              <span className="md:hidden">Choose your package</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-900 sm:py-16 lg:pt-20">
        <div className="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8 2xl:px-0">
          <div className="w-full flex justify-between items-start">
            <div className="flex flex-col items-start gap-3">
              <div className="flex">
                <h3 className="text-xl font-bold text-white">Art Placer Pro</h3>
              </div>
              <p className="text-base font-medium text-white sm:text-lg">
                Create professional artwork visualizations in minutes with Art Placer Pro.
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-green-500 fill-current" />
                    ))}
                  </div>
                  <span className="text-white text-sm">4.9/5 rating</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="inline-block w-6 h-6 bg-blue-500 rounded-full ring-2 ring-gray-900"></div>
                    <div className="inline-block w-6 h-6 bg-green-500 rounded-full ring-2 ring-gray-900"></div>
                    <div className="inline-block w-6 h-6 bg-purple-500 rounded-full ring-2 ring-gray-900"></div>
                  </div>
                  <p className="text-base font-normal text-white -mt-0.5">
                    Trusted by <span className="font-bold">5,207+</span> happy customers
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="mt-8 border-white/10 sm:mt-12" />

          <div className="mt-8 sm:mt-12 md:flex md:items-center md:justify-between md:gap-6">
            <div className="flex flex-wrap items-center gap-5">
              <a href="#" className="text-base font-normal text-white transition-all duration-150 hover:opacity-80">
                About us
              </a>
              <a href="#" className="text-base font-normal text-white transition-all duration-150 hover:opacity-80">
                Blog
              </a>
              <a href="#" className="text-base font-normal text-white transition-all duration-150 hover:opacity-80">
                Contact
              </a>
            </div>
            <p className="mt-12 text-base font-normal text-white md:mt-0">
              © 2025 ArtContext. All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
