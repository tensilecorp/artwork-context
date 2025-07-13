# Google Analytics 4 Setup Guide

## 🎯 Overview

Your ArtView Pro website now has **dual analytics tracking**:
- **PostHog**: Advanced product analytics, user behavior, feature flags
- **Google Analytics 4**: Standard web analytics, SEO insights, Google ecosystem integration

## 📋 Setup Steps

### 1. Create Google Analytics 4 Property

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Create Account** (if you don't have one)
3. **Create Property**:
   - Property name: `ArtView Pro`
   - Reporting time zone: `Europe/Amsterdam` (or your timezone)
   - Currency: `Euro` (or your preferred currency)
4. **Choose Platform**: `Web`
5. **Add Website Details**:
   - Website URL: `https://artviewpro.com`
   - Stream name: `ArtView Pro Website`

### 2. Get Your Measurement ID

1. After creating the property, you'll see a **Measurement ID** like `G-XXXXXXXXXX`
2. **Copy this ID**

### 3. Update Environment Variables

Replace the placeholder in your `.env.local` file:

```bash
# Replace G-XXXXXXXXXX with your actual Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YOUR_ACTUAL_ID_HERE
```

### 4. Deploy Changes

```bash
git add .
git commit -m "Add Google Analytics 4 integration alongside PostHog"
git push origin main
```

## 🔧 What's Already Implemented

### ✅ Automatic Tracking
- **Page views** (all pages)
- **User sessions**
- **Traffic sources**
- **Device/browser data**
- **Geographic data**

### ✅ Custom Event Tracking
- **Artwork uploads** (file type, size)
- **AI analysis start/completion** (processing time, success rate)
- **Payment flows** (initiation, completion)
- **Image downloads** (type, resolution)
- **User engagement** (clicks, interactions)
- **Error tracking** (types, messages)

### ✅ Enhanced Ecommerce
- **Purchase tracking** with transaction IDs
- **Revenue attribution**
- **Conversion funnel analysis**

## 📊 Using the Analytics

### In Your Code

```typescript
import { analytics } from '@/utils/analytics'

// Track custom events
analytics.trackArtworkUpload('jpeg', 2048000)
analytics.trackPaymentSuccess('txn_123', 5.00, 'USD')
analytics.trackDownload('png', '4K')
analytics.trackEngagement('click', 'upload_button')
```

### In Google Analytics Dashboard

1. **Real-time**: See live user activity
2. **Acquisition**: Traffic sources and campaigns
3. **Engagement**: Page views, session duration
4. **Monetization**: Revenue, conversions
5. **Retention**: User return patterns

## 🎯 Key Metrics to Monitor

### Business Metrics
- **Conversion Rate**: Uploads → Payments
- **Revenue per User**
- **Customer Acquisition Cost**
- **User Retention Rate**

### Product Metrics
- **Upload Success Rate**
- **AI Processing Time**
- **Download Completion Rate**
- **User Journey Drop-offs**

### Technical Metrics
- **Page Load Times**
- **Error Rates**
- **API Response Times**
- **Mobile vs Desktop Usage**

## 🔗 Integration Benefits

### PostHog + Google Analytics = Complete Picture

| Metric | PostHog | Google Analytics |
|--------|---------|------------------|
| **User Behavior** | ✅ Advanced funnels | ✅ Basic funnels |
| **Product Analytics** | ✅ Feature usage | ❌ Limited |
| **SEO Insights** | ❌ Limited | ✅ Search Console integration |
| **Advertising** | ❌ Limited | ✅ Google Ads integration |
| **Real-time Data** | ✅ Instant | ✅ Near real-time |
| **Data Export** | ✅ Full access | ✅ BigQuery export |

## 🚀 Next Steps

### 1. Set Up Goals & Conversions
- **Primary Goal**: Payment completion
- **Secondary Goals**: Email signups, downloads
- **Micro-conversions**: Upload attempts, page engagement

### 2. Connect Google Search Console
- Link GA4 with Search Console for SEO insights
- Monitor organic search performance

### 3. Set Up Google Ads (Optional)
- Import GA4 conversions to Google Ads
- Track advertising ROI

### 4. Create Custom Dashboards
- **Executive Dashboard**: Revenue, users, conversions
- **Product Dashboard**: Feature usage, user flows
- **Technical Dashboard**: Performance, errors

## 🔒 Privacy & GDPR Compliance

### Already Implemented
- **Consent-based tracking** (both analytics respect user preferences)
- **IP anonymization** (GA4 default)
- **Data retention controls**
- **Cookie-less tracking options**

### Recommendations
- Add cookie consent banner if targeting EU users
- Update privacy policy to mention both analytics platforms
- Consider implementing consent management platform (CMP)

## 📞 Support

If you need help with:
- **Google Analytics setup**: Google Analytics Help Center
- **PostHog configuration**: PostHog Documentation
- **Custom tracking implementation**: Refer to `/src/utils/analytics.ts`

Your analytics setup is now **production-ready** and will provide comprehensive insights into your ArtView Pro business! 🎉
