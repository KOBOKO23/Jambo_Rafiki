# Jambo Rafiki Children Orphanage & Church Centre - Website Documentation

## 📋 Project Overview

A complete React-based website for Jambo Rafiki Children Orphanage and Church Centre in Kenya. The website showcases their mission to care for 30 orphaned children and provide various ministry programs including church services, education, health care, and food security.

**Design Philosophy:** Human-Centered Design (HCD) with warm, inviting colors to encourage visitors to return and support the cause.

---

## 🏗️ Project Structure

```
Jambo_Rafiki/
├── App.tsx                      # Main application component with routing
├── main.tsx                     # Application entry point
├── index.html                   # HTML template
├── README.md                    # Project readme
├── package.json                 # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS v3 configuration
├── postcss.config.js           # PostCSS configuration
│
├── components/                  # Reusable components
│   ├── Navigation.tsx          # Site navigation header
│   ├── Footer.tsx              # Site footer
│   └── ui/                     # Shadcn UI components (45+ components)
│
├── pages/                       # Page-specific components
│   ├── Home/                   # Homepage sections
│   ├── About/                  # About page sections
│   ├── Programs/               # Programs page sections
│   ├── GetInvolved/            # Get Involved page sections
│   └── Contact/                # Contact page sections
│
└── styles/
    └── globals.css             # Global styles and Tailwind imports
```

---

## 📄 Core Files Documentation

### **Root Level Files**

#### `/App.tsx`
**Purpose:** Main application component with React Router configuration

**Key Features:**
- Sets up React Router with 5 main routes
- Includes Navigation and Footer on all pages
- Handles routing for: Home, About, Programs, Get Involved, Contact

**Routes:**
- `/` - HomePage
- `/about` - AboutPage
- `/programs` - ProgramsPage
- `/get-involved` - GetInvolvedPage
- `/contact` - ContactPage

---

#### `/main.tsx`
**Purpose:** Application entry point

**Features:**
- Renders App component into DOM
- Wraps app in BrowserRouter for routing
- Includes global styles import

---

#### `/index.html`
**Purpose:** HTML template

**Features:**
- Sets up meta tags and title
- Includes root div for React
- Links to main.tsx

---

### **Configuration Files**

#### `/package.json`
**Purpose:** Project dependencies and scripts

**Key Dependencies:**
- **React 18.3.1** - UI framework
- **React Router DOM 6.26.0** - Routing
- **Tailwind CSS 3.4.1** - Styling (stable version)
- **Lucide React 0.441.0** - Icon library
- **Radix UI** - Accessible UI primitives (20+ packages)
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.3** - Build tool

**Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

#### `/tailwind.config.js`
**Purpose:** Tailwind CSS v3 configuration

**Features:**
- Content paths for all TSX files
- Custom color theme (primary, secondary, accent colors)
- Custom border radius values
- Dark mode support
- Custom keyframe animations

---

#### `/postcss.config.js`
**Purpose:** PostCSS configuration for Tailwind

**Plugins:**
- `tailwindcss` - Processes Tailwind directives
- `autoprefixer` - Adds vendor prefixes

---

#### `/vite.config.ts`
**Purpose:** Vite build tool configuration

**Features:**
- React plugin for Fast Refresh
- Path aliases configuration
- Development server setup

---

#### `/tsconfig.json`
**Purpose:** TypeScript compiler configuration

**Settings:**
- Target: ES2020
- Module: ESNext
- Strict type checking enabled
- Path aliases for clean imports

---

### **Styles**

#### `/styles/globals.css`
**Purpose:** Global styles and CSS variables

**Features:**
- Tailwind CSS imports
- CSS custom properties for theming
- Typography defaults for all HTML elements
- Color variables (light/dark mode support)
- Smooth scrolling behavior

---

## 🧩 Component Documentation

### **Layout Components**

#### `/components/Navigation.tsx`
**Purpose:** Site navigation header

**Features:**
- Responsive navigation (desktop & mobile)
- Mobile hamburger menu with smooth animations
- Active route highlighting
- Links to all 5 main pages
- Sticky positioning on scroll
- Warm gradient background

