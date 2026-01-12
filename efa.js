const leadership = [
    { name: 'Rafay Syed', title: 'President', image: 'assets/placeholder-profile.svg' },
    { name: 'Nelson Aviles', title: 'Vice President', image: 'assets/placeholder-profile.svg' },
    { name: 'Adriana Iparrea', title: 'Vice President', image: 'assets/placeholder-profile.svg' },
    { name: 'Arian Din-Kirkebo', title: 'Chief Innovation Officer', image: 'assets/placeholder-profile.svg' },
    { name: 'Lara Iskandar', title: 'Chief Research Officer', image: 'assets/placeholder-profile.svg' },
    { name: 'Luna Ramos', title: 'Chief Operating Officer', image: 'assets/placeholder-profile.svg' },
    { name: 'Syed Ahmad', title: 'Treasurer', image: 'assets/placeholder-profile.svg' },
    { name: 'Juan Crawford', title: 'Advisor', image: 'assets/placeholder-profile.svg' }
];

const founders = [
    { name: 'Rafay', image: 'assets/placeholder-profile.svg' },
    { name: 'Arian', image: 'assets/placeholder-profile.svg' },
    { name: 'Luna', image: 'assets/placeholder-profile.svg' },
    { name: 'Mutahir', image: 'assets/placeholder-profile.svg' },
    { name: 'Ali', image: 'assets/placeholder-profile.svg' }
];

function renderLeadership() {
    const grid = document.getElementById('leadership-grid');
    if (!grid) return;
    grid.innerHTML = leadership.map(member => `
        <article class="person-card reveal" tabindex="0">
            <img class="avatar" src="${member.image}" alt="${member.name} headshot placeholder">
            <p class="person-name">${member.name}</p>
            <p class="person-title">${member.title}</p>
        </article>
    `).join('');
}

function renderFounders() {
    const list = document.getElementById('founders-list');
    if (!list) return;
    list.innerHTML = founders.map(founder => `
        <div class="founder reveal" tabindex="0">
            <img class="avatar" src="${founder.image}" alt="${founder.name} avatar placeholder">
            <div>
                <p class="person-name">${founder.name}</p>
                <p class="person-title">Founder</p>
            </div>
        </div>
    `).join('');
}

function setupNav() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');

    const setScrolled = () => {
        if (!header) return;
        if (window.scrollY > 16) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', setScrolled, { passive: true });
    setScrolled();

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            const isOpen = links.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        links.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupReveal() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function init() {
    renderLeadership();
    renderFounders();
    setupNav();
    setupSmoothScroll();
    setupReveal();
}

document.addEventListener('DOMContentLoaded', init);

