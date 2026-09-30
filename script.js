// ============================================
// PORTFOLIO EXPERIENCE STATE MACHINE
// mode: "gate" | "interactive" | "static"
// Every full page reload starts back at "gate".
// ============================================
(function () {
    const body = document.body;
    const gate = document.getElementById('authenticity-gate');
    const journey = document.getElementById('journey');

    if (!gate || !journey) return; // fail gracefully if markup is missing

    const journeyEyebrow = document.getElementById('journey-eyebrow');
    const journeyHeading = document.getElementById('journey-heading');
    const journeyContext = document.getElementById('journey-context');
    const journeyBody = document.getElementById('journey-body');
    const journeyProgressLabel = document.getElementById('journey-progress-label');
    const continueBtn = document.getElementById('journey-continue-btn');
    const revalidateBtn = document.getElementById('journey-revalidate-btn');
    const backBtn = document.getElementById('journey-back-btn');
    const skipBtn = document.getElementById('journey-skip-btn');
    const gateStaticBtn = document.getElementById('gate-static-btn');
    const gateInteractiveBtn = document.getElementById('gate-interactive-btn');
    const heroInteractiveBtn = document.getElementById('hero-interactive-btn');

    // Steps mirror the order defined in dev_guidelines.md / refined_plan_v2.md
    const steps = [
        {
            id: 'about',
            eyebrow: "I'll start with concise view (who I am? how I think about engineering?)",
            heading: 'About',
            context: "Technologies, projects and job titles don't explain how someone approaches engineering. So.. this answers that..",
            source: { type: 'move', selector: '.about-content' }
        },
        {
            id: 'projects',
            eyebrow: 'From what I say → to what I actually build',
            heading: 'Personal Projects',
            context: 'A look at what has actually been built, not just a list of technologies used.',
            source: { type: 'move', selector: '.projects-grid' }
        },
        {
            id: 'thinking',
            eyebrow: 'How I think',
            heading: 'Engineering Thinking',
            context: 'Instead of a list of skills, here is the reasoning process behind the work. Expand a topic to read more..',
            source: { type: 'template', templateId: 'thinking-template' }
        },
        {
            id: 'experience',
            eyebrow: 'From personal projects → to professional work',
            heading: 'Experience',
            context: 'The professional context, contributions and outcomes behind each role.',
            source: { type: 'move', selector: '.experience-timeline' }
        },
        {
            id: 'technical',
            eyebrow: 'Technical depth',
            heading: 'Technical Skills',
            context: 'The tools and technologies used to put the engineering thinking into practice.',
            source: { type: 'move', selector: '.skills-grid' }
        },
        {
            id: 'leetcode',
            eyebrow: 'Problem solving',
            heading: 'LeetCode',
            context: 'Engineering isn\u2019t only about building systems. It\u2019s also about understanding problems.',
            source: { type: 'template', templateId: 'leetcode-template' }
        },
        {
            id: 'certifications',
            eyebrow: 'Supporting evidence',
            heading: 'Certifications & Awards',
            context: 'Credentials and recognitions earned along the way.',
            source: { type: 'move', selector: '.certifications-grid' }
        },
        {
            id: 'education',
            eyebrow: 'Where the foundation came from',
            heading: 'Education',
            context: 'A concise look at academic background.',
            source: { type: 'move', selector: '.education-timeline' }
        },
        {
            id: 'passion',
            eyebrow: 'Beyond the job title',
            heading: 'Flip side of me (Cricketer)',
            context: 'Engineering is the profession. Curiosity is what keeps me moving...',
            source: { type: 'move', selector: '.passion-content' }
        },
        {
            id: 'final',
            eyebrow: 'The journey so far',
            heading: "You've seen the context behind this portfolio",
            context: 'You can make your own judgment now...',
            source: { type: 'template', templateId: 'final-template' },
            isFinal: true
        }
    ];

    let currentStepIndex = 0;
    const movedNodes = []; // { node, parent, nextSibling } — restored when leaving interactive mode
    const stepContentCache = new Map(); // step.id -> already-relocated node, reused when revisiting a step

    function moveNodeToJourney(step) {
        if (stepContentCache.has(step.id)) return stepContentCache.get(step.id);
        const node = document.querySelector('#site-content ' + step.source.selector);
        if (!node) return null; // already relocated for this session
        movedNodes.push({ node, parent: node.parentElement, nextSibling: node.nextElementSibling });
        stepContentCache.set(step.id, node);
        return node;
    }

    function restoreMovedNodes() {
        movedNodes.forEach(({ node, parent, nextSibling }) => {
            if (nextSibling && nextSibling.parentElement === parent) {
                parent.insertBefore(node, nextSibling);
            } else {
                parent.appendChild(node);
            }
        });
        movedNodes.length = 0;
    }

    function renderStep(index) {
        const step = steps[index];

        journeyEyebrow.textContent = step.eyebrow;
        journeyHeading.textContent = step.heading;
        journeyContext.textContent = step.context;
        journeyProgressLabel.textContent = `Step ${index + 1} of ${steps.length}`;
        journeyBody.innerHTML = '';

        let content = null;
        if (step.source.type === 'move') {
            content = moveNodeToJourney(step);
        } else if (step.source.type === 'template') {
            const template = document.getElementById(step.source.templateId);
            if (template) content = template.content.cloneNode(true);
        }
        if (content) journeyBody.appendChild(content);

        continueBtn.textContent = step.isFinal ? "I'm Convinced →" : 'Continue →';
        revalidateBtn.hidden = !step.isFinal;
        backBtn.hidden = index === 0;

        // Focus management: move keyboard/AT focus to the new section heading
        journeyHeading.focus();
    }

    function enterInteractive() {
        currentStepIndex = 0;
        body.dataset.mode = 'interactive';
        renderStep(currentStepIndex);
    }

    function enterStatic() {
        restoreMovedNodes();
        body.dataset.mode = 'static';
        window.scrollTo(0, 0);
    }

    gateStaticBtn.addEventListener('click', enterStatic);
    gateInteractiveBtn.addEventListener('click', enterInteractive);

    // Lets a visitor who chose "static" earlier still opt into the guided journey later.
    if (heroInteractiveBtn) heroInteractiveBtn.addEventListener('click', enterInteractive);

    continueBtn.addEventListener('click', () => {
        if (currentStepIndex < steps.length - 1) {
            currentStepIndex += 1;
            renderStep(currentStepIndex);
        } else {
            enterStatic();
        }
    });

    // Not convinced yet: replay the journey from the beginning instead of exiting.
    revalidateBtn.addEventListener('click', () => {
        currentStepIndex = 0;
        renderStep(currentStepIndex);
    });

    backBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex -= 1;
            renderStep(currentStepIndex);
        }
    });

    // Fail-safe: the visitor can leave the guided journey at any point.
    skipBtn.addEventListener('click', enterStatic);
})();


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navbarEl = document.querySelector('.navbar');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        if (navbarEl) {
            // anchor the dropdown just below the navbar's actual rendered position
            const offset = navbarEl.getBoundingClientRect().bottom + 8;
            navLinks.style.setProperty('--nav-dropdown-top', `${offset}px`);
        }
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Active navigation link highlighting
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

document.querySelectorAll('section[id]').forEach(section => {
    observer.observe(section);
});

// Add animation to elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.project-card, .skill-category, .experience-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initialize elements with animation properties
document.querySelectorAll('.project-card, .skill-category, .experience-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
});

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Call once on load

// Add active style to current nav link
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 0.5rem;
    }
`;
document.head.appendChild(style);

// Optional: Log analytics or perform other tasks
console.log('Portfolio loaded successfully!');
