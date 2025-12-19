# GitLens AR 🚀

> **A completely custom-built 3D GitHub repository visualizer** with unique animations and interactive elements

**GitLens AR** is an original implementation that transforms GitHub repositories into stunning three-dimensional visualizations. Built from scratch with custom algorithms for rendering branches, commits, contributors, and pull requests in an immersive 3D space.

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-Latest-blue)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎯 What Makes This Unique?

This project features **100% custom-designed visualization algorithms** and original implementations:

- **🌳 3D Branch Visualization** - See repository branches as interactive 3D cylinders
- **💫 Commit Timeline** - Explore commit history floating in 3D space
- **👥 Contributor Avatars** - View contributor activity with beautiful particle effects
- **🔄 Pull Request Flow** - Visualize PR status with curved connections
- **📊 Repository Stats** - Real-time stats for stars, forks, issues, and PRs
- **🎨 Modern UI** - Sophisticated slate/indigo color scheme with smooth animations
- **♿ Accessible** - High contrast mode and full keyboard navigation support

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **3D Graphics:** Three.js + React Three Fiber + Drei
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **API:** GitHub REST API (Octokit)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YadavAkhileshh/GitLens-AR.git
   cd GitLens-AR
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_GITHUB_TOKEN=your_github_personal_access_token
   ```

   To get a GitHub token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Select scopes: `repo`, `read:user`
   - Copy the token and paste it in `.env`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

1. Enter a GitHub repository URL (e.g., `https://github.com/username/repo`)
2. Click "View in AR"
3. Explore the 3D visualization:
   - **Drag** to rotate the view
   - **Scroll** to zoom in/out
   - **Hover** over elements for details
   - **Click** the high contrast button for accessibility

## 🎨 Color Scheme

The redesigned UI uses a sophisticated, human-crafted color palette:

- **Background:** Deep slate gradients (`slate-900` to `slate-950`)
- **Primary Accent:** Indigo (`indigo-500`, `indigo-600`)
- **Secondary Accent:** Emerald for success states
- **Text:** Slate scale for hierarchy (`slate-50` to `slate-500`)

## 📁 Project Structure

```
GitLens-AR/
├── app/
│   ├── globals.css          # Global styles with custom color scheme
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main landing page
├── components/
│   ├── ARVisualization.tsx   # 3D visualization component
│   └── Footer.tsx            # Footer with social links
├── types/
│   └── three-stdlib.d.ts     # Type definitions
├── public/                   # Static assets
└── tsconfig.json             # TypeScript configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   [Three.js](https://threejs.org/) - 3D graphics library
-   [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - React renderer for Three.js
-   [Octokit](https://github.com/octokit/octokit.js) - GitHub REST API client
-   [Next.js](https://nextjs.org/) - React framework