**Navigation Links:**
1. Home
2. About
3. Programs
4. Get Involved
5. Contact

---

#### `/components/Footer.tsx`
**Purpose:** Site footer

**Features:**
- Three-column layout (desktop) / stacked (mobile)
- Quick links to all pages
- Contact information placeholder
- Social media links placeholder
- Copyright notice
- Warm color scheme matching site theme

---

### **UI Components** (`/components/ui/`)

Complete shadcn/ui component library with 45+ accessible, customizable components:

**Form Components:**
- `button.tsx` - Customizable buttons with variants
- `input.tsx` - Text input fields
- `textarea.tsx` - Multi-line text input
- `checkbox.tsx` - Checkboxes
- `radio-group.tsx` - Radio button groups
- `select.tsx` - Dropdown selects
- `switch.tsx` - Toggle switches
- `slider.tsx` - Range sliders
- `form.tsx` - Form wrapper with validation
- `label.tsx` - Form labels

**Layout Components:**
- `card.tsx` - Content cards
- `separator.tsx` - Divider lines
- `tabs.tsx` - Tabbed interfaces
- `accordion.tsx` - Collapsible sections
- `collapsible.tsx` - Show/hide content
- `resizable.tsx` - Resizable panels
- `sidebar.tsx` - Sidebar navigation
- `scroll-area.tsx` - Custom scrollbars

**Feedback Components:**
- `alert.tsx` - Alert messages
- `badge.tsx` - Status badges
- `progress.tsx` - Progress bars
- `skeleton.tsx` - Loading skeletons
- `sonner.tsx` - Toast notifications

**Overlay Components:**
- `dialog.tsx` - Modal dialogs
- `alert-dialog.tsx` - Confirmation dialogs
- `sheet.tsx` - Side panels
- `drawer.tsx` - Bottom drawers
- `popover.tsx` - Popovers
- `tooltip.tsx` - Tooltips
- `hover-card.tsx` - Hover cards

**Navigation Components:**
- `navigation-menu.tsx` - Nav menus
- `menubar.tsx` - Menu bars
- `dropdown-menu.tsx` - Dropdown menus
- `context-menu.tsx` - Right-click menus
- `breadcrumb.tsx` - Breadcrumbs
- `pagination.tsx` - Page navigation

**Data Display:**
- `table.tsx` - Data tables
- `avatar.tsx` - User avatars
- `carousel.tsx` - Image carousels
- `chart.tsx` - Chart components
- `calendar.tsx` - Date picker

**Utilities:**
- `utils.ts` - Helper functions (cn for className merging)
- `use-mobile.ts` - Mobile detection hook

---

## 📄 Page Documentation

### **Home Page** (`/pages/Home/`)

#### Structure:
- `HomePage.tsx` - Main page component
- `HeroSection.tsx` - Hero banner
- `VisionMissionSection.tsx` - Vision & mission
- `ProgramsSection.tsx` - Programs preview
- `StatsSection.tsx` - Impact statistics
- `CallToAction.tsx` - Donation/volunteer CTA

#### Features:
- Warm gradient hero with compelling headline
- Vision and mission statements
- Quick overview of all programs with icons
- Impact statistics (30 children, 5 programs, etc.)
- Strong call-to-action buttons
- Image placeholders throughout

---

### **About Page** (`/pages/About/`)

#### Structure:
- `AboutPage.tsx` - Main page component
- `HeroSection.tsx` - Page header
- `StorySection.tsx` - Organization story
- `VisionMissionSection.tsx` - Vision & mission details
- `ValuesSection.tsx` - Core values with icons
- `ObjectivesList.tsx` - Organizational objectives
- `StatusPlansSection.tsx` - Current status and future plans

#### Features:
- Comprehensive organization history
- Detailed vision and mission
- 6 core values with visual icons
- 5 main objectives
- Current status and future expansion plans
- Engaging layout with warm colors

---

### **Programs Page** (`/pages/Programs/`)

#### Structure:
- `ProgramsPage.tsx` - Main page component
- `HeroSection.tsx` - Page header
- `ProgramsGrid.tsx` - All 5 programs in grid
- `CoreActivities.tsx` - Daily activities list
- `ProgramsInAction.tsx` - Program highlights
- `CallToAction.tsx` - Support CTA

