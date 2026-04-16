# Jambo Rafiki - Children Orphanage and Church Centre Website

A beautiful, human-centered multi-page website for Jambo Rafiki Children Orphanage and Church Centre, dedicated to building resilience and restoring hope for orphaned and vulnerable children in Oyugis, Kenya.

## 🌟 About Jambo Rafiki

Jambo Rafiki is a Christian community-based organization legally registered with the Government of Kenya under the Department of Social Services, Culture and Sports. We provide social protection to orphaned and vulnerable children, restoring their dignity and hope for the future.

- **Current Capacity**: 30 children in care
- **Goal**: Expand to support 100 children
- **Programs**: 5 core ministry programs
- **Location**: Oyugis, Kenya
- **Values**: Love, Patience, Honesty, Accountability, Transparency, Integrity, Stewardship

## 🚀 Website Features

### Pages

1. **Home Page**
   - Compelling hero section with call-to-action
   - Statistics showcase (children in care, programs, community impact)
   - Vision and mission highlights
   - Featured programs preview
   - Strong donation and involvement CTAs

2. **About Page**
   - Historical background and organizational story
   - Vision, mission, and objectives
   - Core values presentation with icons
   - Current status and future plans
   - Interactive cards and engaging layouts

3. **Programs Page**
   - Detailed breakdown of all 5 ministry programs:
     - **Spiritual Development** - Church services, Bible study, discipleship
     - **Education & Skills** - Academic support, vocational training
     - **Health & Nutrition** - Medical care, meals, wellness
     - **Food Security** - Farming, sustainability, feeding program
     - **Community Outreach** - Local ministry, partnerships
   - Core program activities timeline
   - Visual program showcase sections
   - Impact stories and testimonials

4. **Get Involved Page**
   - 6 ways to contribute:
     - Donate (financial support)
     - Sponsor a Child (monthly commitment)
     - Volunteer (on-site help)
     - Partner (organization partnerships)
     - Pray (prayer support)
     - Spread the Word (share the mission)
   - Current urgent needs with priority levels
   - Donation impact examples
   - Current challenges section
   - Multiple call-to-action buttons

5. **Contact Page**
   - Contact information and office details
   - Interactive contact form with validation
   - Location map placeholder
   - Quick contact options (email, phone, WhatsApp)
   - Social media links section
   - Office hours information

### Design Highlights

- 🎨 **Warm Color Palette**: Gradients using orange, pink, and golden yellow to evoke compassion and hope
- 📱 **Fully Responsive**: Beautiful on mobile, tablet, and desktop
- 🧭 **Smooth Navigation**: Sticky header with mobile hamburger menu
- ✨ **Interactive Elements**: Hover effects, smooth transitions, engaging animations
- ♿ **Accessible**: Clear typography, good contrast, semantic HTML, Radix UI primitives
- 🖼️ **Image Placeholders**: Ready for you to add your own photos
- 🎯 **Human-Centered Design**: Focused on visitor engagement and conversion

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI library
- **React Router 6.26.0** - Multi-page navigation
- **TypeScript 5.5.3** - Type-safe code
- **Tailwind CSS 3.4.1** - Utility-first styling (stable version)
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Vite 5.4.3** - Fast development and build tool

### UI Components
- **45+ Shadcn/ui components** - Buttons, forms, cards, dialogs, etc.
- **Custom components** - Navigation, Footer, page sections

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Steps

1. **Clone or download the project**
   ```bash
   git clone <your-repo-url>
   cd Jambo_Rafiki
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```
   Output: `/dist` folder

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🗄️ Backend Integration

The frontend is **production-ready**, but requires backend integration for full functionality.

### Current Status
✅ **Working:** All UI, navigation, responsive design, forms (frontend validation)
⏳ **Needs Backend:** Contact form submission, donations, volunteer applications, newsletter

### Backend Options

We provide two backend solutions - **choose based on your needs:**

#### Option 1: Supabase (Recommended for Quick Start) 🚀

**Best for:** Getting live quickly, minimal maintenance, all-in-one solution

**Features:**
- PostgreSQL database with auto-generated APIs
- Built-in authentication
- File storage for images/documents
- Edge Functions for M-Pesa integration
- Real-time subscriptions
- Free tier: 500MB database, 50k requests/month

**Setup:**
See `BACKEND_OPTIONS.md` for detailed Supabase integration guide.

**Cost:** $0-25/month

#### Option 2: Django + Django REST Framework 🐍

**Best for:** Complex business logic, full control, custom requirements

**Features:**
- Python backend with Django admin panel
- Full control over all business logic
- Easy M-Pesa, Stripe, PayPal integration
- Custom reporting and analytics
- Robust for scaling

