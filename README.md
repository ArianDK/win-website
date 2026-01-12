# Economic & Finance Association (EFA) + W.I.N
<img src=".\images\icon.png" alt="EFA / WIN icon" width="96" align="right"/>
A modern, responsive site for the Economic & Finance Association (EFA) at Houston City College, with the legacy W.I.N experience preserved as a subpage.

## Overview

- **EFA Homepage**: Yellow/black modern landing page with About, Leadership, Founders, and Contact/Join sections.
- **WIN Subpage**: The original W.I.N (Wealth Insured Navigation) site remains intact under `/win/` with its PDFs and comments.
- **Routing**: Static HTML; root `index.html` is EFA. WIN lives at `win/index.html` with a “Back to EFA” link.

## Key Features

- **Modern EFA Theme**: Sticky blurred navbar, hero, value cards, leadership grid, founders, contact form.
- **Reusable Data**: Leadership and founder data rendered from a single source (`efa.js`).
- **Responsive & Accessible**: Keyboard-friendly nav, focus styles, smooth scrolling, section reveal animations.
- **WIN Preserved**: Original WIN resources, styling, and Giscus comments served under `/win/`.

## Project Structure

```
win-website/
├── index.html                  # EFA homepage (primary entry)
├── efa.css                     # EFA styles
├── efa.js                      # EFA interactions + data rendering
├── assets/
│   └── placeholder-profile.svg # Avatar placeholder
├── images/                     # Shared icons/photos
├── WIN FINANCE BOOK PACK.pdf   # WIN PDF
├── WIN RESOURCE PACK.pdf       # WIN PDF
└── win/
    ├── index.html              # WIN homepage (subpage)
    ├── about.html              # WIN about page
    ├── styles.css              # WIN styling (legacy)
    └── script.js               # WIN interactions (legacy)
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