// Global variables
let globalParticleSystem = null;
let globalAIAssistant = null;
let globalAnimationController = null;

// Enhanced Particle System with premium luxury effects
class LuxuryParticleSystem {
    constructor() {
        console.log('🌟 Initializing Luxury Particle System...');
        
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) {
            console.error('❌ Particle canvas not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.maxParticles = this.getMaxParticles();
        this.colors = ['#FFD700', '#E8B4B8', '#8E44AD', '#BDC3C7', '#F8F9FA', '#1B2951'];
        this.animationId = null;
        this.isRunning = false;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.setupEventListeners();
        this.startAnimation();
        console.log('✅ Luxury Particle System initialized');
    }

    getMaxParticles() {
        const width = window.innerWidth;
        if (width < 768) return 25;
        if (width < 1024) return 50;
        return 80;
    }

    init() {
        this.resize();
        this.createParticles();
        this.createConnections();
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
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                radius: Math.random() * 4 + 2,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                alpha: Math.random() * 0.6 + 0.3,
                pulseSpeed: Math.random() * 0.015 + 0.008,
                pulsePhase: Math.random() * Math.PI * 2,
                glowIntensity: Math.random() * 0.5 + 0.5
            });
        }
    }

    createConnections() {
        this.connections = [];
        const maxConnections = Math.floor(this.maxParticles / 4);
        
        for (let i = 0; i < maxConnections; i++) {
            this.connections.push({
                start: Math.floor(Math.random() * this.particles.length),
                end: Math.floor(Math.random() * this.particles.length),
                opacity: Math.random() * 0.25 + 0.1,
                pulseSpeed: Math.random() * 0.008 + 0.003
            });
        }
    }

    updateParticles() {
        const time = Date.now() * 0.001;
        
        this.particles.forEach(particle => {
            // Basic movement with luxury smoothness
            particle.x += particle.vx * 0.8;
            particle.y += particle.vy * 0.8;

            // Mouse interaction with premium feel
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const force = (120 - distance) / 120;
                particle.vx -= dx * force * 0.0008;
                particle.vy -= dy * force * 0.0008;
                particle.glowIntensity = Math.min(2, particle.glowIntensity + force * 0.02);
            } else {
                particle.glowIntensity = Math.max(0.5, particle.glowIntensity - 0.01);
            }

            // Elegant pulse animation
            particle.pulsePhase += particle.pulseSpeed;
            particle.alpha = 0.4 + Math.sin(particle.pulsePhase) * 0.2;

            // Boundary handling with wrap-around
            if (particle.x < -30) particle.x = this.canvas.width + 30;
            if (particle.x > this.canvas.width + 30) particle.x = -30;
            if (particle.y < -30) particle.y = this.canvas.height + 30;
            if (particle.y > this.canvas.height + 30) particle.y = -30;

            // Gentle velocity damping
            particle.vx *= 0.998;
            particle.vy *= 0.998;

            // Add subtle organic movement
            particle.vx += (Math.random() - 0.5) * 0.015;
            particle.vy += (Math.random() - 0.5) * 0.015;

            // Velocity limits for premium smoothness
            const maxVel = 2;
            particle.vx = Math.max(-maxVel, Math.min(maxVel, particle.vx));
            particle.vy = Math.max(-maxVel, Math.min(maxVel, particle.vy));
        });
    }

    drawParticles() {
        this.particles.forEach((particle, index) => {
            this.ctx.save();
            
            // Main particle with luxury glow
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 20 * particle.glowIntensity;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Premium outer glow effect
            this.ctx.globalAlpha = particle.alpha * 0.2;
            this.ctx.shadowBlur = 35 * particle.glowIntensity;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius * 2.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    drawConnections() {
        const maxDistance = 150;
        
        this.connections.forEach(connection => {
            const startParticle = this.particles[connection.start];
            const endParticle = this.particles[connection.end];
            
            if (!startParticle || !endParticle) return;
            
            const dx = startParticle.x - endParticle.x;
            const dy = startParticle.y - endParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const alpha = (1 - distance / maxDistance) * connection.opacity;
                
                this.ctx.save();
                this.ctx.globalAlpha = alpha;
                this.ctx.strokeStyle = startParticle.color;
                this.ctx.lineWidth = 1.5;
                this.ctx.shadowColor = startParticle.color;
                this.ctx.shadowBlur = 8;
                
                // Create gradient line for premium effect
                const gradient = this.ctx.createLinearGradient(
                    startParticle.x, startParticle.y,
                    endParticle.x, endParticle.y
                );
                gradient.addColorStop(0, startParticle.color);
                gradient.addColorStop(1, endParticle.color);
                this.ctx.strokeStyle = gradient;
                
                this.ctx.beginPath();
                this.ctx.moveTo(startParticle.x, startParticle.y);
                this.ctx.lineTo(endParticle.x, endParticle.y);
                this.ctx.stroke();
                
                this.ctx.restore();
            }
        });
    }

    animate() {
        if (!this.ctx || !this.isRunning) return;
        
        // Clear with premium trail effect
        this.ctx.fillStyle = 'rgba(15, 20, 25, 0.08)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
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

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.maxParticles = this.getMaxParticles();
                this.resize();
                this.createParticles();
                this.createConnections();
            }, 300);
        });
    }
}

