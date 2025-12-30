/**
 * DJ VVS AS - Main JavaScript
 * Professional interactions for plumbing service website
 */

(function() {
    'use strict';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');
    const contactForm = document.getElementById('contact-form');

    // ==========================================================================
    // Mobile Menu
    // ==========================================================================
    function initMobileMenu() {
        if (!menuToggle || !nav) return;

        menuToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') &&
                !nav.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });
    }

    function toggleMenu() {
        const isOpen = nav.classList.contains('active');

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        nav.classList.add('active');
        menuToggle.classList.add('active');
        document.body.classList.add('menu-open');
        menuToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================
    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 50;

        function handleScroll() {
            const currentScroll = window.pageYOffset;

            // Add/remove shadow based on scroll position
            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial state
    }

    // ==========================================================================
    // Scroll Animations
    // ==========================================================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

        if (!animatedElements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    }

    // ==========================================================================
    // Contact Form Validation
    // ==========================================================================
    function initContactForm() {
        if (!contactForm) return;

        const formFields = contactForm.querySelectorAll('input, select, textarea');

        // Real-time validation on blur
        formFields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => clearError(field));
        });

        // Form submission
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        clearError(field);

        // Required field check
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'Dette feltet er påkrevd';
        }

        // Specific field validations
        if (value) {
            switch (fieldName) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Vennligst oppgi en gyldig e-postadresse';
                    }
                    break;

                case 'phone':
                    const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;
                    if (!phoneRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Vennligst oppgi et gyldig telefonnummer';
                    }
                    break;

                case 'name':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Navnet må være minst 2 tegn';
                    }
                    break;

                case 'message':
                    if (value.length < 10) {
                        isValid = false;
                        errorMessage = 'Vennligst beskriv oppdraget mer detaljert (minst 10 tegn)';
                    }
                    break;
            }
        }

        if (!isValid) {
            showError(field, errorMessage);
        }

        return isValid;
    }

    function showError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        formGroup.classList.add('error');

        // Create error message element
        const errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        formGroup.appendChild(errorEl);
    }

    function clearError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        formGroup.classList.remove('error');
        const errorEl = formGroup.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const formFields = contactForm.querySelectorAll('input, select, textarea');
        let isFormValid = true;

        // Validate all fields
        formFields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Show success message
            showFormSuccess();

            // In a real application, you would send the form data to a server here
            console.log('Form submitted successfully');
        } else {
            // Focus first error field
            const firstError = contactForm.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
            if (firstError) {
                firstError.focus();
            }
        }
    }

    function showFormSuccess() {
        const formWrapper = contactForm.closest('.contact-form');
        if (!formWrapper) return;

        // Hide form
        contactForm.style.display = 'none';

        // Create success message
        const successHtml = `
            <div class="form-success show">
                <div class="form-success__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h3 class="form-success__title">Takk for din henvendelse!</h3>
                <p class="form-success__text">Vi har mottatt forespørselen din og tar kontakt så snart som mulig.</p>
            </div>
        `;

        formWrapper.insertAdjacentHTML('beforeend', successHtml);
    }

    // ==========================================================================
    // Smooth Scroll for Anchor Links
    // ==========================================================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 0;
                    const emergencyBanner = document.querySelector('.emergency-banner');
                    const bannerHeight = emergencyBanner ? emergencyBanner.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - bannerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==========================================================================
    // Click-to-Call Tracking
    // ==========================================================================
    function initClickToCall() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Track phone clicks (analytics placeholder)
                console.log('Phone link clicked - potential customer call');
            });
        });
    }

    // ==========================================================================
    // Active Navigation State
    // ==========================================================================
    function setActiveNavigation() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage ||
                (currentPage === '' && href === 'index.html') ||
                (currentPage === '/' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================================================
    // Emergency Banner Animation
    // ==========================================================================
    function initEmergencyBanner() {
        const emergencyPhone = document.querySelector('.emergency-banner__phone');
        if (!emergencyPhone) return;

        // Add subtle attention animation
        setInterval(() => {
            emergencyPhone.style.transform = 'scale(1.05)';
            setTimeout(() => {
                emergencyPhone.style.transform = 'scale(1)';
            }, 200);
        }, 5000);
    }

    // ==========================================================================
    // Lazy Load Images
    // ==========================================================================
    function initLazyLoad() {
        const images = document.querySelectorAll('img[data-src]');

        if (!images.length) return;

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ==========================================================================
    // Initialize
    // ==========================================================================
    function init() {
        initMobileMenu();
        initHeaderScroll();
        initScrollAnimations();
        initContactForm();
        initSmoothScroll();
        initClickToCall();
        setActiveNavigation();
        initEmergencyBanner();
        initLazyLoad();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