#### Programs Featured:
1. **Spiritual Development** - Church services, Bible study
2. **Education & Skills** - Academic support, vocational training
3. **Health & Nutrition** - Medical care, meals
4. **Food Security** - Farming, sustainability
5. **Community Outreach** - Local ministry, support

#### Features:
- Visual program cards with icons
- Detailed descriptions for each program
- Core activities timeline
- Real-world impact examples
- Support options

---

### **Get Involved Page** (`/pages/GetInvolved/`)

#### Structure:
- `GetInvolvedPage.tsx` - Main page component
- `HeroSection.tsx` - Page header
- `WaysToHelpSection.tsx` - Support options
- `UrgentNeedsSection.tsx` - Current needs list
- `ImpactSection.tsx` - Donation impact examples
- `ChallengesSection.tsx` - Current challenges
- `CallToAction.tsx` - Action buttons

#### Ways to Help:
1. **Donate** - Financial support
2. **Sponsor a Child** - Monthly sponsorship
3. **Volunteer** - On-site help
4. **Partner** - Organization partnerships
5. **Pray** - Prayer support
6. **Spread the Word** - Share mission

#### Features:
- Multiple engagement options
- Transparent needs list
- Impact visualization
- Current challenges section
- Multiple CTAs for different support types

---

### **Contact Page** (`/pages/Contact/`)

#### Structure:
- `ContactPage.tsx` - Main page component
- `HeroSection.tsx` - Page header
- `ContactInfoSection.tsx` - Contact details
- `ContactSection.tsx` - Quick contact options
- `ContactForm.tsx` - Message form (frontend only)
- `MapSection.tsx` - Location map placeholder
- `CallToAction.tsx` - Additional CTAs

#### Features:
- Contact form with validation (name, email, subject, message)
- Contact information display (location, email, phone placeholders)
- Quick contact buttons (email, phone, WhatsApp)
- Map placeholder for location
- Social media links
- Hours of operation placeholder

**Note:** Contact form currently frontend-only (no backend integration)

---

## 🎨 Design System

### **Color Palette**

**Primary Colors:**
- Primary: `hsl(24, 90%, 55%)` - Warm orange
- Secondary: `hsl(340, 75%, 50%)` - Pink accent
- Accent: `hsl(45, 95%, 60%)` - Golden yellow

**Semantic Colors:**
- Background: White / Dark gray
- Foreground: Dark / Light text
- Muted: Gray tones
- Border: Light borders

**Purpose:** Creates warm, inviting, human-centered feel appropriate for charity organization

---

### **Typography**

**Font Families:**
- System font stack for optimal performance
- Sans-serif primary font

**Hierarchy:**
- H1: Large, bold headlines
- H2: Section headers
- H3: Subsection headers
- Body: Readable paragraph text
- Small: Caption text

All defined in `/styles/globals.css`

---

### **Spacing & Layout**

**Container Widths:**
- Max-width: 1200px
- Padding: Responsive (4-6 spacing units)

**Grid Systems:**
- 3-column layouts for features
- 2-column layouts for content sections
- Single column on mobile

---

## 🚀 Development Guide

### **Getting Started**

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Open Browser:**
   ```
   http://localhost:5173
   ```

### **Build for Production**

```bash
npm run build
```

Output: `/dist` folder (ready for deployment)

### **Preview Production Build**

```bash
npm run preview
```

---

## 📝 Adding New Content

### **Adding a New Page**

1. Create folder in `/pages/NewPage/`
2. Create component files (HeroSection.tsx, etc.)
3. Create `index.ts` for exports
4. Add route in `/App.tsx`
5. Add link in `/components/Navigation.tsx`
6. Add link in `/components/Footer.tsx`

### **Adding New Sections**

1. Create component in appropriate page folder
2. Import into main page component
3. Add to page render

### **Updating Content**

- All content is in component files
- Search for placeholder text
- Update directly in TSX files
- Images: Replace placeholder comments with real image paths

---

## 🖼️ Image Integration Guide

### **Current State**
All images are placeholders with comments indicating where images should go.

