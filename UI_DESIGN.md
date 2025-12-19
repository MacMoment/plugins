# Kodella.ai UI/UX Overview

## Design Philosophy

Kodella.ai features a **dark, minimalistic, high-tech** design that prioritizes:
- Clean, uncluttered interfaces
- High contrast for readability
- Smooth animations and transitions
- Professional developer-focused aesthetic
- Intuitive navigation and workflows

## Color Palette

### Primary Colors
- **Primary Purple**: `#8b5cf6` - Main brand color, used for CTAs and highlights
- **Primary Dark**: `#7c3aed` - Hover states and darker accents
- **Primary Light**: `#a78bfa` - Gradients and lighter accents

### Background Colors
- **Deep Black**: `#0a0a0a` - Main background
- **Surface Dark**: `#1a1a1a` - Cards, panels, elevated surfaces
- **Surface Hover**: `#2a2a2a` - Hover states on surfaces

### Text Colors
- **Text Primary**: `#ffffff` - Main text
- **Text Secondary**: `#a0a0a0` - Secondary information
- **Text Muted**: `#6b7280` - Disabled or de-emphasized text

### Semantic Colors
- **Success Green**: `#10b981` - Success states, completed plugins
- **Error Red**: `#ef4444` - Errors, delete actions
- **Warning Orange**: `#f59e0b` - Warnings, draft states

### Borders
- **Border**: `#2a2a2a` - Subtle borders between elements

## Typography

- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Headings**: Bold weight, larger sizes (2rem - 4rem)
- **Body Text**: Regular weight, 1rem base size
- **Code**: Monospace font (Courier New) with slight background

## Page Layouts

