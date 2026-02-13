# 🚀 Quick Setup Instructions

## Prerequisites
- Node.js 18 or higher
- npm (comes with Node.js)

## Installation Steps

### 1. Navigate to Project Directory
```bash
cd cyber-ireland-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- Next.js 14.1
- React 18
- TypeScript
- Tailwind CSS
- Recharts (for charts)
- Framer Motion (for animations)
- Lucide React (for icons)

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open in Browser
Visit: **http://localhost:3000**

The dashboard will automatically open and display the interactive Cyber Ireland data.

## ✨ Features to Explore

### Click-to-Source Verification
1. Click on any metric card (Total Jobs, Total Firms, etc.)
2. A modal will show the source PDF page
3. See the exact text from the report highlighted in red

### Geospatial Drill-Down  
1. Hover over regions on the Ireland map
2. See filtered data for Dublin, Cork, Galway, or Limerick
3. View unique insights for each region

### 2030 Projection Slider
1. Drag the year slider at the bottom of the growth chart
2. Watch metrics update from 2021 to 2030
3. See real-time gap analysis

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📦 Project Structure

```
cyber-ireland-dashboard/
├── pages/
│   ├── index.tsx          # Main dashboard
│   └── _app.tsx           # App wrapper
├── lib/
│   └── data.ts            # PDF data extracted
├── styles/
│   └── globals.css        # Global styles
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Fonts**: Space Mono + DM Sans (from Google Fonts)

## 🌐 Deployment

### Vercel (Easiest)
```bash
npm i -g vercel
vercel
```

### Netlify
1. Connect your GitHub repo
2. Build command: `npm run build`
3. Publish directory: `.next`

## ⚡ Performance Notes

- First load is optimized with Next.js
- All animations use CSS and Framer Motion
- Charts render client-side
- No external API calls (all data is static)
- Fast page transitions

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process on port 3000
npx kill-port 3000

# Or run on different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📱 Mobile View

The dashboard is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px+)

## 🎯 Key Features Implemented

✅ PDF data extraction and transformation  
✅ Interactive metric cards with click-to-source  
✅ Regional map with hover filtering  
✅ Year slider with growth projections  
✅ Split-screen PDF verification modal  
✅ Professional, non-generic design  
✅ Smooth animations throughout  
✅ Fully responsive layout  

## 💡 Tips

- **Hover** over metric cards to see "Click to view source"
- **Click** metric cards to open PDF verification  
- **Hover** over Ireland map regions for details
- **Drag** the year slider to see projections
- Use **dark mode** for best visual experience

---

Need help? Check README.md for full documentation.
