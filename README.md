# WanderLens 📸 - Travel Photography Blog

WanderLens is a modern, interactive travel photography blog built with Next.js and Framer Motion. It showcases destinations, experiences, and stunning photography with beautiful animations and a responsive design.

![WanderLens Preview](https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=2669&auto=format&fit=crop)

## ✨ Features

- 🌓 Dark/Light mode support
- 🎨 Smooth animations and transitions using Framer Motion
- 📱 Fully responsive design
- 🖼️ Interactive photo gallery with modal views
- 💬 Comment system with likes and replies
- 🌍 Destination and experience showcases
- 🎯 Smooth scroll navigation
- 📊 Rating and review system

## 🚀 Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- CSS-in-JS for styling

## 🛠️ Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/wanderlens.git
cd wanderlens
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
wanderlens/
├── app/                   # Next.js app directory
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Main application page
│   └── globals.css       # Global styles
├── public/               # Static assets
│   ├── file.svg
│   ├── globe.svg
│   └── ...
├── package.json          # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

## 🎨 Key Components

- **Destinations**: Showcase of featured travel destinations with detailed information
- **Experiences**: User experiences and stories with ratings and reviews
- **Photo Gallery**: Responsive grid layout with modal view for detailed photo information
- **Comments System**: Interactive comment system with likes and replies
- **Navigation**: Smooth scroll navigation with mobile-responsive menu

## 🔧 Customization

### Adding New Destinations

Add new destinations to the `destinations` array in `app/page.tsx`:

```typescript
const destinations: Destination[] = [
  {
    id: number,
    name: string,
    description: string,
    image: string,
    country: string
  },
  // ...
];
```

### Adding New Experiences

Add new experiences to the `experiences` array in `app/page.tsx`:

```typescript
const experiences: Experience[] = [
  {
    id: number,
    title: string,
    description: string,
    date: string,
    image: string,
    rating: number,
    totalRatings: number
  },
  // ...
];
```

## 📱 Responsive Design

WanderLens is built with a mobile-first approach and includes:
- Responsive grid layouts
- Mobile navigation menu
- Adaptive image sizing
- Touch-friendly interactions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ using Next.js and Framer Motion
