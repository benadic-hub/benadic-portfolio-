// Global variables for debugging
let globalParticleSystem = null;
let globalAIAssistant = null;
let globalNavigation = null;

// Enhanced Particle System
class ParticleSystem {
    constructor() {
        console.log('🎨 Initializing Premium Particle System...');
        
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) {
            console.error('❌ Particle canvas not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = window.innerWidth < 768 ? 50 : 80;
        this.colors = ['#FFD700', '#8E44AD', '#1B2951', '#E8B4B8', '#BDC3C7'];
        this.animationId = null;
        this.isRunning = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseInfluence = 120;
        
        this.init();
        this.startAnimation();
        this.handleResize();
        this.handleMouse();
    }

    init() {
        console.log('🎯 Initializing premium particles...');
        this.resize();
        this.createParticles();
        console.log(`✅ Created ${this.particles.length} particles`);
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.min(this.maxParticles, Math.max(30, Math.floor((this.canvas.width * this.canvas.height) / 20000)));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                radius: Math.random() * 3 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                alpha: Math.random() * 0.8 + 0.2,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Mouse interaction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouseInfluence) {
                const force = (this.mouseInfluence - distance) / this.mouseInfluence;
                const angle = Math.atan2(dy, dx);
                particle.vx -= Math.cos(angle) * force * 0.3;
                particle.vy -= Math.sin(angle) * force * 0.3;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Update pulse
            particle.pulse += particle.pulseSpeed;
            
            // Apply friction
            particle.vx *= 0.995;
            particle.vy *= 0.995;
            
            // Add some random movement
            particle.vx += (Math.random() - 0.5) * 0.03;
            particle.vy += (Math.random() - 0.5) * 0.03;
            
            // Limit velocity
            const maxVelocity = 1.5;
            const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (currentSpeed > maxVelocity) {
                particle.vx = (particle.vx / currentSpeed) * maxVelocity;
                particle.vy = (particle.vy / currentSpeed) * maxVelocity;
            }

            // Wrap around edges
            if (particle.x < -10) particle.x = this.canvas.width + 10;
            if (particle.x > this.canvas.width + 10) particle.x = -10;
            if (particle.y < -10) particle.y = this.canvas.height + 10;
            if (particle.y > this.canvas.height + 10) particle.y = -10;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            
            const pulseAlpha = particle.alpha + Math.sin(particle.pulse) * 0.2;
            const pulseRadius = particle.radius + Math.sin(particle.pulse) * 0.3;
            
            this.ctx.globalAlpha = Math.max(0.1, pulseAlpha);
            this.ctx.fillStyle = particle.color;
            
            // Main particle with glow
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 10 + Math.sin(particle.pulse) * 5;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, pulseRadius, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    drawConnections() {
        const maxDistance = 100;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const alpha = (1 - distance / maxDistance) * 0.3;
                    this.ctx.save();
                    this.ctx.globalAlpha = alpha;
                    this.ctx.strokeStyle = '#FFD700';
                    this.ctx.lineWidth = 1;
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
        if (!this.ctx || !this.isRunning) return;
        
        // Clear canvas with premium fade
        this.ctx.fillStyle = 'rgba(15, 20, 25, 0.03)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.isRunning = true;
        this.animate();
    }

    stopAnimation() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    handleMouse() {
        let mouseTimeout;
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                this.mouseX = -1000;
                this.mouseY = -1000;
            }, 3000);
        });
        
        document.addEventListener('mouseleave', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
        });
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

// Enhanced Navigation System with Mobile Support
class Navigation {
    constructor() {
        console.log('🧭 Initializing Premium Navigation System...');
        
        this.navItems = document.querySelectorAll('.nav-item');
        this.sections = document.querySelectorAll('section[id], header[id]');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.currentSection = 'hero';
        
        console.log(`✅ Found ${this.navItems.length} nav items and ${this.sections.length} sections`);
        
        this.init();
    }

    init() {
        this.setupClickEvents();
        this.setupScrollSpy();
        this.setupMobileMenu();
        this.updateActiveState();
    }

    setupClickEvents() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const targetId = href.substring(1);
                    this.scrollToSection(targetId);
                    this.closeMobileMenu();
                }
            });
        });
    }

    setupMobileMenu() {
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    scrollToSection(targetId) {
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const navHeight = window.innerWidth <= 768 ? 70 : 80;
            const elementTop = targetElement.offsetTop;
            const targetPosition = elementTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            this.currentSection = targetId;
            this.updateActiveState();
        }
    }

    setupScrollSpy() {
        const options = {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    if (sectionId && sectionId !== this.currentSection) {
                        this.currentSection = sectionId;
                        this.updateActiveState();
                    }
                }
            });
        }, options);

        this.sections.forEach(section => {
            if (section.id) {
                observer.observe(section);
            }
        });
    }

    updateActiveState() {
        this.navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                if (targetId === this.currentSection) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }
        });
    }
}

