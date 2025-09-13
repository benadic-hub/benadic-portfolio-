// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) {
            console.error('Particle canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 100;
        this.colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
        this.animationId = null;
        
        this.init();
        this.startAnimation();
        this.handleResize();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.min(this.maxParticles, Math.floor((this.canvas.width * this.canvas.height) / 15000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 2 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                alpha: Math.random() * 0.5 + 0.3
            });
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawConnections() {
        const maxDistance = 120;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const alpha = (1 - distance / maxDistance) * 0.15;
                    this.ctx.save();
                    this.ctx.globalAlpha = alpha;
                    this.ctx.strokeStyle = this.particles[i].color;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }

    animate() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.animate();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    handleResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                this.createParticles();
            }, 250);
        });
    }
}

// Counter Animation
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.metric-number');
        this.animatedCounters = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedCounters.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animatedCounters.add(entry.target);
                }
            });
        }, options);

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// AI Assistant
class AIAssistant {
    constructor() {
        this.textarea = document.getElementById('user-question');
        this.button = document.getElementById('ask-button');
        this.responseContainer = document.getElementById('assistant-response');
        this.loading = document.getElementById('loading');
        this.responseText = document.getElementById('response-text');
        
        if (!this.textarea || !this.button || !this.responseContainer || !this.loading || !this.responseText) {
            console.error('AI Assistant elements not found');
            return;
        }
        
        this.responses = {
            'experience': "Benadic has over 8 years of experience in technology and business, starting with Offer Zone 360 in 2015 and progressing through various roles as a freelancer before founding Cossmicrings Solutions.",
            'company': "Cossmicrings Solutions Private Limited is Benadic's current company with 15 team members, specializing in AI, blockchain, IoT, and NFC technologies. It has two main divisions: Upbrando for brand strategy and Jeff AI for artificial intelligence.",
            'skills': "Benadic has diverse technical skills including SAP FICO, SAP HCM, Microsoft BI, Java, C/C++, and SQL. He also excels in digital marketing with expertise in Meta Business, Google Ads, WordPress, SEO, and SEM.",
            'research': "Benadic has conducted extensive international research across 9 countries including Dubai, Singapore, Malaysia, Thailand, Sri Lanka, Sharjah, Bahrain, and China, focusing on technology gap analysis and Canton Fair visits.",
            'mission': "His primary mission is to bridge the 30-50 year technology gap between China and India through strategic innovation and cutting-edge solutions.",
            'contact': "You can reach Benadic at sjbennyamalan@gmail.com, call +91-95979 59015, or connect on LinkedIn at linkedin.com/in/benadic-amalan-79275410. His office is located in Madurai, Tamil Nadu.",
            'journey': "Benadic's journey began in 2015 with Offer Zone 360, an e-commerce platform. He then worked as a freelancer from 2019-2023, evolving from UI/UX Designer to Full-Stack Developer, then Digital Marketing Specialist, and finally Business Analyst.",
            'team': "Cossmicrings Solutions has a dedicated team of 15 members working on various innovative projects in AI, blockchain, IoT, and NFC technologies.",
            'default': "Benadic Amalan SJ is a visionary tech entrepreneur and global innovation pioneer. He founded Cossmicrings Solutions and has conducted research across 9 countries to bridge technology gaps between markets. Feel free to ask about his experience, company, skills, or research work!"
        };
        
        this.init();
    }

    init() {
        this.button.addEventListener('click', () => this.handleQuestion());
        this.textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.handleQuestion();
            }
        });
    }

    async handleQuestion() {
        const question = this.textarea.value.trim();
        
        if (!question) {
            this.showResponse('Please enter a question first!');
            return;
        }

        this.showLoading();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        const response = this.generateResponse(question);
        this.showResponse(response);
    }

    generateResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        if (lowerQuestion.includes('experience') || lowerQuestion.includes('background') || lowerQuestion.includes('career')) {
            return this.responses.experience;
        } else if (lowerQuestion.includes('company') || lowerQuestion.includes('cossmicrings') || lowerQuestion.includes('business')) {
            return this.responses.company;
        } else if (lowerQuestion.includes('skill') || lowerQuestion.includes('technical') || lowerQuestion.includes('programming')) {
            return this.responses.skills;
        } else if (lowerQuestion.includes('research') || lowerQuestion.includes('country') || lowerQuestion.includes('international')) {
            return this.responses.research;
        } else if (lowerQuestion.includes('mission') || lowerQuestion.includes('goal') || lowerQuestion.includes('bridge')) {
            return this.responses.mission;
        } else if (lowerQuestion.includes('contact') || lowerQuestion.includes('email') || lowerQuestion.includes('phone')) {
            return this.responses.contact;
        } else if (lowerQuestion.includes('journey') || lowerQuestion.includes('start') || lowerQuestion.includes('began')) {
            return this.responses.journey;
        } else if (lowerQuestion.includes('team') || lowerQuestion.includes('member') || lowerQuestion.includes('employee')) {
            return this.responses.team;
        } else {
            return this.responses.default;
        }
    }

    showLoading() {
        this.responseContainer.classList.remove('hidden');
        this.loading.classList.remove('hidden');
        this.responseText.classList.add('hidden');
        this.button.disabled = true;
        this.button.textContent = 'Processing...';
    }

    showResponse(text) {
        this.loading.classList.add('hidden');
        this.responseText.classList.remove('hidden');
        this.responseText.textContent = text;
        this.button.disabled = false;
        this.button.textContent = 'Ask Assistant';
    }
}

// Smooth Scrolling
class SmoothScrolling {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.particleSystem = null;
        this.init();
    }

    init() {
        // Reduce particle count on mobile devices
        if (window.innerWidth < 768) {
            const canvas = document.getElementById('particle-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                // Reduce quality for mobile
                ctx.imageSmoothingEnabled = false;
            }
        }

        // Pause animations when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }

    setParticleSystem(particleSystem) {
        this.particleSystem = particleSystem;
    }

    pauseAnimations() {
        if (this.particleSystem) {
            this.particleSystem.stopAnimation();
        }
    }

    resumeAnimations() {
        if (this.particleSystem) {
            this.particleSystem.startAnimation();
        }
    }
}

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.init();
    }

    init() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
            mediaQuery.addEventListener('change', (e) => {
                console.log('System theme changed:', e.matches ? 'light' : 'dark');
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        return this.currentTheme;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Portfolio App...');
    
    // Initialize all systems
    const particleSystem = new ParticleSystem();
    const counterAnimation = new CounterAnimation();
    const aiAssistant = new AIAssistant();
    const smoothScrolling = new SmoothScrolling();
    const performanceOptimizer = new PerformanceOptimizer();
    const themeManager = new ThemeManager();
    
    // Connect performance optimizer to particle system
    if (particleSystem && performanceOptimizer) {
        performanceOptimizer.setParticleSystem(particleSystem);
    }

    // Add loading animation to page
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Console messages for developers
    console.log('%c🚀 Benadic Amalan SJ Portfolio', 'color: #06b6d4; font-size: 16px; font-weight: bold;');
    console.log('%cBuilt with vanilla JavaScript, featuring particle systems, smooth animations, and responsive design.', 'color: #9ca3af;');
    console.log('✅ All systems initialized successfully');
});

// Export classes for potential external use
window.PortfolioApp = {
    ParticleSystem,
    CounterAnimation,
    AIAssistant,
    SmoothScrolling,
    PerformanceOptimizer,
    ThemeManager
};