// ===================================
// Daniel Ketchum - Pianist & Composer
// Main JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initVideoCarousel();
    initScrollEffects();
    initNewsletterForm();
});

// ===================================
// Navigation
// ===================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// ===================================
// Video Carousel
// ===================================
function initVideoCarousel() {
    const videoContainers = document.querySelectorAll('.video-container');
    const navButtons = document.querySelectorAll('.video-nav-btn');
    let currentVideo = 0;
    let autoRotateInterval;

    if (videoContainers.length === 0) return;

    // Show specific video
    function showVideo(index) {
        videoContainers.forEach((container, i) => {
            container.classList.remove('active');
            if (navButtons[i]) {
                navButtons[i].classList.remove('active');
            }
        });

        videoContainers[index].classList.add('active');
        if (navButtons[index]) {
            navButtons[index].classList.add('active');
        }
        currentVideo = index;
    }

    // Navigation button clicks
    navButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            showVideo(index);
            resetAutoRotate();
        });
    });

    // Auto-rotate videos
    function startAutoRotate() {
        autoRotateInterval = setInterval(function() {
            let nextVideo = (currentVideo + 1) % videoContainers.length;
            showVideo(nextVideo);
        }, 10000); // Rotate every 10 seconds
    }

    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }

    // Start auto-rotation
    startAutoRotate();

    // Pause on hover
    const carousel = document.querySelector('.video-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', function() {
            clearInterval(autoRotateInterval);
        });

        carousel.addEventListener('mouseleave', function() {
            startAutoRotate();
        });
    }
}

// ===================================
// Scroll Effects
// ===================================
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.release-card, .platform-link').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ===================================
// Newsletter Form
// ===================================
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;

            // Here you would typically send to your email service
            // For now, show a success message
            alert('Thank you for subscribing! You will receive updates at: ' + email);
            form.reset();
        });
    }
}

// ===================================
// Contact Form (for contact page)
// ===================================
function initContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Create mailto link as fallback
            const mailtoLink = `mailto:Ketchummusic@hotmail.com?subject=Contact from ${name}&body=${encodeURIComponent(message)}%0A%0AFrom: ${name}%0AEmail: ${email}`;

            window.location.href = mailtoLink;

            alert('Thank you for your message! Your email client will open to send the message.');
        });
    }
}

// ===================================
// Utility Functions
// ===================================

// Debounce function for scroll events
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

// Add fade-in animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .fade-in-visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
