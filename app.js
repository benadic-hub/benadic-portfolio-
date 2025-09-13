// Debounce function to limit function calls on resize/scroll
const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

// Throttle function to limit execution frequency
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Global variables
let canvas, ctx, particles = [];
let animationFrameId;
const maxParticles = 100;

// Initialize particle system
function initParticleSystem() {
    canvas = document.getElementById('particle-canvas');
    if (!canvas) {
        console.error('Particle canvas not found');
        return;
    }
    
    ctx = canvas.getContext('2d');
    resizeCanvas();
    
    // Create initial particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    // Start animation
    animateParticles();
    console.log('Particle system initialized with', particles.length, 'particles');
}

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
}

class Particle {
    constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = this.getRandomColor();
        this.alpha = Math.random() * 0.8 + 0.2;
    }
    
    getRandomColor() {
        const colors = ['#6EE7B7', '#3B82F6', '#9333EA', '#14b8a6', '#f59e0b', '#ef4444'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        
        // Slight size variation
        if (this.size > 0.5) this.size -= 0.005;
        else this.size = Math.random() * 2 + 1;
    }

    draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createParticles() {
    while (particles.length < maxParticles) {
        particles.push(new Particle());
    }
}

function handleParticles() {
    if (!ctx || !canvas) return;
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Draw connections between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.save();
                ctx.globalAlpha = (1 - distance / 100) * 0.3;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 0.2;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.restore();
            }
        }
    }
}

function animateParticles() {
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createParticles();
    handleParticles();
    
    animationFrameId = requestAnimationFrame(animateParticles);
}

// Counter Animation System
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-target]');
    console.log('Found', counters.length, 'counters to animate');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                console.log('Animating counter to:', target);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();
    let currentValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        currentValue = Math.floor(easeOutQuart * target);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
            console.log('Counter animation completed:', target);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// AI Assistant System
