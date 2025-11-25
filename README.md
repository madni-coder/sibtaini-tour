# Sibtaini Tours & Travels

A beautiful, responsive website for Hajj and Umrah tour packages built with Next.js and Tailwind CSS.

## Features

- 🕌 Beautiful card-based layout for tour packages
- 📱 Fully responsive (Mobile, Tablet, Desktop)
- 🎨 Attractive color schemes with Islamic green and gold accents
- ✈️ Route information: Raipur to Mumbai
- 💰 Clear pricing display in Indian Rupees
- 📅 Date and month information for each package
- ⚡ Built with Next.js 14 and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd /Volumes/Softwares/st
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates an optimized production build
- `npm start` - Runs the production server
- `npm run lint` - Runs ESLint to check code quality

## Project Structure

```
st/
├── src/
│   ├── app/
│   │   ├── layout.js       # Root layout component
│   │   ├── page.js         # Home page with packages
│   │   └── globals.css     # Global styles
│   └── components/
│       └── PackageCard.js  # Reusable package card component
├── public/                 # Static assets
├── package.json
├── tailwind.config.js      # Tailwind CSS configuration
└── next.config.js          # Next.js configuration
```

## Customization

### Adding New Packages

Edit `src/app/page.js` and add new package objects to the `packages` array:

```javascript
{
  id: 7,
  title: 'Your Package Name',
  month: 'Month',
  date: 'Date Range',
  year: 2026,
  amount: 150000,
  route: 'Raipur to Mumbai',
  features: [
    'Feature 1',
    'Feature 2',
    // Add more features
  ]
}
```

### Changing Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      'islamic-green': '#00854D',
      'gold': '#D4AF37',
    },
  },
}
```

## Technologies Used

- **Next.js 14** - React framework for production
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Inter Font** - Modern, clean typography

## Contact

For inquiries about Sibtaini Tours & Travels packages, please contact:
- 📞 Phone: +91 XXXX-XXXXXX
- 📧 Email: info@sibtainitours.com
- 📍 Location: Raipur, Chhattisgarh

## License

© 2025 Sibtaini Tours & Travels. All rights reserved.
