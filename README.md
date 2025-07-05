# Artwork Context - AI-Powered Art Placement Visualization

Transform your artwork with AI. Upload photos of paintings or sculptures and see them perfectly placed in beautiful contexts - galleries, homes, and custom environments.

## Features

- 🎨 AI-powered artwork placement in various contexts
- 🖼️ Support for paintings and sculptures
- 🏛️ Multiple environment options (galleries, homes, offices)
- 💳 Stripe payment integration
- 📱 Responsive design
- ⚡ Fast processing with Replicate AI

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **AI Processing**: Replicate API
- **Payments**: Stripe
- **Deployment**: Vercel
- **UI Components**: Radix UI, Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Replicate API key
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd artwork-context
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:
```
REPLICATE_API_TOKEN=your_replicate_token
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Deployment

This app is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Environment Variables

- `REPLICATE_API_TOKEN` - Your Replicate API token
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret

## License

MIT License - see LICENSE file for details.
