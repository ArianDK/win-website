# W.I.N — Wealth Insured Navigation

A modern, minimalist website providing financial literacy resources for students and young adults.

## Features

- 🎨 **Custom Light Theme**: Beautiful, customizable color palette with CSS variables
- 📱 **Fully Responsive**: Optimized for all devices and screen sizes
- 🌙 **Theme Switching**: Built-in dark/light mode toggle
- 💬 **Comments System**: Integrated Giscus for static GitHub Pages
- ⚡ **Fast Loading**: Optimized performance with lazy loading and smooth animations
- 🎯 **Accessibility**: WCAG compliant with proper focus management

## Setup for GitHub Pages

### 1. Repository Setup
1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch" and choose "main"
5. Your site will be available at `https://yourusername.github.io/win-website`

### 2. Giscus Comments Setup

To enable comments on your website:

1. **Install Giscus App**:
   - Go to [Giscus App](https://github.com/apps/giscus)
   - Click "Install" and select your repository

2. **Get Configuration**:
   - Visit [Giscus Configuration](https://giscus.app/)
   - Enter your repository name: `yourusername/win-website`
   - Select "Discussion" category
   - Copy the generated script

3. **Update the Script**:
   - Open `index.html`
   - Replace the Giscus script section with your configuration
   - Update these values in the script:
     - `data-repo="yourusername/win-website"`
     - `data-repo-id="YOUR_REPO_ID"`
     - `data-category-id="YOUR_CATEGORY_ID"`

### 3. Team Images

Replace the placeholder image references in `about.html`:
- `rafaey.jpg` - Rafaey's professional headshot
- `arian.jpg` - Arian's professional headshot

## File Structure

```
win-website/
├── index.html          # Homepage
├── about.html          # About us page
├── styles.css          # Main stylesheet with theme variables
├── script.js           # JavaScript functionality
├── README.md           # This file
├── WIN FINANCE BOOK PACK.pdf
└── WIN RESOURCE PACK.pdf
```

## Customization

### Color Theme
The website uses CSS custom properties for easy theming. Main colors are defined in `:root`:

```css
:root {
    --primary-color: #4A90E2;
    --secondary-color: #7B68EE;
    --accent-color: #50C878;
    /* ... more variables */
}
```

### Adding New Pages
1. Create new HTML file
2. Copy the header and footer structure from existing pages
3. Update navigation in all files
4. Add page-specific styles to `styles.css`

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance Features

- Lazy loading for images
- Optimized scroll handlers
- CSS custom properties for efficient theming
- Minimal JavaScript footprint
- Mobile-first responsive design

## License

© 2024 W.I.N. All rights reserved.