**Setup:**
See `BACKEND_OPTIONS.md` for complete Django backend structure.

**Cost:** $10-35/month (hosting + database)

### Backend Features Needed

1. **Contact Form Submission**
   - Store form submissions in database
   - Send email notifications to admin
   - Auto-reply to submitter

2. **Donation Processing**
   - M-Pesa integration (Kenya mobile payments)
   - Stripe/PayPal for international donors
   - Receipt generation
   - Donation tracking

3. **Volunteer Applications**
   - Application form submission
   - Application status tracking
   - Email notifications

4. **Newsletter Signups**
   - Email list management
   - Integration with email service (SendGrid, Mailchimp)

5. **Content Management (Optional)**
   - Admin dashboard to update content
   - Upload photos and documents
   - Blog/news section

6. **Child Sponsorship System (Future)**
   - Match sponsors with children
   - Progress reports
   - Payment tracking

### Payment Integration Notes

**M-Pesa (Kenya):**
- Primary payment method for local donations
- Requires Safaricom developer account
- See backend docs for integration code

**International Payments:**
- Stripe (recommended) - supports 135+ currencies
- PayPal - widely recognized
- Both have SDKs for easy integration

## 🖼️ Adding Your Images

The website includes image placeholders throughout. To add your own images:

### Method 1: Direct Image Files

1. **Create images folder:**
   ```
   /public/images/
   ├── hero/
   ├── about/
   ├── programs/
   ├── children/
   └── volunteers/
   ```

2. **Add images to components:**
   ```tsx
   <img src="/images/hero/children-playing.jpg" alt="Children at Jambo Rafiki" />
   ```

### Method 2: Using ImageWithFallback Component

For better error handling:
```tsx
import { ImageWithFallback } from './components/figma/ImageWithFallback';

<ImageWithFallback 
  src="/images/hero/hero-image.jpg" 
  alt="Description"
  className="w-full h-full object-cover rounded-xl"
/>
```

### Recommended Images

**Quality:** High resolution (1920x1080+), well-lit, showing children's faces (with consent)

- **Homepage Hero**: Group photo of children, smiling, playing, or learning
- **About Page**: 
  - Orphanage building/grounds
  - Founders/staff photos
  - Historical photos showing journey
- **Programs Page**: 
  - Children in classroom
  - Church service
  - Meal time
  - Farm/garden activities
  - Medical check-ups
- **Get Involved Page**: 
  - Volunteers with children
  - Donation impact photos
  - Success stories
- **Contact Page**: 
  - Office/admin building
  - Location map
  - Staff contact person

**Important:** Ensure you have proper consent/releases for all photos of children.

## 📝 Customization Guide

### Update Contact Information

**In `/pages/Contact/ContactInfoSection.tsx`:**
```tsx
// Replace placeholders with real contact info
const contactInfo = {
  email: "hopenationsministries8@gmail.com",
  phone: "+254 XXX XXX XXX",
  address: "P.O Box 311 – 40222, OYUGIS - KENYA",
  whatsapp: "+254 XXX XXX XXX"
};
```

**In `/components/Footer.tsx`:**
Update footer contact details and social media links.

### Modify Content

All content is in page component files:
- **Home**: `/pages/Home/HomePage.tsx` and section components
- **About**: `/pages/About/AboutPage.tsx` and section components
- **Programs**: `/pages/Programs/ProgramsPage.tsx` and section components
- **Get Involved**: `/pages/GetInvolved/GetInvolvedPage.tsx` and section components
- **Contact**: `/pages/Contact/ContactPage.tsx` and section components

Each page is split into modular sections for easy editing.

### Update Colors & Styling

**Global styles:** `/styles/globals.css`
**Tailwind config:** `/tailwind.config.js`

Current color scheme:
- Primary (Orange): `hsl(24, 90%, 55%)`
- Secondary (Pink): `hsl(340, 75%, 50%)`
- Accent (Golden): `hsl(45, 95%, 60%)`

To change colors, update `tailwind.config.js` theme section.

### Add New Pages

1. Create folder: `/pages/NewPage/`
2. Create components: `NewPage.tsx`, `HeroSection.tsx`, etc.
3. Create index: `/pages/NewPage/index.ts`
4. Add route in `/App.tsx`:
   ```tsx
   <Route path="/new-page" element={<NewPage />} />
   ```
5. Add navigation link in `/components/Navigation.tsx`
6. Add footer link in `/components/Footer.tsx`

## 🌍 Deployment

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variables (if using backend)
5. Deploy!

**URL:** `https://jambo-rafiki.vercel.app`