function initAIAssistant() {
    const questionInput = document.getElementById('question-input');
    const getResponseBtn = document.getElementById('get-response-btn');
    const responseText = document.getElementById('response-text');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    console.log('AI Assistant elements:', {
        questionInput: !!questionInput,
        getResponseBtn: !!getResponseBtn,
        responseText: !!responseText,
        loadingIndicator: !!loadingIndicator
    });
    
    if (!questionInput || !getResponseBtn || !responseText || !loadingIndicator) {
        console.error('AI Assistant elements not found');
        return;
    }
    
    // Mock responses for the AI Assistant
    const mockResponses = {
        'cossmicrings': "Cossmicrings Solutions Private Limited is my flagship company with 15 team members, specializing in AI, blockchain, IoT, and NFC technologies. It has two divisions: Upbrando (Brand Strategy) and Jeff AI (Artificial Intelligence).",
        'experience': "I have extensive experience starting with Offer Zone 360 in 2015, followed by a freelance career from 2019-2023 evolving from UI/UX Designer to Full-Stack Developer, Digital Marketing Specialist, and Business Analyst.",
        'research': "I conducted international research across 9 countries including Dubai, Singapore, Malaysia, Thailand, Sri Lanka, Sharjah, Bahrain, and three visits to China's Canton Fair to study technology gaps.",
        'mission': "My mission is to bridge the significant 30-50 year technology gap I identified between China and India through strategic innovation and cutting-edge solutions.",
        'skills': "I have diverse technical skills including SAP FICO, SAP HCM, Microsoft BI, Java, C/C++, SQL, plus expertise in digital marketing with Meta Business, Google Ads, WordPress, SEO, and SEM.",
        'team': "Cossmicrings Solutions has 15 dedicated team members working on AI, blockchain, IoT, and NFC technologies across our various divisions.",
        'contact': "You can reach me at sjbennyamalan@gmail.com, +91-95979 59015, or connect on LinkedIn. My office is located at 17/8 Sagayamatha St, Ganaolivupuram, Madurai 625016.",
        'journey': "My journey began with Offer Zone 360 in 2015, evolved through strategic freelance roles, international research expeditions, and now culminates in founding Cossmicrings Solutions.",
        'hydroponics': "In 2022, I completed specialized training in hydroponic cultivation at IHT Delhi, focusing on sustainable agriculture and smart farming technologies.",
        'upbrando': "Upbrando is our Brand Strategy Division that provides comprehensive digital marketing services as part of Cossmicrings Solutions.",
        'jeff ai': "Jeff AI is our Artificial Intelligence Division that focuses on customer support automation and intelligent chatbot solutions.",
        'default': "I'm Benadic Amalan SJ, a visionary tech entrepreneur dedicated to bridging technology gaps between markets. Feel free to ask about my experience, company, skills, or research work!"
    };

    function generateMockResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        if (lowerQuestion.includes('cossmicrings') || lowerQuestion.includes('company') || lowerQuestion.includes('business')) {
            return mockResponses.cossmicrings;
        } else if (lowerQuestion.includes('experience') || lowerQuestion.includes('background') || lowerQuestion.includes('career')) {
            return mockResponses.experience;
        } else if (lowerQuestion.includes('research') || lowerQuestion.includes('country') || lowerQuestion.includes('international') || lowerQuestion.includes('china')) {
            return mockResponses.research;
        } else if (lowerQuestion.includes('mission') || lowerQuestion.includes('goal') || lowerQuestion.includes('gap') || lowerQuestion.includes('bridge')) {
            return mockResponses.mission;
        } else if (lowerQuestion.includes('skill') || lowerQuestion.includes('technical') || lowerQuestion.includes('programming') || lowerQuestion.includes('sap')) {
            return mockResponses.skills;
        } else if (lowerQuestion.includes('team') || lowerQuestion.includes('member') || lowerQuestion.includes('staff') || lowerQuestion.includes('employee')) {
            return mockResponses.team;
        } else if (lowerQuestion.includes('contact') || lowerQuestion.includes('email') || lowerQuestion.includes('phone') || lowerQuestion.includes('linkedin')) {
            return mockResponses.contact;
        } else if (lowerQuestion.includes('journey') || lowerQuestion.includes('start') || lowerQuestion.includes('began') || lowerQuestion.includes('offer zone')) {
            return mockResponses.journey;
        } else if (lowerQuestion.includes('hydroponic') || lowerQuestion.includes('agriculture') || lowerQuestion.includes('farming')) {
            return mockResponses.hydroponics;
        } else if (lowerQuestion.includes('upbrando') || lowerQuestion.includes('brand strategy')) {
            return mockResponses.upbrando;
        } else if (lowerQuestion.includes('jeff ai') || lowerQuestion.includes('artificial intelligence') || lowerQuestion.includes('chatbot')) {
            return mockResponses['jeff ai'];
        } else {
            return mockResponses.default;
        }
    }

    async function handleAIRequest() {
        const userQuery = questionInput.value.trim();
        if (!userQuery) {
            alert('Please enter a question first!');
            return;
        }

        console.log('Processing AI request:', userQuery);

        // Show loading state
        responseText.textContent = '';
        loadingIndicator.classList.remove('hidden');
        getResponseBtn.disabled = true;
        getResponseBtn.textContent = 'Processing...';

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Generate mock response
            const response = generateMockResponse(userQuery);
            console.log('Generated response:', response.substring(0, 50) + '...');
            
            responseText.textContent = response;
            responseText.style.fontStyle = 'normal';
            
        } catch (error) {
            console.error("Error generating response:", error);
            responseText.textContent = "An error occurred while getting the response. Please try again.";
            responseText.style.fontStyle = 'normal';
        } finally {
            loadingIndicator.classList.add('hidden');
            getResponseBtn.disabled = false;
            getResponseBtn.textContent = 'Get Response ✨';
        }
    }

    // Event listeners
    getResponseBtn.addEventListener('click', handleAIRequest);
    
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleAIRequest();
        }
    });
    
    console.log('AI Assistant initialized successfully');
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Benadic Amalan SJ Portfolio...');
    
    // Small delay to ensure all elements are rendered
    setTimeout(() => {
        initParticleSystem();
        initCounterAnimations();
        initAIAssistant();
        initSmoothScrolling();
        
        console.log('✅ All systems initialized successfully!');
    }, 100);
});

// Handle window events
window.addEventListener('load', () => {
    console.log('🎨 Window loaded - ensuring particle system is running');
    if (!animationFrameId && canvas && ctx) {
        animateParticles();
    }
});

window.addEventListener('resize', debounce(() => {
    console.log('📏 Window resized - updating canvas');
    resizeCanvas();
}, 200));

window.addEventListener('scroll', throttle(() => {
    // Update canvas height if document height changed
    if (canvas && canvas.height !== Math.max(document.documentElement.scrollHeight, window.innerHeight)) {
        resizeCanvas();
    }
}, 100));

// Add some console styling for debugging
console.log('%c🚀 Benadic Amalan SJ Portfolio', 'color: #6366f1; font-size: 16px; font-weight: bold;');
console.log('%cParticle system loading... ✨', 'color: #10b981;');
console.log('%cCounter animations ready 📊', 'color: #f59e0b;');
console.log('%cAI Assistant loading... 🤖', 'color: #ec4899;');