// Enhanced Counter Animation
class CounterAnimation {
    constructor() {
        console.log('🔢 Initializing Enhanced Counter Animation...');
        this.counters = document.querySelectorAll('.metric-number, .stat-value');
        this.animatedCounters = new Set();
        console.log(`✅ Found ${this.counters.length} counters`);
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
            
            // Premium easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                element.style.transform = `scale(${1 + Math.sin(progress * Math.PI) * 0.05})`;
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
                element.style.transform = 'scale(1)';
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Fixed AI Assistant for S J BENADIC AMALAN
class AIAssistant {
    constructor() {
        console.log('🤖 Initializing Premium AI Assistant...');
        
        this.textarea = document.getElementById('user-question');
        this.button = document.getElementById('ask-button');
        this.responseContainer = document.getElementById('assistant-response');
        this.loading = document.getElementById('loading');
        this.responseText = document.getElementById('response-text');
        
        console.log('Elements found:', {
            textarea: !!this.textarea,
            button: !!this.button, 
            responseContainer: !!this.responseContainer,
            loading: !!this.loading,
            responseText: !!this.responseText
        });
        
        if (!this.textarea || !this.button || !this.responseContainer || !this.loading || !this.responseText) {
            console.error('❌ Some AI Assistant elements not found!');
            return;
        }
        
        this.responses = {
            'story': "S J BENADIC AMALAN's journey is extraordinary - from launching Offer Zone 360 as a college student in 2015 to discovering a staggering 30-50 year technology gap during his research across 9 countries. This revelation became his life's mission. Today, he leads Cossmicrings Solutions with 15 professionals, specializing in AI, blockchain, IoT, and NFC technologies.",
            
            'experience': "With over 8 years of diverse experience, S J BENADIC AMALAN strategically evolved from e-commerce entrepreneur to global tech visionary. His unique career path includes UI/UX Design, Full-Stack Development, Digital Marketing, and Business Analysis - each role carefully chosen to build comprehensive expertise for his technological mission.",
            
            'company': "Cossmicrings Solutions Private Limited is S J BENADIC AMALAN's flagship innovation company with 15 dedicated professionals. Specializing in AI, blockchain, IoT, and NFC technologies, the company operates two key divisions: Upbrando for brand strategy and Jeff AI for artificial intelligence solutions. Their first NFC product launches in just 100 days.",
            
            'skills': "S J BENADIC AMALAN possesses a rare combination of technical and business expertise: SAP FICO, SAP HCM, Microsoft BI, IBM Cognos, Java, C/C++, SQL, plus advanced digital marketing with Meta Business and Google Ads. His unique edge includes hydroponics knowledge, cosmetic chemistry, and FMCG manufacturing expertise.",
            
            'research': "S J BENADIC AMALAN's groundbreaking research spanned 9 countries including Dubai, Singapore, Malaysia, Thailand, Sri Lanka, Sharjah, Bahrain, and three intensive visits to China's Canton Fair. This research unveiled the critical 30-50 year technology gap between China and developing nations - the discovery that defines his current mission.",
            
            'mission': "His revolutionary mission: bridging the 30-50 year technology gap between China and developing nations through strategic innovation, cutting-edge solutions, and transforming the global technological landscape. Every venture is designed to accelerate technological advancement and create sustainable growth.",
            
            'philosophy': "S J BENADIC AMALAN's core philosophy centers on environmental responsibility: 'My heart doesn't accept using chemical products. If I'm planning to launch, I'll go green and natural. There are many obstacles in it, but I'll overcome them one day.' This green commitment guides every business decision.",
            
            'education': "S J BENADIC AMALAN holds a Bachelor's in Electronics & Communication Engineering from Jeppiaar Engineering College and an MBA in Business Analytics. This unique combination provides both technical depth and strategic business acumen essential for his technology entrepreneurship ventures.",
            
            'journey': "The journey: 2015 - Offer Zone 360 launch while in college; 2019-2023 - Strategic freelance career building comprehensive skills; 2023+ - International research expeditions revealing the technology gap; Present - Leading Cossmicrings Solutions toward bridging global technological disparities.",
            
            'team': "Cossmicrings Solutions features a world-class team of 15 innovative professionals united by S J BENADIC AMALAN's vision. They're developing cutting-edge AI, blockchain, IoT, and NFC technologies, with their first breakthrough NFC product launching in 100 days.",
            
            'vision': "S J BENADIC AMALAN envisions a future where developing nations achieve technological parity with advanced economies. Through strategic innovation and green technology implementation, he's architecting a sustainable technological revolution that will benefit generations.",
            
            'contact': "Connect with S J BENADIC AMALAN directly at +91-95979 59015 or sjbennyamalan@gmail.com. He's always open to discussing technology partnerships, innovation opportunities, and collaborative ventures that advance his mission of bridging global technology gaps.",
            
            'gap': "The 30-50 year technology gap discovery was S J BENADIC AMALAN's pivotal moment. During extensive research across China and other nations, he witnessed firsthand how technological advancement varies dramatically between countries. This gap represents both the challenge and the opportunity that drives his entire mission today.",
            
            'default': "S J BENADIC AMALAN is a visionary technology entrepreneur on a mission to bridge the 30-50 year technology gap between China and developing nations. Through Cossmicrings Solutions and his expertise in AI, blockchain, IoT, and NFC technologies, he's architecting the future. Ask me about his research, company, green philosophy, or groundbreaking mission!"
        };
        
        this.init();
        console.log('✅ AI Assistant initialized successfully');
    }

    init() {
        console.log('🔗 Setting up AI Assistant event listeners...');
        
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🎯 Ask button clicked!');
            this.handleQuestion();
        });
        
        this.textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                console.log('🎯 Enter+Ctrl pressed in textarea!');
                this.handleQuestion();
            }
        });
        
        // Enhanced button feedback
        this.textarea.addEventListener('input', () => {
            if (this.textarea.value.trim()) {
                this.button.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
                this.button.style.transform = 'scale(1.02)';
            } else {
                this.button.style.background = 'linear-gradient(135deg, #FFD700, #FF8C00)';
                this.button.style.transform = 'scale(1)';
            }
        });
        
        console.log('✅ Event listeners attached successfully');
    }

    async handleQuestion() {
        console.log('🚀 Handling question...');
        
        const question = this.textarea.value.trim();
        console.log('Question:', question);
        
        if (!question) {
            console.log('❌ No question provided');
            this.showResponse('Please enter a question to discover more about S J BENADIC AMALAN\'s revolutionary journey and technological mission!');
            return;
        }

        console.log('⏳ Showing loading state...');
        this.showLoading();
        
        // Simulate premium AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const response = this.generateResponse(question);
        console.log('💬 Generated response:', response.substring(0, 50) + '...');
        this.showResponse(response);
        
        // Clear and reset
        this.textarea.value = '';
        this.button.style.background = 'linear-gradient(135deg, #FFD700, #FF8C00)';
        this.button.style.transform = 'scale(1)';
        console.log('✅ Question handled successfully');
    }

    generateResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        const keywordMap = [
            { keywords: ['story', 'journey', 'narrative', 'background'], response: 'story' },
            { keywords: ['experience', 'career', 'professional', 'work'], response: 'experience' },
            { keywords: ['company', 'cossmicrings', 'business', 'organization'], response: 'company' },
            { keywords: ['skill', 'technical', 'programming', 'expertise'], response: 'skills' },
            { keywords: ['research', 'country', 'international', 'canton'], response: 'research' },
            { keywords: ['mission', 'goal', 'bridge', 'gap'], response: 'mission' },
            { keywords: ['philosophy', 'green', 'natural', 'chemical'], response: 'philosophy' },
            { keywords: ['education', 'academic', 'degree', 'college'], response: 'education' },
            { keywords: ['contact', 'email', 'phone', 'reach'], response: 'contact' },
            { keywords: ['team', 'member', 'employee', 'staff'], response: 'team' },
            { keywords: ['vision', 'future', 'dream', 'aspiration'], response: 'vision' },
            { keywords: ['gap', 'technology gap', 'china', 'developing'], response: 'gap' },
            { keywords: ['technology', 'tech', 'technological'], response: 'gap' }
        ];
        
        for (const mapping of keywordMap) {
            if (mapping.keywords.some(keyword => lowerQuestion.includes(keyword))) {
                return this.responses[mapping.response];
            }
        }
        
        return this.responses.default;
    }

    showLoading() {
        console.log('⏳ Displaying loading state...');
        
        // Make sure response container is visible
        this.responseContainer.classList.remove('hidden');
        this.responseContainer.style.display = 'block';
        
        // Show loading, hide response text
        this.loading.classList.remove('hidden');
        this.loading.style.display = 'flex';
        this.responseText.classList.add('hidden');
        this.responseText.style.display = 'none';
        
        // Update button
        this.button.disabled = true;
        this.button.textContent = 'Analyzing Insights...';
        
        console.log('✅ Loading state displayed');
    }

    showResponse(text) {
        console.log('💬 Displaying response...');
        
        // Hide loading, show response text
        this.loading.classList.add('hidden');
        this.loading.style.display = 'none';
        this.responseText.classList.remove('hidden');
        this.responseText.style.display = 'block';
        
        // Set response text
        this.responseText.textContent = text;
        
        // Reset button
        this.button.disabled = false;
        this.button.textContent = 'Ask Assistant';
        
        console.log('✅ Response displayed successfully:', text.substring(0, 50) + '...');
    }
}

