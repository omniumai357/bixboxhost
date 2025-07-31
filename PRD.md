# 🎯 BIZBOX.HOST - PRODUCT REQUIREMENTS DOCUMENT

## 🚀 MISSION
Launch a profit-first ad marketplace in 72 hours that converts visitors → emails → previews → purchases → accounts.

## 🎯 CORE USER FLOW
```
Visitor → "Get My Custom Ads" → Email → Preview → Buy ($89-$497) → Auto-Account → Login Later
```

## 🧱 MVP FEATURES (PHASE 1 - 24 HOURS)

### 1. LANDING PAGE
- Hero: "Award-Winning Ad Copy in 60 Seconds"
- Gallery: Premium ad examples
- CTA: "Get My Custom Ads →" (not "Browse")
- Social proof: "1,247 businesses trust us"

### 2. AUTH SYSTEM
- **Guest Preview**: Email → instant preview access
- **Auto-Account**: Created on first email submission
- **Optional Password**: For returning users
- **Magic Links**: Passwordless login option

### 3. PREVIEW SYSTEM
- Sample ad with user's business name
- "Your Custom Ad Preview" headline
- Upgrade prompts after preview
- Track conversions: preview → purchase

### 4. PURCHASE FLOW
- **Starter**: $89.99 (1 ad)
- **Business**: $197 (5 ads)
- **Enterprise**: $497 (15 ads)
- Manual fulfillment for first 10 orders

## 🏗️ TECHNICAL ARCHITECTURE

### Frontend (Lovable.dev)
- React 18 + TypeScript
- Tailwind CSS design system
- Supabase client integration
- Instant deployment

### Backend (Supabase)
- PostgreSQL database
- Row Level Security (RLS)
- Auth management
- Real-time subscriptions

### Backup (GitHub)
- Daily auto-commit
- Schema versioning
- Code synchronization
- Disaster recovery

## 📊 SUCCESS METRICS
- **Week 1**: 10 paying customers ($1,000+ revenue)
- **Week 2**: 50 leads captured
- **Month 1**: $10,000 MRR
- **Conversion**: 15% preview → purchase

## 🛡️ SECURITY REQUIREMENTS
- RLS policies on all tables
- Input validation on all forms
- HTTPS only
- No sensitive data in frontend
- Backup verification daily

## 🚦 LAUNCH CRITERIA
- [ ] Landing page converts visitors to emails
- [ ] Preview system generates sample ads
- [ ] Purchase flow captures payments
- [ ] Auto-account creation works
- [ ] Backup system operational
- [ ] Security audit passed

## 🔄 POST-LAUNCH ROADMAP
- **Week 2**: Stripe integration + automation
- **Week 3**: Email marketing sequences
- **Week 4**: Advanced ad customization
- **Month 2**: Team collaboration features

## 🎯 FINAL DELIVERABLES - COMPLETE DEPLOYMENT PROTOCOL

### REVENUE TARGET: $2,500 by August 3, 2025
### ZERO-FAILURE PROTOCOL ACTIVE

#### Package Tiers (Manual Fulfillment)
- **Starter Package**: $89 (8 Professional Ad Cards)
- **Business Package**: $197 (16 Premium Ad Cards)  
- **Enterprise Package**: $497 (48 Premium Ad Cards)

#### Implementation Phases
1. **Database Setup** (30 mins) - All tables with RLS
2. **Auth System** (2 hours) - Email capture → auto-account creation
3. **Preview System** (2 hours) - Dynamic previews → conversion tracking
4. **Purchase Flow** (2 hours) - Intent capture → manual fulfillment

#### Success Metrics
- 24-hour delivery promise for all packages
- Email-based lead capture and nurturing
- Purchase intent tracking for manual follow-up
- Conversion optimization through preview system