// Theme Switcher
const themeButtons = document.querySelectorAll('.theme-btn');
const body = document.body;

// Set active theme on load
document.addEventListener('DOMContentLoaded', () => {
    setupTheme();
    setupInteractions();
});

function setupTheme() {
    // Default to theme-1 if no theme is stored
    const savedTheme = localStorage.getItem('selectedTheme') || 'theme-1';
    body.className = savedTheme;
    
    // Update active button
    themeButtons.forEach(button => {
        if (button.dataset.theme === savedTheme) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function setupInteractions() {
    // Theme button click events
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedTheme = button.dataset.theme;
            
            // Update body class
            body.className = selectedTheme;
            
            // Save to localStorage
            localStorage.setItem('selectedTheme', selectedTheme);
            
            // Update active button
            themeButtons.forEach(btn => {
                if (btn === button) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Update layout for specific themes that need additional adjustments
            handleThemeSpecificLayouts(selectedTheme);
        });
    });

    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Adjusted offset for different themes
                const themeSelector = document.querySelector('.theme-selector');
                const themeHeight = themeSelector ? themeSelector.offsetHeight : 0;
                const navHeight = document.querySelector('nav') ? document.querySelector('nav').offsetHeight : 0;
                const offset = themeHeight + navHeight;
                
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Submission Handler
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (name && email && subject && message) {
                // In a real application, you would send this data to a server
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    // Add animation to timeline items - if they exist in current theme
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });

    // Add animation to skill bars - if they exist in current theme
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = 0;
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-category').forEach(category => {
        skillObserver.observe(category);
    });
}

// Handle theme-specific layout adjustments
function handleThemeSpecificLayouts(theme) {
    // For theme 2 (side navigation layout)
    if (theme === 'theme-2') {
        // Wrap main content in a flex container for side navigation
        if (!document.querySelector('.main-content')) {
            const nav = document.querySelector('nav');
            const contentSections = document.querySelectorAll('section');
            
            // Create wrapper for content
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'content-wrapper';
            
            // Move all sections into the content wrapper
            contentSections.forEach(section => {
                contentWrapper.appendChild(section);
            });
            
            // Create main content container
            const mainContent = document.createElement('div');
            mainContent.className = 'main-content';
            
            // Insert nav and content wrapper into main content
            const navParent = nav.parentNode;
            navParent.insertBefore(mainContent, nav);
            mainContent.appendChild(nav);
            mainContent.appendChild(contentWrapper);
        }
    }
    
    // For theme 4 (material design cards)
    if (theme === 'theme-4') {
        // Add material design card structure to timeline items
        document.querySelectorAll('.timeline-content').forEach(item => {
            if (!item.querySelector('.timeline-header')) {
                const title = item.querySelector('.timeline-title');
                const date = item.querySelector('.timeline-date');
                const location = item.querySelector('.timeline-location');
                const content = item.querySelector('p');
                
                // Create header and body
                const header = document.createElement('div');
                header.className = 'timeline-header';
                
                const body = document.createElement('div');
                body.className = 'timeline-body';
                
                // Move elements to header and body
                if (title) header.appendChild(title.cloneNode(true));
                if (date) header.appendChild(date.cloneNode(true));
                if (location) body.appendChild(location.cloneNode(true));
                if (content) body.appendChild(content.cloneNode(true));
                
                // Clear original content
                item.innerHTML = '';
                
                // Add new structure
                item.appendChild(header);
                item.appendChild(body);
            }
        });
    }
    
    // Reset to default structure when switching away from special themes
    if (theme !== 'theme-2') {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            const parent = mainContent.parentNode;
            const nav = mainContent.querySelector('nav');
            const contentWrapper = mainContent.querySelector('.content-wrapper');
            
            if (nav && contentWrapper) {
                // Move nav back to original position
                parent.insertBefore(nav, mainContent);
                
                // Move all sections back to original position
                const sections = contentWrapper.querySelectorAll('section');
                sections.forEach(section => {
                    parent.insertBefore(section, mainContent);
                });
                
                // Remove wrapper elements
                parent.removeChild(mainContent);
            }
        }
    }
}