// Premium Animation Controller
class PremiumAnimationController {
    constructor() {
        console.log('🎭 Initializing Premium Animation Controller...');
        
        this.observers = [];
        this.animatedElements = new Set();
        this.skillBarsAnimated = false;
        this.countersAnimated = false;
        
        this.init();
        console.log('✅ Premium Animation Controller initialized');
    }

    init() {
        this.setupScrollAnimations();
        this.setupSkillBarAnimations();
        this.setupCounterAnimations();
        this.setupSmoothScrolling();
        this.setupScrollToTop();
        this.setupNavigationHighlighting();
    }

    setupScrollAnimations() {
        const animationElements = document.querySelectorAll('[data-aos]');
        
        if (animationElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                        this.animatedElements.add(entry.target);
                    }, parseInt(delay));
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        animationElements.forEach(el => {
            observer.observe(el);
        });

        this.observers.push(observer);
    }

    setupSkillBarAnimations() {
        const skillBars = document.querySelectorAll('.skill-fill');
        
        if (skillBars.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.skillBarsAnimated) {
                    this.animateSkillBars();
                    this.skillBarsAnimated = true;
                }
            });
        }, {
            threshold: 0.3
        });

        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            observer.observe(skillsSection);
        }

        this.observers.push(observer);
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-fill');
        
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
                
                // Premium completion effect
                setTimeout(() => {
                    bar.style.boxShadow = `0 0 25px rgba(255, 215, 0, 0.6)`;
                    setTimeout(() => {
                        bar.style.boxShadow = `0 8px 32px rgba(255, 215, 0, 0.2)`;
                    }, 300);
                }, 1200);
            }, index * 120);
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.countersAnimated) {
                    this.animateCounters();
                    this.countersAnimated = true;
                }
            });
        }, {
            threshold: 0.5
        });

        const heroSection = document.getElementById('hero');
        if (heroSection) {
            observer.observe(heroSection);
        }

        this.observers.push(observer);
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach((counter, index) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2500 + (index * 300);
            const start = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Premium easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(easeOutQuart * target);
                
                counter.textContent = current;
                
                if (progress >= 1) {
                    counter.style.textShadow = `0 0 25px rgba(255, 215, 0, 0.8)`;
                    setTimeout(() => {
                        counter.style.textShadow = `0 0 15px rgba(255, 215, 0, 0.4)`;
                    }, 600);
                } else {
                    requestAnimationFrame(animate);
                }
            };
            
            setTimeout(() => {
                requestAnimationFrame(animate);
            }, index * 250);
        });
    }

    setupSmoothScrolling() {
        const navItems = document.querySelectorAll('.nav-item, [href^="#"]');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href');
                
                if (targetId && targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 100;
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    setupScrollToTop() {
        const scrollBtn = document.getElementById('scroll-top');
        
        if (!scrollBtn) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupNavigationHighlighting() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('section[id]');
        
        if (sections.length === 0 || navItems.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navItems.forEach(item => item.classList.remove('active'));
                    
                    const activeNavItem = document.querySelector(`[data-section="${id}"]`);
                    if (activeNavItem) {
                        activeNavItem.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.4,
            rootMargin: '-100px 0px -100px 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });

        this.observers.push(observer);
    }
}

// Premium AI Assistant - Updated for S J BENADIC AMALAN
class PremiumAIAssistant {
    constructor() {
        console.log('🤖 Initializing Premium AI Assistant...');
        
        // Find elements with error checking
        this.textarea = document.getElementById('user-question');
        this.button = document.getElementById('ask-button');
        this.responseContainer = document.getElementById('assistant-response');
        this.loading = document.getElementById('loading');
        this.responseText = document.getElementById('response-text');
        
        console.log('🔍 AI Assistant Elements Check:');
        console.log('- Textarea:', !!this.textarea);
        console.log('- Button:', !!this.button);
        console.log('- Response Container:', !!this.responseContainer);
        console.log('- Loading:', !!this.loading);
        console.log('- Response Text:', !!this.responseText);
        
        if (!this.validateElements()) {
            console.error('❌ AI Assistant elements not found!');
            return;
        }
        
        this.responses = this.initializeResponses();
        this.conversationHistory = [];
        this.isProcessing = false;
        
        this.init();
        console.log('✅ Premium AI Assistant initialized successfully');
    }

    validateElements() {
        const isValid = this.textarea && this.button && this.responseContainer && this.loading && this.responseText;
        if (!isValid) {
            console.error('Missing elements:', {
                textarea: !this.textarea,
                button: !this.button,
                responseContainer: !this.responseContainer,
                loading: !this.loading,
                responseText: !this.responseText
            });
        }
        return isValid;
    }

    initializeResponses() {
        return {
            'experience': {
                text: "S J BENADIC AMALAN has over 8 years of comprehensive experience in technology and business. Starting with Offer Zone 360 in 2015, he evolved through strategic freelance roles from 2019-2023, mastering UI/UX design, full-stack development, digital marketing, and business analysis before founding Cossmicrings Solutions in 2024 with a team of 15 professionals.",
                category: "professional"
            },
            'company': {
                text: "Cossmicrings Solutions Private Limited is S J BENADIC AMALAN's flagship innovation hub with a dedicated team of 15 professionals. The company specializes in cutting-edge technologies including AI, blockchain, IoT, and NFC. It operates two strategic divisions: Upbrando (Brand Strategy & Digital Marketing) and Jeff AI (Artificial Intelligence Solutions & Customer Support Automation).",
                category: "business"
            },
            'skills': {
                text: "S J BENADIC AMALAN possesses a unique multidisciplinary skill set spanning technical expertise (SAP FICO 90%, SAP HCM 85%, Microsoft BI 88%, Java, C/C++, SQL), advanced digital marketing (Meta Business 95%, Google Ads 92%, SEO 90%, SEM 87%), strategic business skills (Market Analysis 93%, Strategic Planning 95%, Financial Modeling 85%), and creative capabilities (Design Thinking 92%, Video Editing 88%, PowerPoint 95%).",
                category: "technical"
            },
            'research': {
                text: "From 2019-2023, S J BENADIC AMALAN conducted extensive solo research expeditions across 9 countries including Dubai, Singapore, Malaysia, Thailand, Sri Lanka, Sharjah, Bahrain, and China. This comprehensive global intelligence gathering, particularly through repeated Canton Fair visits, led to his discovery of the significant 30-50 year technology gap between Chinese and Indian markets.",
                category: "research"
            },
            'mission': {
                text: "S J BENADIC AMALAN's primary mission is bridging the significant 30-50 year technology gap between China and India through strategic innovation, comprehensive research, and implementation of cutting-edge solutions. His vision is to drive global technological advancement and create sustainable competitive advantages for Indian markets through AI, blockchain, IoT, and NFC technologies.",
                category: "vision"
            },
            'contact': {
                text: "You can connect with S J BENADIC AMALAN through multiple channels: Email at sjbennyamalan@gmail.com for business inquiries, call +91-95979 59015 for direct communication, or connect professionally on LinkedIn at linkedin.com/in/benadic-amalan-79275410. His innovation hub, Cossmicrings Solutions, is located at 17/8 Sagayamatha St, Ganaolivupuram, Madurai 625016, Tamil Nadu, India.",
                category: "contact"
            },
            'journey': {
                text: "S J BENADIC AMALAN's entrepreneurial journey began in 2015 with Offer Zone 360, an e-commerce platform for branded surplus apparel. He then strategically evolved through freelance roles (2019-2023), progressing from UI/UX Designer → Full-Stack Developer → Digital Marketing Specialist → Business Analyst, while simultaneously conducting international market research across 9 countries, culminating in founding Cossmicrings Solutions in 2024.",
                category: "timeline"
            },
            'team': {
                text: "Cossmicrings Solutions operates with a carefully curated team of 15 specialized professionals working on innovative projects across AI, blockchain, IoT, and NFC technologies. The team is strategically structured across two main divisions: Upbrando for comprehensive brand strategy and digital marketing, and Jeff AI for artificial intelligence solutions and customer support automation.",
                category: "organization"
            },
            'innovation': {
                text: "S J BENADIC AMALAN's innovation focus spans multiple cutting-edge domains: AI-powered customer support automation through Jeff AI division, sustainable hydroponic agriculture systems (specialized training at IHT Delhi 2022), advanced cosmetic chemistry with natural product formulation, blockchain-based solutions, and NFC technology applications for next-generation business automation.",
                category: "innovation"
            },
            'default': {
                text: "S J BENADIC AMALAN is a visionary tech entrepreneur and global innovation pioneer dedicated to bridging technological gaps between international markets. As the founder of Cossmicrings Solutions with 15 team members, he combines extensive international research experience across 9 countries with deep technical expertise in AI, blockchain, IoT, and digital marketing. Feel free to ask about his experience, company structure, technical skills, international research, or innovative projects!",
                category: "general"
            }
        };
    }

    init() {
        console.log('🔗 Setting up Premium AI Assistant event listeners...');
        this.setupEventListeners();
        this.addKeyboardShortcuts();
        this.initializeUI();
        console.log('✅ Premium AI Assistant setup completed');
    }

    setupEventListeners() {
        // Button click handler
        if (this.button) {
            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🎯 Ask button clicked!');
                this.handleQuestion();
            });
        }
        
        // Enter key handler
        if (this.textarea) {
            this.textarea.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    console.log('🎯 Ctrl+Enter pressed!');
                    this.handleQuestion();
                }
            });

            // Auto-resize textarea
            this.textarea.addEventListener('input', () => {
                this.textarea.style.height = 'auto';
                this.textarea.style.height = Math.min(this.textarea.scrollHeight, 200) + 'px';
            });
        }
    }

    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                if (this.textarea) {
                    this.textarea.focus();
                    this.textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    initializeUI() {
        if (!this.textarea) return;
        
        const suggestions = [
            "Tell me about S J BENADIC AMALAN's international research experience across 9 countries",
            "What makes Cossmicrings Solutions unique in the AI and blockchain space?",
            "How did S J BENADIC AMALAN discover the 30-50 year technology gap between China and India?",
            "Explain the two main divisions: Upbrando and Jeff AI",
            "What are S J BENADIC AMALAN's core technical skills and expertise levels?",
            "Describe S J BENADIC AMALAN's journey from e-commerce to AI innovation"
        ];
        
        let currentSuggestion = 0;
        const cycleSuggestions = () => {
            if (!this.textarea.value && document.activeElement !== this.textarea) {
                this.textarea.placeholder = suggestions[currentSuggestion];
                currentSuggestion = (currentSuggestion + 1) % suggestions.length;
            }
        };
        
        cycleSuggestions(); // Set initial suggestion
        setInterval(cycleSuggestions, 4500);
    }

    async handleQuestion() {
        if (this.isProcessing) {
            console.log('⏳ Already processing a question...');
            return;
        }

        const question = this.textarea.value.trim();
        console.log('📝 Question received:', question);
        
        if (!question) {
            this.showError('Please enter a question first!');
            return;
        }

        this.isProcessing = true;
        this.conversationHistory.push({ 
            type: 'question', 
            content: question, 
            timestamp: Date.now() 
        });
        
        this.showLoading();
        
        try {
            // Simulate premium AI processing time
            const processingTime = 1200 + Math.random() * 2500;
            await new Promise(resolve => setTimeout(resolve, processingTime));
            
            const response = this.generateResponse(question);
            console.log('💬 Generated response for category:', response.category);
            
            this.showResponse(response);
            
            this.conversationHistory.push({ 
                type: 'answer', 
                content: response.text, 
                category: response.category,
                timestamp: Date.now() 
            });
            
        } catch (error) {
            console.error('❌ AI Assistant error:', error);
            this.showError('Sorry, I encountered an error processing your question. Please try again.');
        } finally {
            this.isProcessing = false;
        }
    }

    generateResponse(question) {
        const lowerQuestion = question.toLowerCase();
        console.log('🔍 Analyzing question:', lowerQuestion.substring(0, 50) + '...');
        
        // Enhanced keyword matching with weighted scoring
        const keywordMap = {
            experience: {
                words: ['experience', 'background', 'career', 'professional', 'work', 'history', 'freelance'],
                weight: 1
            },
            company: {
                words: ['company', 'cossmicrings', 'business', 'organization', 'firm', 'startup', 'solutions'],
                weight: 1
            },
            skills: {
                words: ['skill', 'technical', 'programming', 'expertise', 'ability', 'competency', 'sap', 'java'],
                weight: 1
            },
            research: {
                words: ['research', 'country', 'international', 'global', 'china', 'study', 'analysis', 'canton', 'fair'],
                weight: 1
            },
            mission: {
                words: ['mission', 'goal', 'vision', 'objective', 'purpose', 'bridge', 'gap', 'technology'],
                weight: 1
            },
            contact: {
                words: ['contact', 'email', 'phone', 'reach', 'connect', 'linkedin', 'address'],
                weight: 1
            },
            journey: {
                words: ['journey', 'start', 'began', 'evolution', 'progression', 'path', 'timeline'],
                weight: 1
            },
            team: {
                words: ['team', 'member', 'employee', 'staff', 'people', 'workforce', '15'],
                weight: 1
            },
            innovation: {
                words: ['innovation', 'ai', 'blockchain', 'iot', 'technology', 'hydroponic', 'chemistry', 'jeff'],
                weight: 1
            }
        };

        let bestMatch = 'default';
        let highestScore = 0;

        Object.entries(keywordMap).forEach(([category, config]) => {
            let score = 0;
            config.words.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                const matches = (lowerQuestion.match(regex) || []).length;
                score += matches * config.weight;
            });
            
            if (score > highestScore) {
                highestScore = score;
                bestMatch = category;
            }
        });

        console.log(`🎯 Best match: ${bestMatch} (score: ${highestScore})`);
        return this.responses[bestMatch] || this.responses.default;
    }

    showLoading() {
        console.log('⏳ Showing loading state...');
        
        if (this.responseContainer) this.responseContainer.classList.remove('hidden');
        if (this.loading) this.loading.classList.remove('hidden');
        if (this.responseText) this.responseText.classList.add('hidden');
        
        if (this.button) {
            this.button.disabled = true;
            this.button.innerHTML = '<span class="btn-icon">⏳</span>Processing...';
            this.button.style.animation = 'luxuryPulse 1s ease-in-out infinite';
        }
    }

    showResponse(responseObj) {
        console.log('💬 Displaying response...');
        
        if (this.loading) this.loading.classList.add('hidden');
        if (this.responseText) {
            this.responseText.classList.remove('hidden');
            this.typewriterEffect(responseObj.text);
        }
        
        if (this.button) {
            this.button.disabled = false;
            this.button.innerHTML = '<span class="btn-icon">🚀</span>Ask Assistant';
            this.button.style.animation = '';
        }
    }

    typewriterEffect(text) {
        if (!this.responseText) return;
        
        this.responseText.textContent = '';
        let index = 0;
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                this.responseText.textContent += text.charAt(index);
                index++;
                
                // Auto scroll
                this.responseText.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                clearInterval(typeInterval);
                
                // Premium completion effect
                this.responseText.style.animation = 'luxuryGlow 0.6s ease-in-out';
                setTimeout(() => {
                    if (this.responseText) {
                        this.responseText.style.animation = '';
                    }
                }, 600);
            }
        }, 30); // Luxury typing speed
    }

    showError(message) {
        console.log('❌ Showing error:', message);
        
        if (this.responseContainer) this.responseContainer.classList.remove('hidden');
        if (this.loading) this.loading.classList.add('hidden');
        if (this.responseText) {
            this.responseText.classList.remove('hidden');
            this.responseText.textContent = `⚠️ ${message}`;
            this.responseText.style.color = '#E8B4B8';
            
            setTimeout(() => {
                if (this.responseText) {
                    this.responseText.style.color = '';
                }
            }, 3500);
        }
        
        if (this.button) {
            this.button.disabled = false;
            this.button.innerHTML = '<span class="btn-icon">🚀</span>Ask Assistant';
            this.button.style.animation = '';
        }
    }
}