### **Adding Images**

1. **Place images in `/public` folder:**
   ```
   /public/images/
   ├── hero-image.jpg
   ├── children/
   ├── programs/
   └── about/
   ```

2. **Reference in components:**
   ```tsx
   <img src="/images/hero-image.jpg" alt="Description" />
   ```

3. **Or use imports:**
   ```tsx
   import heroImage from './assets/hero-image.jpg';
   <img src={heroImage} alt="Description" />
   ```

### **Image Locations Needed**

- **Home Hero:** Main banner image
- **About Page:** Organization photos, team photos
- **Programs:** Program activities, children learning
- **Get Involved:** Volunteer photos, donation impact
- **Contact:** Location photo, team photo

---

## 🔧 Technology Stack

### **Frontend**
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Tailwind CSS v3** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **Vite** - Build tool

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility

---

## 📦 Deployment Options

### **Recommended Platforms:**

1. **Vercel** (Recommended)
   - Connect GitHub repo
   - Automatic deployments
   - Free tier available

2. **Netlify**
   - Drag & drop deployment
   - Free tier available

3. **GitHub Pages**
   - Free hosting
   - Requires build setup

### **Deployment Steps (Vercel Example):**

1. Push code to GitHub
2. Connect repo to Vercel
3. Configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

---

## 🐛 Troubleshooting

### **Styling Not Working**

**Issue:** Plain text, no colors/gradients

**Solution:**
- Ensure Tailwind CSS v3.4.1 is installed (not v4)
- Run `npm install`
- Check `tailwind.config.js` exists
- Check `postcss.config.js` exists
- Verify `globals.css` has Tailwind imports

### **Build Errors**

**Issue:** TypeScript errors

**Solution:**
- Check `tsconfig.json` is correct
- Run `npm install @types/react @types/react-dom`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### **Routing Not Working**

**Issue:** 404 on page refresh

**Solution:**
- Add `_redirects` file for Netlify: `/* /index.html 200`
- For Vercel: Add `vercel.json` with rewrites

---

## 🔐 Environment Setup

### **Not Currently Using Environment Variables**

If you add backend/API integration, create:

**`.env.local`** (Git ignored)
```
VITE_API_URL=your_api_url
VITE_CONTACT_EMAIL=your_email
```

**Access in code:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 📈 Future Enhancements

### **Backend Integration Needed For:**

1. **Contact Form Submission**
   - Email notifications
   - Form data storage
   - Auto-responders

2. **Donation Processing**
   - Payment gateway integration (M-Pesa, PayPal, Stripe)
   - Donation receipts
   - Donor database

3. **Volunteer Applications**
   - Application form submission
   - Application tracking
   - Email notifications

4. **Content Management**
   - Admin dashboard
   - Edit content without code changes
   - Upload images/documents

5. **Newsletter Signup**
   - Email list management
   - Automated emails

6. **Blog/News Section**
   - Post updates and stories
   - Event announcements

7. **Child Sponsorship**
   - Sponsor matching system
   - Progress reports
   - Payment tracking

---

## 📞 Support & Maintenance

### **Updating Dependencies**

```bash
# Check outdated packages
npm outdated

# Update specific package
npm install package-name@latest

# Update all (caution)
npm update
```

### **Code Quality**

```bash
# Run linter
npm run lint

# Format code (if prettier configured)
npm run format
```

---

## 📄 License

This project is proprietary to Jambo Rafiki Children Orphanage and Church Centre.

---

## 👥 Contact

**Jambo Rafiki Children Orphanage & Church Centre**
- Location: Kenya
- Website: [Your deployed URL]

---

## ✅ Current Status

**✓ Completed:**
- All 5 pages fully functional
- Responsive design (mobile & desktop)
- Complete UI component library
- Navigation and routing
- Form validation (frontend)
- Warm, inviting design system
- Performance optimized

**⏳ Pending:**
- Real image integration
- Backend integration (contact forms, donations)
- Content finalization
- SEO optimization
- Analytics integration
- Deployment

---

**Last Updated:** November 25, 2025
**Version:** 1.0.0
**Status:** Production Ready (Frontend)