### Option 2: Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Add `_redirects` file for SPA routing:
   ```
   /* /index.html 200
   ```
5. Deploy!

### Option 3: GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add to `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/jambo-rafiki",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```

### Environment Variables

If using backend APIs, create `.env.local`:
```env
VITE_API_URL=https://api.jamborafiki.org
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_MPESA_SHORTCODE=your_mpesa_shortcode
```

Add these in your hosting platform's environment variables section.

## 📚 Documentation

- **PROJECT_DOCUMENTATION.md** - Complete technical documentation
- **BACKEND_OPTIONS.md** - Backend integration guide (Django vs Supabase)

## 🧪 Testing

### Manual Testing Checklist

- [ ] All pages load correctly
- [ ] Navigation works (desktop & mobile)
- [ ] Mobile hamburger menu opens/closes
- [ ] Forms validate input
- [ ] Responsive design on mobile, tablet, desktop
- [ ] Images load (or placeholders show)
- [ ] All CTAs are clickable
- [ ] Footer links work
- [ ] No console errors

### Browser Testing

Test on:
- Chrome/Edge (Chromium)
- Firefox
- Safari (Desktop & iOS)
- Mobile browsers (Android & iOS)

## 🐛 Troubleshooting

### Styling not appearing?

1. Ensure Tailwind v3 is installed:
   ```bash
   npm list tailwindcss
   ```
   Should show `3.4.1`

2. Check config files exist:
   - `tailwind.config.js`
   - `postcss.config.js`

3. Reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Build errors?

1. Clear cache:
   ```bash
   rm -rf dist node_modules .vite
   npm install
   npm run build
   ```

2. Check TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

### Routing issues on deployed site?

Add redirect rules:
- **Netlify:** Create `public/_redirects` with `/* /index.html 200`
- **Vercel:** Create `vercel.json` with rewrites configuration

## 📞 Contact Information

**Organization:** Jambo Rafiki Children Orphanage and Church Centre

**Contact Person:** Benjamin Oyoo Ondoro

**Email:** hopenationsministries8@gmail.com

**Phone:** [Add phone number]

**Address:** P.O Box 311 – 40222, OYUGIS - KENYA

**Website:** [Your deployed URL]

## 🤝 Contributing

To improve this website:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
6. Or contact the organization directly

## 📄 License

This website is created for Jambo Rafiki Children Orphanage and Church Centre. All content, branding, and imagery belong to the organization.

## 💖 Support Jambo Rafiki

Every contribution makes a real difference in a child's life!

### Ways to Help:

- **💰 Donate** - Financial contributions for children's needs (education, food, healthcare)
- **👦 Sponsor a Child** - Monthly commitment to support one child's journey
- **🙏 Volunteer** - Share your time and skills on-site in Kenya
- **🤝 Partner** - Organization partnerships and collaborations
- **🙏 Pray** - Join us in prayer for the children and staff
- **📢 Spread the Word** - Share our mission on social media

### Impact of Your Support:

- **$30/month** - Feeds one child for a month
- **$50/month** - Provides education for one child
- **$100/month** - Full sponsorship (education, food, healthcare)
- **$500** - School supplies for all 30 children
- **$1000** - Medical camp for the community

---

**Built with ❤️ for the children of Jambo Rafiki**

*"Restoring dignity, building resilience, and providing hope for orphaned and vulnerable children in Kenya."*

---

## 🏗️ Project Stats

- **Lines of Code:** ~8,000+
- **Components:** 60+ (45 UI + 15 custom)
- **Pages:** 5 main pages
- **Sections:** 30+ reusable sections
- **Icons:** 50+ from Lucide React
- **Build Time:** < 10 seconds
- **Bundle Size:** ~200KB (gzipped)

## 🗺️ Roadmap

### Phase 1: ✅ Complete (Current)
- [x] Frontend design and development
- [x] All 5 pages with content
- [x] Responsive design
- [x] Component library
- [x] Form validation

### Phase 2: ⏳ Next Steps
- [ ] Add real images and photos
- [ ] Backend integration (choose Supabase or Django)
- [ ] Contact form functionality
- [ ] Donation system (M-Pesa, Stripe)
- [ ] Newsletter signup

### Phase 3: 🔮 Future
- [ ] Blog/news section
- [ ] Child sponsorship portal
- [ ] Donor dashboard
- [ ] Multi-language support (Swahili/English)
- [ ] Admin CMS
- [ ] Impact reporting dashboard
- [ ] Mobile app (React Native)

---

**Version:** 1.0.0  
**Last Updated:** November 25, 2025  
**Status:** Production Ready (Frontend) | Backend Integration Pending