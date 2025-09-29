# W.I.N — Wealth Insured Navigation
<img src=".\images\icon.png" alt="rice" width="100" align="right"/>
A modern, minimalist website providing financial literacy resources for students and young adults. Built with clean design principles and optimized for GitHub Pages hosting.

## Overview

W.I.N (Wealth Insured Navigation) is a comprehensive platform designed to make financial literacy accessible to students and young adults. The website features downloadable resources, team information, and an integrated comments system for community engagement.

## Key Features

- **Clean Light Theme**: Professional, minimalist design with a consistent light color palette
- **Fully Responsive**: Optimized for all devices and screen sizes with mobile-first approach
- **Static Site Ready**: Built specifically for GitHub Pages hosting with no server dependencies
- **Comments System**: Integrated Giscus comments for static site functionality
- **Performance Optimized**: Fast loading with lazy loading, smooth animations, and efficient code
- **Accessibility Compliant**: WCAG guidelines followed with proper focus management and semantic HTML

## Project Structure

```
win-website/
├── index.html              # Homepage with hero section and resources
├── about.html              # About us page with team information
├── styles.css              # Main stylesheet with CSS custom properties
├── script.js               # JavaScript functionality and interactions
├── sw.js                   # Service worker for offline functionality
├── README.md               # Project documentation
├── generate-placeholders.html # Tool for creating team placeholder images
├── images/                 # Team member photos
│   ├── rafaey.jpeg        # Rafaey's professional headshot
│   ├── arian.jpg          # Arian's professional headshot
│   └── icon.png           # W.I.N icon
├── WIN FINANCE BOOK PACK.pdf # Financial literacy resource
└── WIN RESOURCE PACK.pdf  # Student resource pack
```

### Color Scheme
The website uses CSS custom properties for easy customization. Main colors are defined in the `:root` selector:

```css
:root {
    --primary-color: #ffc000;      /* Main yellow/gold */
    --secondary-color: #000000;    /* Black accent */
    --accent-color: #50C878;       /* Green accent */
    --text-primary: #202124;       /* Dark text */
    --text-secondary: #5F6368;     /* Secondary text */
    --bg-primary: #FFFFFF;         /* White background */
    --bg-secondary: #F8F9FA;       /* Light gray background */
}
```

## Technical Details

### Browser Support
- Chrome 60 and above
- Firefox 60 and above
- Safari 12 and above
- Edge 79 and above
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Features
- **Lazy Loading**: Images load only when needed
- **Optimized Assets**: Minified CSS and efficient JavaScript
- **Service Worker**: Offline functionality and caching
- **Responsive Images**: Optimized for different screen sizes
- **Smooth Animations**: Hardware-accelerated transitions

### Accessibility Features
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios

## License

Copyright 2025 W.I.N. All rights reserved.

This project is proprietary software. Unauthorized copying, distribution, or modification is prohibited.