// Scroll Effects and Animations
class ScrollEffects {
    constructor() {
        console.log('🎭 Initializing Premium Scroll Effects...');
        this.init();
    }

    init() {
        this.setupParallax();
        this.setupFadeInAnimations();
        this.setupNavigationEffects();
    }

    setupParallax() {
        const heroBackground = document.querySelector('.hero-background');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.3;
            
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${parallax}px)`;
            }
        });
    }

    setupFadeInAnimations() {
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

        document.querySelectorAll('.section-card, .portfolio-item, .journey-item, .story-phase').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }

    setupNavigationEffects() {
        const nav = document.querySelector('.top-navigation');
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                nav.style.background = 'rgba(15, 20, 25, 0.98)';
                nav.style.backdropFilter = 'blur(25px)';
            } else {
                nav.style.background = 'rgba(15, 20, 25, 0.95)';
                nav.style.backdropFilter = 'blur(20px)';
            }
        });
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.startTime = performance.now();
        this.checkPoints = {};
    }

    mark(name) {
        this.checkPoints[name] = performance.now() - this.startTime;
        console.log(`⏱️ ${name}: ${this.checkPoints[name].toFixed(2)}ms`);
    }

    summary() {
        console.log('📊 Performance Summary:', this.checkPoints);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded - Starting Premium Portfolio initialization...');
    
    const monitor = new PerformanceMonitor();
    
    setTimeout(() => {
        console.log('⚡ Initializing all premium systems...');
        
        // Initialize particle system
        try {
            globalParticleSystem = new ParticleSystem();
            monitor.mark('Particle System');
        } catch (error) {
            console.error('❌ Particle System failed:', error);
        }
        
        // Initialize navigation system
        try {
            globalNavigation = new Navigation();
            monitor.mark('Navigation System');
        } catch (error) {
            console.error('❌ Navigation System failed:', error);
        }
        
        // Initialize counter animation
        try {
            const counterAnimation = new CounterAnimation();
            monitor.mark('Counter Animation');
        } catch (error) {
            console.error('❌ Counter Animation failed:', error);
        }
        
        // Initialize AI assistant
        try {
            globalAIAssistant = new AIAssistant();
            monitor.mark('AI Assistant');
        } catch (error) {
            console.error('❌ AI Assistant failed:', error);
        }
        
        // Initialize scroll effects
        try {
            const scrollEffects = new ScrollEffects();
            monitor.mark('Scroll Effects');
        } catch (error) {
            console.error('❌ Scroll Effects failed:', error);
        }
        
        // Premium page entrance
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);

        monitor.mark('Total Initialization');
        monitor.summary();

        console.log('🎉 Premium Portfolio fully initialized!');
        console.log('%c🚀 S J BENADIC AMALAN - Global Innovation Pioneer', 'color: #FFD700; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px rgba(255,215,0,0.5);');
        console.log('%c🌟 Premium Portfolio with Enhanced Mobile Design', 'color: #8E44AD; font-size: 16px; font-weight: bold;');
        console.log('%c✅ All premium systems operational with mobile optimization', 'color: #4CAF50; font-weight: bold;');
        
    }, 100);
});

// Premium debug functions
window.debugPortfolio = {
    testParticles: () => {
        console.log('🎨 Particle System Debug:', globalParticleSystem);
        if (globalParticleSystem) {
            console.log('Particles count:', globalParticleSystem.particles.length);
            console.log('Is running:', globalParticleSystem.isRunning);
        }
    },
    testNavigation: () => {
        console.log('🧭 Navigation Debug:', globalNavigation);
        if (globalNavigation) {
            console.log('Current section:', globalNavigation.currentSection);
            console.log('Mobile menu active:', globalNavigation.navMenu?.classList.contains('active'));
        }
    },
    testAI: () => {
        console.log('🤖 AI Assistant Debug:', globalAIAssistant);
        if (globalAIAssistant) {
            console.log('Available responses:', Object.keys(globalAIAssistant.responses).length);
            console.log('Elements:', {
                textarea: !!globalAIAssistant.textarea,
                button: !!globalAIAssistant.button,
                responseContainer: !!globalAIAssistant.responseContainer,
                responseText: !!globalAIAssistant.responseText
            });
        }
    },
    testMobile: () => {
        console.log('📱 Mobile Test:', {
            screenWidth: window.innerWidth,
            isMobile: window.innerWidth <= 768,
            touchSupport: 'ontouchstart' in window
        });
    },
    testAIResponse: () => {
        if (globalAIAssistant) {
            globalAIAssistant.showResponse('This is a test response to verify AI functionality is working correctly.');
        }
    }
};

// Touch and mobile optimizations
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Optimize touch interactions
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
}

// Prevent zoom on double tap for better mobile experience
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);