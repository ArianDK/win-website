// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    }
});

// Set website to always use light theme
document.documentElement.setAttribute('data-theme', 'light');

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.resource-card, .team-member, .hero, .section-title');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Download tracking
document.querySelectorAll('a[download]').forEach(link => {
    link.addEventListener('click', function() {
        // Track download (you can integrate with analytics here)
        console.log('Download started:', this.href);
        
        // Add visual feedback
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        this.style.pointerEvents = 'none';
        
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.pointerEvents = 'auto';
        }, 2000);
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling for external resources
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Image failed to load:', e.target.src);
    }
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Giscus width constraint - More aggressive approach
function constrainGiscusWidth() {
    const wrapper = document.querySelector('.giscus-wrapper');
    const giscusContainer = document.getElementById('giscus-comments');
    
    if (wrapper && giscusContainer) {
        // Set wrapper to fixed width
        wrapper.style.width = '50%';
        wrapper.style.maxWidth = '600px';
        wrapper.style.margin = '0 auto';
        wrapper.style.overflow = 'hidden';
        
        // Force all iframes and Giscus elements to respect wrapper bounds
        const allElements = wrapper.querySelectorAll('*');
        allElements.forEach(element => {
            element.style.maxWidth = '100%';
            element.style.width = '100%';
            element.style.boxSizing = 'border-box';
        });
        
        // Specifically target iframes
        const iframes = wrapper.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.style.width = '100%';
            iframe.style.maxWidth = '100%';
            iframe.style.minWidth = '0';
            iframe.style.boxSizing = 'border-box';
        });
    }
}

// Run when Giscus loads
document.addEventListener('DOMContentLoaded', function() {
    // Check for Giscus iframe periodically with more frequent checks
    const checkGiscus = setInterval(() => {
        const giscusIframe = document.querySelector('#giscus-comments iframe');
        if (giscusIframe) {
            constrainGiscusWidth();
            clearInterval(checkGiscus);
        }
    }, 500);
    
    // Run multiple times to catch different loading stages
    setTimeout(constrainGiscusWidth, 1000);
    setTimeout(constrainGiscusWidth, 2000);
    setTimeout(constrainGiscusWidth, 5000);
    
    // Also run on window resize
    window.addEventListener('resize', constrainGiscusWidth);
});