### Landing Page
```
┌──────────────────────────────────────────────────────┐
│                   [Logo: Kodella.ai]                  │
├──────────────────────────────────────────────────────┤
│                                                       │
│               KODELLA.AI (gradient purple)            │
│            AI-Powered Plugin Creation                 │
│                                                       │
│   Create, improve, and deploy plugins with AI        │
│           Fast, intelligent, and effortless           │
│                                                       │
│     [Get Started Button]  [Sign In Button]          │
│                                                       │
├──────────────────────────────────────────────────────┤
│                 Why Choose Kodella.ai?                │
│                                                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ Sparkles│  │ Lightning│  │  Code   │             │
│  │   AI    │  │  Fast   │  │  Smart  │             │
│  │ Powered │  │ Generate│  │ Improve │             │
│  └─────────┘  └─────────┘  └─────────┘             │
│                                                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ Shield  │  │ Trending│  │Download │             │
│  │ Secure  │  │ Version │  │  Easy   │             │
│  │Reliable │  │ Control │  │ Export  │             │
│  └─────────┘  └─────────┘  └─────────┘             │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Dashboard
```
┌──────────────────────────────────────────────────────┐
│ [Logo] Dashboard  Create Plugin  💰 1,000  👤  🚪    │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Welcome back, Username!                             │
│  Manage your AI-powered plugins                      │
│                              [+ Create New Plugin]   │
│                                                       │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐         │
│  │ 📊        │ │ ✅        │ │ 🕐        │         │
│  │    5      │ │    4      │ │   100     │         │
│  │  Total    │ │ Completed │ │  Tokens   │         │
│  │ Plugins   │ │           │ │   Used    │         │
│  └───────────┘ └───────────┘ └───────────┘         │
│                                                       │
│  Your Plugins                                        │
│  ┌─────────────────────────────────────────────┐    │
│  │ Email Validator          [completed] 🕐 2d  │    │
│  │ Validates email addresses...                │    │
│  │ 💰 45 tokens   [Edit] [Download] [Delete]  │    │
│  └─────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────┐    │
│  │ Data Parser              [completed] 🕐 5d  │    │
│  │ Parses JSON and XML data...                 │    │
│  │ 💰 62 tokens   [Edit] [Download] [Delete]  │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Create Plugin Page
```
┌──────────────────────────────────────────────────────┐
│ [Logo] Dashboard  Create Plugin  💰 1,000  👤  🚪    │
├──────────────────────────────────────────────────────┤
│                                                       │
│         ✨ Create New Plugin                         │
│    Describe your plugin and let AI generate it      │
│                                                       │
│  ┌─────────────────────┐  ┌──────────────────┐      │
│  │                     │  │  💡 Tips for     │      │
│  │ Plugin Name *       │  │  Better Results  │      │
│  │ [____________]      │  │                  │      │
│  │                     │  │ • Be specific    │      │
│  │ Description         │  │ • Include        │      │
│  │ [____________]      │  │   examples       │      │
│  │                     │  │ • Mention error  │      │
│  │ Requirements *      │  │   handling       │      │
│  │ [____________]      │  │ • Specify API    │      │
│  │ [____________]      │  │ • Describe I/O   │      │
│  │ [____________]      │  │                  │      │
│  │                     │  └──────────────────┘      │
│  │ AI Model           │                             │
│  │ [GPT-4 ▼]          │                             │
│  │                     │                             │
│  │ 💰 1,000 tokens     │                             │
│  │    available        │                             │
│  │                     │                             │
│  │ [✨ Generate Plugin]│                             │
│  └─────────────────────┘                             │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Plugin Editor
```
┌──────────────────────────────────────────────────────┐
│ [Logo] Dashboard  Create Plugin  💰 955  👤  🚪      │
├──────────────────────────────────────────────────────┤
│  ← Back to Dashboard                                 │
│                                                       │
│  [Email Validator_____________]                      │
│  [Validates email addresses...]                      │
│  [Save Details]                                      │
│                 [✨ Improve] [🔧 Fix] [⬇ Download]  │
│                                                       │
│  ┌─────────────────────────┐  ┌──────────────────┐  │
│  │ 💻 Plugin Code (v2)     │  │ 🕐 Version      │  │
│  │                         │  │    History       │  │
│  │ function validateEmail( │  │                  │  │
│  │   email) {              │  │ v2  2 days ago   │  │
│  │   const regex = /^[...] │  │ Improved...      │  │
│  │   return regex.test(    │  │ 45 tokens        │  │
│  │     email);              │  │                  │  │
│  │ }                        │  │ v1  5 days ago   │  │
│  │                         │  │ Initial...       │  │
│  │ // Additional code...   │  │ 38 tokens        │  │
│  │                         │  │                  │  │
│  └─────────────────────────┘  └──────────────────┘  │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Tokens Page
```
┌──────────────────────────────────────────────────────┐
│ [Logo] Dashboard  Create Plugin  💰 1,000  👤  🚪    │
├──────────────────────────────────────────────────────┤
│                                                       │
│  💰 Token Management                                 │
│  Purchase tokens to power your plugin creation       │
│                                    ┌──────────────┐  │
│                                    │  Current     │  │
│                                    │   Balance    │  │
│                                    │              │  │
│                                    │   1,000      │  │
│                                    │   tokens     │  │
│                                    └──────────────┘  │
│                                                       │
│  Token Packages                                      │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐         │
│  │ Starter   │ │ Creator   │ │   Pro     │         │
│  │   Pack    │ │   Pack    │ │   Pack    │         │
│  │           │ │ [Popular] │ │           │         │
│  │ 💰 1,000  │ │ 💰 5,000  │ │ 💰 15,000 │         │
│  │   $4.99   │ │  $19.99   │ │  $49.99   │         │
│  │           │ │           │ │           │         │
│  │[Purchase] │ │[Purchase] │ │[Purchase] │         │
│  └───────────┘ └───────────┘ └───────────┘         │
│                                                       │
│  🕐 Transaction History                              │
│  ┌─────────────────────────────────────────────┐    │
│  │ ↗ Token purchase - 1,000 tokens    +1,000  │    │
│  │   Dec 19, 2024 3:45 PM                      │    │
│  └─────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────┐    │
│  │ ↘ Plugin generation: Email Validator  -45  │    │
│  │   Dec 17, 2024 10:20 AM                     │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Profile Page
```
┌──────────────────────────────────────────────────────┐
│ [Logo] Dashboard  Create Plugin  💰 1,000  👤  🚪    │
├──────────────────────────────────────────────────────┤
│                                                       │
│  👤 Profile Settings                                 │
│                                                       │
│  ┌──────────────────────┐  ┌──────────────────┐     │
│  │ Account Information  │  │ Account Stats    │     │
│  │                      │  │                  │     │
│  │ 📧 Email            │  │ Member Since:    │     │
│  │ [user@email.com]    │  │ Jan 15, 2024     │     │
│  │                      │  │                  │     │
│  │ 👤 Username         │  │ Total Plugins:   │     │
│  │ [username]          │  │ 5                │     │
│  │                      │  │                  │     │
│  │ ─────────────────   │  │ Completed:       │     │
│  │ Change Password     │  │ 4                │     │
│  │                      │  │                  │     │
│  │ 🔒 Current Password │  │ Tokens Used:     │     │
│  │ [____________]      │  │ 245              │     │
│  │                      │  │                  │     │
│  │ 🔒 New Password     │  │ Tokens Bought:   │     │
│  │ [____________]      │  │ 1,000            │     │
│  │                      │  │                  │     │
│  │ 🔒 Confirm Password │  └──────────────────┘     │
│  │ [____________]      │                            │
│  │                      │                            │
│  │ [💾 Save Changes]   │                            │
│  └──────────────────────┘                            │
│                                                       │
└──────────────────────────────────────────────────────┘
```

## UI Components

### Buttons
- **Primary**: Purple gradient background, white text, hover lift effect
- **Secondary**: Dark surface with border, hover to lighter surface
- **Ghost**: Transparent, text color, hover to surface background
- **Danger**: Red background for destructive actions

### Cards
- Dark surface background (#1a1a1a)
- Subtle border (#2a2a2a)
- Hover state: Border changes to primary purple
- Slight elevation on hover (translateY effect)
- Rounded corners (0.75rem)

### Inputs & Forms
- Dark surface background
- Border that highlights on focus (purple glow)
- White text
- Placeholder in muted color
- Full-width by default

### Navigation Header
- Sticky position at top
- Translucent dark background with blur
- Brand logo on left
- Navigation items center/right
- Token balance prominently displayed
- Profile and logout on far right

### Animations
- **Fade In**: Elements fade in with slight upward movement
- **Hover Effects**: Subtle scale or translate on interactive elements
- **Loading Spinners**: Rotating purple gradient border
- **Transitions**: Smooth 0.2s ease for all state changes

## Responsive Design

### Desktop (>768px)
- Full sidebar navigation
- Multi-column layouts
- Larger text and spacing
- Hover effects enabled

### Tablet (768px - 1024px)
- Condensed navigation
- Adjusted grid layouts (2 columns)
- Slightly smaller spacing

### Mobile (<768px)
- Single column layouts
- Hamburger menu or bottom navigation
- Touch-optimized button sizes (min 44px)
- Simplified cards
- Hide less critical information

## Accessibility

- High contrast ratios for readability
- Focus indicators on all interactive elements
- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader friendly

## Brand Elements

### Logo
- "Kodella.ai" in gradient purple
- Bold font weight (700)
- Can include sparkle icon (✨) for emphasis

### Icons
- Lucide React icon library
- Consistent 18-24px sizes
- Aligned with text baseline
- Color matches context (primary for actions, muted for info)

### Loading States
- Spinner with purple gradient border
- Skeleton screens for content loading
- Progress indicators for operations

### Empty States
- Large centered icons
- Friendly messages
- Clear call-to-action buttons
- Suggestions for next steps

## Design Tokens (CSS Variables)

All colors and spacing use CSS custom properties defined in `:root`:
```css
--primary: #8b5cf6
--background: #0a0a0a
--surface: #1a1a1a
--spacing-md: 1rem
--radius-lg: 0.75rem
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5)
```

This ensures consistency across the entire application and makes theming easy.

---

**The Kodella.ai UI is designed to feel modern, professional, and developer-friendly while maintaining excellent usability and aesthetic appeal.**
