# Echoes of Becoming

> A cinematic personal journey timeline — the story of a developer becoming.

**Echoes of Becoming** is not a standard developer portfolio. It is an interactive, cinematic storytelling experience designed to document the emotional and technical journey of growth. Built with an extreme focus on pacing, spatial aesthetics, and performance, this project turns a resume into a narrative.

## 🌟 Key Features

- **High-Performance 3D Environment**: Powered by an optimized Three.js BufferGeometry particle system that dynamically scales to the user's hardware and pauses when off-screen.
- **Cinematic Timeline**: A responsive SVG-powered timeline that draws itself as you scroll, guiding you through a narrative of milestones.
- **Micro-Interactions & Easter Eggs**: Custom magnetic cursor, hover-triggered "whispers", Konami code badges, and scroll-depth lighting interpolation.
- **Deep Accessibility**: Total respect for WCAG contrast ratios, semantic HTML hierarchies, and a robust `@media (prefers-reduced-motion: reduce)` protocol that preserves the emotional storytelling even when CSS animations are disabled natively by the OS.
- **Responsive Architecture**: Gracefully degrades from an immersive desktop 3D experience to a touch-optimized native mobile layout.

## 🛠 Tech Stack

This project is built purely with foundational web technologies, optimized for 60fps performance without the overhead of heavy frameworks:

- **HTML5**: Semantic and accessible structure.
- **Vanilla CSS**: CSS custom properties, hardware-accelerated 3D transforms (`rotateX`, `translateZ`), and glassmorphism (`backdrop-filter`).
- **Vanilla JavaScript (ES6+)**: Core logic, event debouncing, and intersection observers.
- **GSAP (GreenSock)**: Professional-grade animation sequencing and `ScrollTrigger` logic for scrubbed timelines (e.g., the "Turning Point" clip-path wipe).
- **Three.js**: Lightweight 3D particle systems and orbital holograms.
- **Lenis**: Buttery smooth momentum scrolling on desktop.

## 🚀 How to Run Locally

Because this project relies entirely on raw HTML, CSS, and JS with no build tools or external dependencies to install, running it locally is instantaneous:

1. Clone or download this repository.
2. Double-click the `index.html` file to open it in your browser.
*(For the best experience, open it in a modern browser like Chrome, Firefox, or Safari).*

## 🌍 Deployment Instructions

Deploying "Echoes of Becoming" is incredibly straightforward due to its static nature. You do not need to configure any build commands or output directories.

### Option A: GitHub Pages (Recommended)
1. Push your code to a GitHub repository.
2. Go to your repository's **Settings** > **Pages**.
3. Under **Build and deployment**, set the Source to **Deploy from a branch**.
4. Select the `main` branch and the `/ (root)` folder.
5. Click **Save**. Your site will be live within a few minutes.

### Option B: Vercel / Netlify
1. Log into your Vercel or Netlify dashboard.
2. Click **Add New Project** and import your GitHub repository.
3. Leave all build commands and output directories **blank** (or default).
4. Click **Deploy**.

## 🎨 Design Philosophy

> *"The best journeys are still under construction."*

This site was explicitly designed to reject the sterile, checklist-style portfolio standard. Every animation is timed using custom cubic-bezier curves to give the narrative physical weight. The UI relies heavily on negative space, deep grayscales contrasted with vibrant cyans (`#00D4FF`) and limes (`#C8FF00`), and a typography hierarchy pairing the technical *Space Mono* with the emotional, expressive *Playfair Display*.
