# GitLens AR 

## Overview

GitLens AR is an innovative web application that transforms the way developers visualize and understand GitHub repositories through Augmented Reality. By combining the power of Three.js for 3D visualization with GitHub's API, this project creates an immersive and interactive experience for exploring codebases.

## Features 

### 1. 3D Repository Visualization
- **Branch Trees**: View your repository's branch structure in an intuitive 3D space
- **Interactive Navigation**: Zoom, rotate, and explore your codebase from any angle
- **Real-time Updates**: Visualizations update automatically as your repository changes

### 2. Contributor Insights
- **Activity Heatmap**: GitHub-style contribution visualization showing activity patterns
- **Contributor Avatars**: Visual representation of team members and their contributions
- **Timeline View**: Chronological display of commits and changes

### 3. Enhanced User Experience
- **Responsive Design**: Seamlessly adapts to any screen size or device
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Performance Optimized**: Fast loading and smooth interactions

### 4. AR Features
- **Immersive View**: Experience your codebase in augmented reality
- **Spatial Understanding**: Better comprehend project structure through 3D visualization
- **Interactive Elements**: Click, hover, and interact with repository elements in AR

## Technology Stack 

- **Frontend**: Next.js, React, TypeScript
- **3D Visualization**: Three.js
- **Styling**: Tailwind CSS
- **API Integration**: GitHub API via Octokit
- **State Management**: React Hooks
- **Performance**: Dynamic imports and lazy loading

## Development Features 

### GitHub Copilot Integration

GitLens AR leverages GitHub Copilot's AI capabilities throughout its development process:

#### 1. Code Assistance
- **Intelligent Autocomplete**: Copilot suggests context-aware code completions for:
  - Three.js 3D scene setup and animations
  - React component structure and hooks
  - TypeScript type definitions
  - Tailwind CSS class combinations

#### 2. Interactive Development
- **Copilot Chat**: Utilized for:
  - Debugging complex Three.js scenarios
  - Optimizing AR performance
  - Solving TypeScript type challenges
  - Improving accessibility implementations

#### 3. Model Switching
- **Contextual AI Models**: Different models for various tasks:
  - Performance-focused suggestions for 3D rendering
  - Accessibility-oriented code for UI components
  - Documentation generation for API endpoints

## Usability and User Experience 

### 1. Intuitive Interface
- Clear visual hierarchy and navigation
- Consistent design language throughout
- Meaningful feedback for user actions
- Progressive disclosure of complex features

### 2. Performance Optimization
- Lazy loading of 3D components
- Efficient state management
- Optimized asset loading
- Smooth animations and transitions

### 3. Error Handling
- Graceful fallbacks for AR features
- Clear error messages
- Guided recovery steps
- State persistence

## Accessibility Features 

### 1. WCAG 2.1 Compliance
- **Screen Reader Support**
  - ARIA labels for 3D elements
  - Meaningful alt text for visualizations
  - Role and state announcements

- **Visual Accessibility**
  - High contrast mode support
  - Resizable text without breaking layout
  - Color blind friendly visualization options

### 2. Responsive Adaptation
- Mobile-first design approach
- Touch-friendly controls
- Adaptive layouts for different devices
- Orientation support for AR features

## Writing Quality 

### 1. Documentation Standards
- Clear and concise API documentation
- Comprehensive JSDoc comments
- Meaningful commit messages
- Detailed pull request templates

### 2. Code Quality
- Consistent coding style (ESLint + Prettier)
- TypeScript strict mode
- Comprehensive test coverage
- Regular code reviews

### 3. Content Quality
- Clear user instructions
- Consistent terminology
- Technical accuracy
- Regular content updates

## Author

Created by Akhilesh Yadav

## Getting Started 

1. Clone the repository:
```bash
git clone https://github.com/YadavAkhileshh/gitlens-ar.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```bash
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token
```

4. Run the development server:
```bash
npm run dev
```

## Usage 

1. Enter a GitHub repository URL in the input field
2. Click "View in AR" to generate the visualization
3. Use mouse/touch controls to navigate:
   - Left click + drag to rotate
   - Right click + drag to pan
   - Scroll to zoom
4. Click on elements to view detailed information
5. Use the control panel to customize the visualization

## Why GitLens AR? 

Traditional code visualization tools often fall short in providing a comprehensive understanding of complex codebases. GitLens AR addresses this by:

1. **Spatial Understanding**: Leveraging human spatial cognition to better understand code relationships
2. **Intuitive Navigation**: Making it easier to explore and understand repository structure
3. **Enhanced Collaboration**: Providing a shared visual context for team discussions
4. **Better Learning**: Helping new developers understand project architecture quickly

## Contributing 

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License 

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 

If you find this project helpful, consider buying me a coffee! Your support helps maintain and improve GitLens AR.

## Connect With Us 

- GitHub: [YadavAkhileshh](https://github.com/YadavAkhileshh)
- Twitter: [_Yakhil](https://x.com/_Yakhil)
- LinkedIn: [yakhilesh](https://www.linkedin.com/in/yakhilesh/)

---

Made with by Akhilesh Yadav
