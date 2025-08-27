document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTopBtn = document.getElementById('scrollTop');
    const navbar = document.querySelector('.navbar');
    const skillBars = document.querySelectorAll('.skill-progress');
    const contactForm = document.getElementById('contactForm');

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        hamburger.querySelectorAll('span').forEach((span, index) => {
            if (hamburger.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.querySelectorAll('span').forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.boxShadow = '0 0 25px rgba(0, 255, 65, 0.4)';
            scrollTopBtn.classList.add('visible');
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
            navbar.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.3)';
            scrollTopBtn.classList.remove('visible');
        }

        updateActiveNavLink();
        animateSkillBars();
        animateOnScroll();
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    function smoothScrollTo(target) {
        const targetElement = document.querySelector(target);
        if (targetElement) {
            const targetPosition = targetElement.offsetTop - 80;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScrollTo(target);
        });
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    function animateSkillBars() {
        const skillsSection = document.querySelector('.skills');
        const skillsSectionTop = skillsSection.offsetTop;
        const skillsSectionHeight = skillsSection.offsetHeight;
        const scrollPos = window.scrollY + window.innerHeight;

        if (scrollPos > skillsSectionTop + skillsSectionHeight / 2) {
            skillBars.forEach(bar => {
                if (!bar.classList.contains('animated')) {
                    const skillLevel = bar.getAttribute('data-skill');
                    bar.style.width = skillLevel + '%';
                    bar.classList.add('animated');
                }
            });
        }
    }

    function animateOnScroll() {
        const elements = document.querySelectorAll('.stat, .skill-card, .project-card');
        
        elements.forEach(element => {
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            const scrollPos = window.scrollY + window.innerHeight;
            
            if (scrollPos > elementTop + elementHeight / 4) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    function initializeAnimations() {
        const elements = document.querySelectorAll('.stat, .skill-card, .project-card');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            border-radius: 10px;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    function validateForm(formData) {
        const nombre = formData.get('nombre').trim();
        const email = formData.get('email').trim();
        const asunto = formData.get('asunto').trim();
        const mensaje = formData.get('mensaje').trim();

        if (!nombre) {
            showNotification('Por favor, ingresa tu nombre', 'error');
            return false;
        }

        if (!email || !validateEmail(email)) {
            showNotification('Por favor, ingresa un email válido', 'error');
            return false;
        }

        if (!asunto) {
            showNotification('Por favor, ingresa un asunto', 'error');
            return false;
        }

        if (!mensaje || mensaje.length < 10) {
            showNotification('El mensaje debe tener al menos 10 caracteres', 'error');
            return false;
        }

        return true;
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        if (validateForm(formData)) {
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('¡Mensaje enviado correctamente! Te responderé pronto.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    });

    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    function initializeTypeWriter() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            setTimeout(() => {
                typeWriter(heroTitle, originalText, 50);
            }, 1000);
        }
    }

    function createParticles() {
        const hero = document.querySelector('.hero');
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
        `;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                animation: float ${Math.random() * 6 + 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            particlesContainer.appendChild(particle);
        }
        
        hero.style.position = 'relative';
        hero.appendChild(particlesContainer);
    }

    function addProjectHoverEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    function animateStats() {
        const stats = document.querySelectorAll('.stat h3');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.textContent);
                    let currentValue = 0;
                    const increment = finalValue / 50;
                    
                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= finalValue) {
                            currentValue = finalValue;
                            clearInterval(timer);
                        }
                        target.textContent = Math.floor(currentValue) + (target.textContent.includes('+') ? '+' : target.textContent.includes('%') ? '%' : '');
                    }, 40);
                    
                    observer.unobserve(target);
                }
            });
        });
        
        stats.forEach(stat => observer.observe(stat));
    }

    function handleKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    }

    function addSmoothScrollPolyfill() {
        if (!('scrollBehavior' in document.documentElement.style)) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/smoothscroll.min.js';
            document.head.appendChild(script);
        }
    }

    window.scrollToSection = function(sectionId) {
        smoothScrollTo(`#${sectionId}`);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.querySelectorAll('span').forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    });

    initializeAnimations();
    addSmoothScrollPolyfill();
    createParticles();
    addProjectHoverEffects();
    animateStats();
    handleKeyboardNavigation();
    
    setTimeout(() => {
        animateOnScroll();
        animateSkillBars();
    }, 500);
});