// CSS Animation styles injector for premium effects
function injectPremiumAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        [data-aos] {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 1s ease, transform 1s ease;
        }
        
        [data-aos="fade-up"] {
            transform: translateY(60px);
        }
        
        [data-aos="fade-left"] {
            transform: translateX(60px);
        }
        
        [data-aos="fade-right"] {
            transform: translateX(-60px);
        }
        
        [data-aos="zoom-in"] {
            transform: scale(0.7);
        }
        
        [data-aos].aos-animate {
            opacity: 1;
            transform: translateY(0) translateX(0) scale(1);
        }
        
        .skill-fill {
            transition: width 2.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .floating-nav {
            animation: luxuryFloat 8s ease-in-out infinite;
        }
        
        @keyframes luxuryFloat {
            0%, 100% { transform: translateY(-50%) translateX(0); }
            50% { transform: translateY(-50%) translateX(8px); }
        }
    `;
    document.head.appendChild(style);
}

// Performance monitoring for premium experience
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            particlesFPS: 0
        };
        
        this.init();
    }
    
    init() {
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now();
            console.log(`⚡ Premium Portfolio loaded in ${this.metrics.loadTime.toFixed(2)}ms`);
        });
        
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                this.metrics.particlesFPS = frameCount;
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        measureFPS();
        
        setInterval(() => {
            console.log(`📊 Premium Performance: ${this.metrics.particlesFPS} FPS`);
        }, 20000);
    }
}

// Initialize premium portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Premium Luxury Portfolio initializing...');
    console.log('%c🌟 S J BENADIC AMALAN - PREMIUM LUXURY PORTFOLIO', 'color: #FFD700; font-size: 22px; font-weight: bold; text-shadow: 0 0 15px #FFD700;');
    
    // Inject premium animation styles first
    injectPremiumAnimationStyles();
    
    // Initialize with luxury delays for premium feel
    setTimeout(() => {
        try {
            globalParticleSystem = new LuxuryParticleSystem();
            console.log('✅ Luxury Particle System ready');
        } catch (error) {
            console.error('❌ Particle System failed:', error);
        }
        
        try {
            globalAnimationController = new PremiumAnimationController();
            console.log('✅ Premium Animation Controller ready');
        } catch (error) {
            console.error('❌ Animation Controller failed:', error);
        }
        
        try {
            globalAIAssistant = new PremiumAIAssistant();
            console.log('✅ Premium AI Assistant ready');
        } catch (error) {
            console.error('❌ AI Assistant failed:', error);
        }
        
        try {
            new PerformanceMonitor();
            console.log('✅ Performance Monitor ready');
        } catch (error) {
            console.error('❌ Performance Monitor failed:', error);
        }
        
        // Premium page reveal animation
        document.body.style.transition = 'opacity 1.2s ease-in-out';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
            console.log('🎉 Premium Luxury Portfolio fully loaded and operational!');
            console.log('%c✨ All luxury systems ready - Premium experience activated!', 'color: #E8B4B8; font-weight: bold; font-size: 16px;');
        }, 400);
        
    }, 300);
});

// Premium debug utilities
window.premiumPortfolioDebug = {
    particles: () => globalParticleSystem,
    animations: () => globalAnimationController,
    ai: () => globalAIAssistant,
    testAI: () => {
        if (globalAIAssistant) {
            console.log('Premium AI Assistant Status:');
            console.log('- Elements valid:', globalAIAssistant.validateElements());
            console.log('- Processing:', globalAIAssistant.isProcessing);
            console.log('- Conversation history:', globalAIAssistant.conversationHistory.length);
        }
    },
    testParticles: () => {
        if (globalParticleSystem) {
            console.log('Luxury Particles:', globalParticleSystem.particles.length);
            console.log('Running:', globalParticleSystem.isRunning);
        }
    }
};

// Premium error handling
window.addEventListener('error', (e) => {
    console.error('🚨 Premium Portfolio Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('🚨 Unhandled Premium Promise:', e.reason);
});

console.log('📱 Premium Luxury Portfolio scripts loaded successfully - Ready for premium initialization');