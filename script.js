document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // For main navigation, remove active class from all sub-nav links
            // This is important if an About Me sub-section was active and user clicks on a main nav link
            document.querySelectorAll('.sub-nav-link').forEach(link => link.classList.remove('active'));
            document.querySelectorAll('.sub-section').forEach(section => section.classList.remove('active'));
        });
    });

    // Sub-navigation for About Me section
    const subNavLinks = document.querySelectorAll('.sub-nav-link');
    const subSections = document.querySelectorAll('.sub-section');

    function showSubSection(targetId) {
        subSections.forEach(section => {
            section.classList.remove('active');
        });
        document.querySelector(targetId).classList.add('active');

        // Re-trigger other animations for content within the active sub-section
        document.querySelector(targetId).querySelectorAll('.animated-fade-in, .animated-fade-in-up, .animated-scale-in').forEach(el => {
            el.style.animation = 'none'; // Reset animation
            el.offsetHeight; // Trigger reflow
            if (el.classList.contains('animated-fade-in')) {
                el.style.animation = 'fadeIn 1s forwards ease-out 0.5s';
            } else if (el.classList.contains('animated-fade-in-up')) {
                el.style.animation = 'fadeInUp 0.8s forwards ease-out 0.7s';
            } else if (el.classList.contains('animated-scale-in')) {
                el.style.animation = 'scaleIn 0.8s forwards ease-out 0.6s';
            }
        });
    }

    subNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            subNavLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            showSubSection(this.getAttribute('href'));
        });
    });

    // Initially show the "Pendidikan" sub-section and set it active
    if (document.querySelector('#about-pendidikan')) {
        document.querySelector('#about-pendidikan').classList.add('active');
        document.querySelector('.sub-nav-link[href="#about-pendidikan"]').classList.add('active');
    }

    // Intersection Observer for triggering animations on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // When 10% of the element is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // For general CSS animations (fade-in, scale-in etc.)
                entry.target.querySelectorAll('.animated-fade-in, .animated-fade-in-up, .animated-scale-in').forEach(el => {
                    if (!el.dataset.animated) {
                        el.style.animationPlayState = 'running';
                        el.dataset.animated = 'true';
                    }
                });
            } else {
                // Optional: Reset animations when out of view if you want them to re-play
                // entry.target.querySelectorAll('.animated-fade-in, .animated-fade-in-up, .animated-scale-in').forEach(el => {
                //     el.style.animation = 'none'; // Reset animation
                //     el.offsetHeight; // Trigger reflow
                //     el.dataset.animated = 'false';
                // });
            }
        });
    }, observerOptions);

    // Observe each section
    document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Observe image for hero photo animation
    const heroPhoto = document.querySelector('.hero-image-container .animated-photo');
    if (heroPhoto) {
        const photoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1) translateY(0)';
                    photoObserver.unobserve(entry.target); // Animate once
                }
            });
        }, { threshold: 0.5 }); // When 50% of the photo is visible
        photoObserver.observe(heroPhoto);
    }

    // Ensure all data-text content is immediately visible
    document.querySelectorAll('[data-text]').forEach(el => {
        if (!el.dataset.typed) {
             el.textContent = el.dataset.text;
             el.dataset.typed = 'true';
        }
    });

    // For nav links, ensure their text is set directly
    document.querySelectorAll('nav .nav-link').forEach(navLink => {
        navLink.textContent = navLink.dataset.text || navLink.textContent;
    });
});